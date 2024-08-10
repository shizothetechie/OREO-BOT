// @ts-check
import {
	readFileSync,
	writeFileSync,
	existsSync
} from 'fs'
import db from './database.js'
import Connection from './socket.js'

/** @type {typeof import('@shizodevs/shizoweb')} */ // @ts-ignore
const {
	initAuthCreds,
	BufferJSON,
	proto,
	isJidBroadcast,
	isJidGroup,
	WAMessageStubType,
	updateMessageWithReceipt,
	updateMessageWithReaction,
	jidNormalizedUser
} = (await import('@shizodevs/shizoweb')).default

const TIME_TO_DATA_STALE = 5 * 60 * 1000

function makeInMemoryStore() {
	let chats = {}
	let messages = {}
	let state = { connection: 'close' }
	function loadMessage(jid, id = null) {
		let message = null
		if (jid && !id) {
			id = jid
			const filter = (m) => m.key?.id == id
			const messageFind = Object.entries(messages)
				.find(([, msgs]) => {
					return msgs.find(filter)
				})
			message = messageFind?.[1]?.find(filter)
		} else {
			jid = jid?.decodeJid?.()
			if (!(jid in messages)) return null;
			message = messages[jid].find(m => m.key.id == id)
		}
		return message ? message : null
	}

	async function getMessage(key) {
		let msg = (await loadMessage(jidNormalizedUser(key.remoteJid), jidNormalizedUser(key.id))).message || {}
	}
	async function fetchGroupMetadata(jid, groupMetadata) {
		jid = jid?.decodeJid?.()
		if (!isJidGroup(jid)) return
		if (!(jid in chats)) return chats[jid] = { id: jid }
		const isRequiredToUpdate = !chats[jid].metadata || Date.now() - (chats[jid].lastfetch || 0) > TIME_TO_DATA_STALE
		if (isRequiredToUpdate) {
			const metadata = await groupMetadata?.(jid)
			if (metadata) Object.assign(chats[jid], {
				subject: metadata.subject,
				lastfetch: Date.now(),
				metadata
			})
		}
		return chats[jid].metadata
	}

	function fetchMessageReceipts(id) {
		const msg = loadMessage(id)
		if (!msg) return null
		return msg.userReceipt
	}
	async function fetchImageUrl(jid, profilePictureUrl) {
		jid = jid?.decodeJid?.()
		if (!(jid in chats)) return chats[jid] = { id: jid }
		if (!chats[jid].imgUrl) {
			const url = await profilePictureUrl(jid, 'image').catch(() => './src/avatar_contact.png')
			if (url) chats[jid].imgUrl = url
		}
		return chats[jid].imgUrl
	}

	function getContact(jid) {
		jid = jid?.decodeJid?.()
		if (!(jid in chats)) return null
		return chats[jid]
	}

	const upsertMessage = (jid, message, type = 'append') => {
		jid = jid?.decodeJid?.()
		if (!(jid in messages)) messages[jid] = []

		delete message.message?.messageContextInfo
		delete message.message?.senderKeyDistributionMessage

		const msg = loadMessage(jid, message.key.id)
		if (msg) {
			Object.assign(msg, message)
		} else {
			if (type == 'append') messages[jid].push(message)
			else messages[jid].splice(0, 0, message)
		}
	}

	function bind(ev, opts = { groupMetadata: () => null }) {
		ev.on('connection.update', update => {
			Object.assign(state, update)
		})

		ev.on('chats.set', function store(chatsSet) {
			for (const chat of chatsSet.chats) {
				const id = chat.id?.decodeJid?.()
				if (!id) continue
				if (!(id in chats)) chats[id] = { ...chat, isChats: true, ...(chat.name ? { name: /** @type {String} */ (chat.name) } : {}) }
				if (chat.name) chats[id].name = chat.name
			}
		})

		ev.on('contacts.set', function store(contactsSet) {
			for (const contact of contactsSet.contacts) {
				const id = contact.id?.decodeJid?.()
				if (!id) continue
				chats[id] = Object.assign(chats[id] || {}, { ...contact, isContact: true })
			}
		})

		ev.on('messages.set', function store(messagesSet) {
			for (const message of messagesSet.messages) {
				const jid = message.key.remoteJid?.decodeJid?.()
				if (!jid) continue
				if (!jid || isJidBroadcast(jid)) continue
				if (!(jid in messages)) messages[jid] = []
				const id = message.key.id
				const msg = loadMessage(jid, id)
				upsertMessage(jid, proto.WebMessageInfo.fromObject(message), 'prepend')
			}
		})

		ev.on('contacts.update', function store(contactsUpdate) {
			for (const contact of contactsUpdate) {
				// @ts-ignore
				const id = contact.id?.decodeJid?.()
				if (!id) continue
				chats[id] = Object.assign(chats[id] || {}, { id, ...contact, isContact: true })
			}
		})

		ev.on('chats.upsert', async function store(chatsUpsert) {
			await Promise.all(chatsUpsert.map(async (chat) => {
				// @ts-ignore
				const id = chat.id?.decodeJid?.()
				if (!id || isJidBroadcast(id)) return
				// @ts-ignore
				if (!(id in chats)) chats[id] = { id, ...chat, isChats: true }
				const isGroup = isJidGroup(id)
				Object.assign(chats[id], { ...chat, isChats: true })
				if (isGroup && !chats[id].metadata) Object.assign(chats[id], { metadata: await fetchGroupMetadata(id, opts.groupMetadata) })
			}))
		})

		ev.on('chats.update', function store(chatsUpdate) {
			for (const chat of chatsUpdate) {
				// @ts-ignore
				const id = chat.id?.decodeJid?.()
				if (!id) continue
				// @ts-ignore
				if (!(id in chats)) chats[id] = { id, ...chat, isChats: true }
				if (chat.unreadCount) chat.unreadCount += chats[id].unreadCount || 0
				Object.assign(chats[id], { id, ...chat, isChats: true })
			}
		})

		ev.on('presence.update', function store(presenceUpdate) {
			// @ts-ignore
			const id = presenceUpdate.id?.decodeJid?.()
			if (!id) return
			if (!(id in chats)) chats[id] = { id, isContact: true }
			Object.assign(chats[id], presenceUpdate)
		})

		ev.on('messages.upsert', function store(messagesUpsert) {
			const { messages: newMessages, type } = messagesUpsert
			switch (type) {
				case 'append':
				case 'notify':
					for (const msg of newMessages) {
						// @ts-ignore
						const jid = msg.key.remoteJid?.decodeJid?.()
						if (!jid || isJidBroadcast(jid)) continue

						if (msg.messageStubType == WAMessageStubType.CIPHERTEXT) continue
						if (!(jid in messages)) messages[jid] = []
						const message = loadMessage(jid, msg.key.id)
						// if (message) console.log(`duplicate message ${msg.key.id} ('messages.upsert')`)
						upsertMessage(jid, proto.WebMessageInfo.fromObject(msg))

						if (type === 'notify' && !(jid in chats))
							ev.emit('chats.upsert', [{
								id: jid,
								conversationTimestamp: msg.messageTimestamp,
								unreadCount: 1,
								name: msg.pushName || msg.verifiedBizName,
							}])
					}
					break
			}
		})

		ev.on('messages.update', async function store(messagesUpdate) {
			for (const message of messagesUpdate) {
				// @ts-ignore
				const jid = message.key.remoteJid?.decodeJid?.()
				if (!jid) continue
				const id = message.key.id
				if (!jid || isJidBroadcast(jid)) continue
				if (!(jid in messages)) messages[jid] = []
				const msg = loadMessage(jid, id)
				if (!msg) return // console.log(`missing message ${id} ('messages.update')`)
				if (message.update.messageStubType == WAMessageStubType.REVOKE) {
					// Fix auto delete because if the message is deleted, the message is removed and feature antidelete need that message to be in the database
					// console.log(`revoke message ${id} ('messages.update')`, message)
					continue
				}
				// @ts-ignore
				const msgIndex = messages[jid].findIndex(m => m.key.id === id)
				Object.assign(messages[jid][msgIndex], message.update)
				// console.debug(`updated message ${id} ('messages.update')`, message.update)
			}
		})

		ev.on('groups.update', async function store(groupsUpdate) {
			await Promise.all(groupsUpdate.map(async (group) => {
				// @ts-ignore
				const id = group.id?.decodeJid?.()
				if (!id) return
				const isGroup = isJidGroup(id)
				if (!isGroup) return
				if (!(id in chats)) chats[id] = { id, ...group, isChats: true }
				if (!chats[id].metadata) Object.assign(chats[id], { metadata: await fetchGroupMetadata(id, opts.groupMetadata) })
				// @ts-ignore
				Object.assign(chats[id].metadata, group)
			}))
		})

		ev.on('group-participants.update', async function store(groupParticipantsUpdate) {
			// @ts-ignore
			const id = groupParticipantsUpdate.id?.decodeJid?.()
			if (!id || !isJidGroup(id)) return
			if (!(id in chats)) chats[id] = { id }
			if (!(id in chats) || !chats[id].metadata) Object.assign(chats[id], { metadata: await fetchGroupMetadata(id, opts.groupMetadata) })
			const metadata = chats[id].metadata
			if (!metadata) return console.log(`Try to update group ${id} but metadata not found in 'group-participants.update'`)
			switch (groupParticipantsUpdate.action) {
				case 'add':
					metadata.participants.push(...groupParticipantsUpdate.participants.map(id => ({ id, admin: null })))
					break
				case 'demote':
				case 'promote':
					for (const participant of metadata.participants)
						if (groupParticipantsUpdate.participants.includes(participant.id))
							participant.admin = groupParticipantsUpdate.action === 'promote' ? 'admin' : null

					break
				case 'remove':
					metadata.participants = metadata.participants.filter(p => !groupParticipantsUpdate.participants.includes(p.id))
					break
			}

			Object.assign(chats[id], { metadata })
		})

		ev.on('message-receipt.update', function store(messageReceiptUpdate) {
			for (const { key, receipt } of messageReceiptUpdate) {
				// @ts-ignore
				const jid = key.remoteJid?.decodeJid?.()
				if (!jid) continue
				const id = key.id
				if (!(jid in messages)) messages[jid] = []
				const msg = loadMessage(jid, id)
				if (!msg) return // console.log(`missing message ${id} ('message-receipt.update')`)
				updateMessageWithReceipt(msg, receipt)
			}
		})

		ev.on('messages.reaction', function store(reactions) {
			for (const { key, reaction } of reactions) {
				// @ts-ignore
				const jid = key.remoteJid?.decodeJid?.()
				if (!jid) continue
				const msg = loadMessage(jid, key.id)
				if (!msg) return // console.log(`missing message ${key.id} ('messages.reaction')`)
				updateMessageWithReaction(msg, reaction)
			}
		})

	}

	function toJSON() {
		return { chats, messages }
	}

	function fromJSON(json) {
		Object.assign(chats, json.chats)
		for (const jid in json.messages)
			messages[jid] = json.messages[jid].map(m => m && proto.WebMessageInfo.fromObject(m)).filter(m => m && m.messageStubType != WAMessageStubType.CIPHERTEXT)

	}

	/** @param {string} path  */
	function writeToFile(path) {
		writeFileSync(path, JSON.stringify(toJSON(), (key, value) => key == 'isChats' ? undefined : value, 2))
	}

	/** @param {string} path  */
	function readFromFile(path) {
		if (existsSync(path)) {
			const result = JSON.parse(readFileSync(path, { encoding: 'utf-8' }))
			fromJSON(result)
		}
	}

	return {
		chats,
		messages,
		state,

		loadMessage,
		fetchGroupMetadata,
		fetchMessageReceipts,
		fetchImageUrl,

		getContact,

		bind,
		writeToFile,
		readFromFile
	}
}

function JSONreplacer(key, value) {
	if (value == null) return
	const baileysJSON = BufferJSON.replacer(key, value)
	return baileysJSON
}

const fixFileName = (file) => file?.replace(/\//g, '__')?.replace(/:/g, '-')

export default {
	makeInMemoryStore,
	fixFileName,
	JSONreplacer
}
