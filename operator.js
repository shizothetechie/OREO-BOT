import * as os from 'os'
import chalk from 'chalk'
import db, { loadDatabase } from './oreolab/database.js'
import Connection from './oreolab/socket.js'
import fs, { unwatchFile, watchFile } from 'fs'
import Helper from './oreolab/helper.js'
import path, { join } from 'path'
import printMessage from './oreolab/print.js'
import Queque from './oreolab/queque.js'
import { fileURLToPath } from 'url'
import { format } from 'util'
import _ from "lodash";
import { components } from './oreolab/components.js'
import { smsg } from './oreolab/labMast.js'

/** @type {import('@shizodevs/shizoweb')} */
const { getContentType } = (await import('@shizodevs/shizoweb')).default

const isNumber = x => typeof x === 'number' && !isNaN(x)
const isLinux = (os.platform() === 'win32') ? false : true
/**
 * Handle messages upsert
 * @this {import('./lib/connection').Socket}
 * @param {import('@shizodevs/shizoweb').BaileysEventMap<unknown>['messages.upsert']} chatUpdate
 */
export async function handler(chatUpdate) {
	this.msgqueque = this.msgqueque || new Queque()
	if (!chatUpdate)
		return
	let m = chatUpdate.messages[chatUpdate.messages.length - 1]
	if (!m)
		return
	if (db.data == null)
		await loadDatabase()
	try {
		m = smsg(this, m) || m
		if (!m)
			return
		m.exp = 0
		m.limit = false
		try {
      // TODO: use loop to insert data instead of this
      let user = db.data.users[m.sender]
      if (typeof user !== 'object') db.data.users[m.sender] = {}
      if (user) {
        if (!isNumber(user.exp)) user.exp = 0
        if (!isNumber(user.credit)) user.credit = 10
        if (!isNumber(user.bank)) user.bank = 0
        if (!isNumber(user.chicken)) user.chicken = 0
        if (!isNumber(user.lastclaim)) user.lastclaim = 0
        if (!('registered' in user)) user.registered = false
        //-- user registered
        if (!user.registered) {
          if (!('name' in user)) user.name = m.name
          if (!isNumber(user.age)) user.age = -1
          if (!isNumber(user.regTime)) user.regTime = -1
        }
        //--user number
        if (!isNumber(user.afk)) user.afk = -1
        if (!('afkReason' in user)) user.afkReason = ''
        if (!('banned' in user)) user.banned = false
        if (!isNumber(user.warn)) user.warn = 0
        if (!isNumber(user.level)) user.level = 0
        if (!('role' in user)) user.role = 'Tadpole'
        if (!('autolevelup' in user)) user.autolevelup = false
           /*
   Do Not Modify this Section ❌  👇👇
   Else Relationship Features Will Not Work 😔
   Your Devs Friend Shizo The Techie
   */
   if (!('lover' in user)) user.lover = ''
   if (!('exlover' in user)) user.exlover = ''
   if (!('crush' in user)) user.crush = ''
   if (!isNumber(user.excount)) user.excount = 0
      } else {
        db.data.users[m.sender] = {
        lover: '',
        exlover: '',
        crush: '',
        excount: 0,
   /*
   Do Not Modify this Section ❌  ☝️☝️
   Else Relationship Features Will Not Work 😔
   Your Devs Friend Shizo The Techie
   */
          exp: 0,
          credit: 0,
          bank: 0,
          chicken: 0,
          lastclaim: 0,
          registered: false,
          name: m.name,
          age: -1,
          regTime: -1,
          afk: -1,
          afkReason: '',
          banned: false,
          warn: 0,
          level: 0,
          role: 'Tadpole',
          autolevelup: false,
        }
      }
      let chat = db.data.chats[m.chat]
      if (typeof chat !== 'object') db.data.chats[m.chat] = {}
      if (chat) {
        if (!('antiDelete' in chat)) chat.antiDelete = true
        if (!('antiLink' in chat)) chat.antiLink = false
        if (!('antiSticker' in chat)) chat.antiSticker = false
        if (!('antiToxic' in chat)) chat.antiToxic = false
        if (!('detect' in chat)) chat.detect = false
        if (!('getmsg' in chat)) chat.getmsg = true
        if (!('isBanned' in chat)) chat.isBanned = false
        if (!('nsfw' in chat)) chat.nsfw = false
        if (!('sBye' in chat)) chat.sBye = ''
        if (!('sDemote' in chat)) chat.sDemote = ''
        if (!('simi' in chat)) chat.simi = false
        if (!('sPromote' in chat)) chat.sPromote = ''
        if (!('sWelcome' in chat)) chat.sWelcome = ''
        if (!('useDocument' in chat)) chat.useDocument = false
        if (!('viewOnce' in chat)) chat.viewOnce = false
        if (!('viewStory' in chat)) chat.viewStory = false
        if (!('welcome' in chat)) chat.welcome = false
        if (!('chatbot' in chat)) chat.chatbot = false
        if (!isNumber(chat.expired)) chat.expired = 0
      } else
        db.data.chats[m.chat] = {
          antiDelete: true,
          antiLink: false,
          antiSticker: false,
          antiToxic: false,
          detect: false,
          expired: 0,
          getmsg: true,
          isBanned: false,
          nsfw: false,
          sBye: '',
          sDemote: '',
          simi: false,
          sPromote: '',
          sticker: false,
          sWelcome: '',
          useDocument: false,
          viewOnce: false,
          viewStory: false,
          welcome: false,
          chatbot: false,
        }

      let settings = db.data.settings[this.user.jid]
      if (typeof settings !== 'object') db.data.settings[this.user.jid] = {}
      if (settings) {
        if (!('self' in settings)) settings.self = false
        if (!('autoread' in settings)) settings.autoread = false
        if (!('restrict' in settings)) settings.restrict = false
        if (!('restartDB' in settings)) settings.restartDB = 0
        if (!('status' in settings)) settings.status = 0
      } else
        db.data.settings[this.user.jid] = {
          self: false,
          autoread: false,
          restrict: false,
          restartDB: 0,
          status: 0,
        }
		} catch (e) {
			console.error(e)
		}

    let isROwner = [this.decodeJid?.(this.user.id), ..._.map(owner, ([number]) => number)].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
    let isOwner = isROwner || m.fromMe;
    let isMods = isOwner || _.map(mods, v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
		const isPrems =
      isROwner ||
      global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

		if (opts['listen'])
			return
		if (!isROwner && opts['self'])
			return
		if (opts['pconly'] && m.chat.endsWith('g.us'))
			return
		if (opts['gconly'] && !m.chat.endsWith('g.us') && !isPrems)
			return
		if (opts['swonly'] && m.chat !== 'status@broadcast')
			return
		if (typeof m.text !== 'string')
			m.text = ''

		if (opts['queque'] && m.text && !m.fromMe && !(isMods || isPrems)) {
			const id = m.id
			this.msgqueque.add(id)
			await this.msgqueque.waitQueue(id)
		}

		if (m.isBaileys) return
		m.exp += Math.ceil(Math.random() * 10)

		let usedPrefix
		let _user = db.data?.users?.[m.sender]

		const groupMetadata = (m.isGroup ? await Connection.store.fetchGroupMetadata(m.chat, this.groupMetadata) : {}) || {}
		const participants = (m.isGroup ? groupMetadata.participants : []) || []
		const user = (m.isGroup ? participants.find(u => this.decodeJid(u.id) === m.sender) : {}) || {} // User Data
		const bot = (m.isGroup ? participants.find(u => this.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
		const isRAdmin = user?.admin == 'superadmin' || false
		const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
		const isBotAdmin = bot?.admin || false // Are you Admin?

		const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './components')
		for (let name in components) {
			let component = components[name]
			if (!component)
				continue
			if (component.disabled)
				continue
			const __filename = join(___dirname, name)
			if (typeof component.all === 'function') {
				try {
					await component.all.call(this, m, {
						chatUpdate,
						__dirname: ___dirname,
						__filename
					})
				} catch (e) {
					// if (typeof e === 'string') continue
					console.error(e)
					if (db.data.datas.rowner.length > 0) {
						for (let [jid] of db.data.datas.rowner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
							let data = (await this.onWhatsApp(jid))[0] || {}
							if (data.exists)
								m.reply(`*Components:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid)
						}
					}
				}
			}
			if (!opts['restrict'])
				if (component.tags && component.tags.includes('admin')) {
					// global.dfail('restrict', m, this)
					continue
				}
			const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
			let _prefix = component.customPrefix ? component.customPrefix : this.prefix ? this.prefix : global.prefix
			let match = (_prefix instanceof RegExp ? // RegExp Mode?
				[[_prefix.exec(m.text), _prefix]] :
				Array.isArray(_prefix) ? // Array?
					_prefix.map(p => {
						let re = p instanceof RegExp ? // RegExp in Array?
							p :
							new RegExp(str2Regex(p))
						return [re.exec(m.text), re]
					}) :
					typeof _prefix === 'string' ? // String?
						[[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
						[[[], new RegExp]]
			).find(p => p[1])
			if (typeof component.before === 'function') {
				if (await component.before.call(this, m, {
					match,
					oreo: this,
					participants,
					groupMetadata,
					user,
					bot,
					isROwner,
					isOwner,
					isRAdmin,
					isAdmin,
					isBotAdmin,
					isPrems,
					chatUpdate,
					__dirname: ___dirname,
					__filename
				}))
					continue
			}
			if (typeof component !== 'function')
				continue
			if ((usedPrefix = (match[0] || '')[0])) {
				let noPrefix = m.text.replace(usedPrefix, '')
				let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
				args = args || []
				let _args = noPrefix.trim().split` `.slice(1)
				let text = _args.join` `
				command = (command || '').toLowerCase()
				let fail = component.fail || global.dfail // When failed
				let isAccept = component.command instanceof RegExp ? // RegExp Mode?
					component.command.test(command) :
					Array.isArray(component.command) ? // Array?
						component.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
							cmd.test(command) :
							cmd === command
						) :
						typeof component.command === 'string' ? // String?
							component.command === command :
							false

				if (!isAccept)
					continue
				m.component = name.replace(isLinux ? 'components/' : 'components\\','')
				if (m.chat in db.data.chats || m.sender in db.data.users) {
					let chat = db.data.chats[m.chat]
					let user = db.data.users[m.sender]
					let ubc = isLinux ? 'unbanchat.js' : 'unbanchat.js'
					let ubu = isLinux ? 'unbanuser.js' : 'unbanuser.js'
					if (m.component != ubc && chat?.isBanned)
						return // Except this
					if (m.component != ubu && user?.banned)
						return
				}
				if (component.rowner && component.owner && !(isROwner || isOwner)) { // Both Owner
					fail('owner', m, this)
					continue
				}
				if (component.rowner && !isROwner) { // Real Owner
					fail('rowner', m, this)
					continue
				}
				if (component.owner && !isOwner) { // Number Owner
					fail('owner', m, this)
					continue
				}
				if (component.mods && !isMods) { // Moderator
					fail('mods', m, this)
					continue
				}
				if (component.premium && !isPrems && !m.isGroup) { // Premium
					fail('premium', m, this)
					continue
				}
				if (component.nsfw && m.isGroup && !db.data.chats[m.chat].nsfw) {
					fail('nsfw', m, this)
					continue
				}
				if (component.game && m.isGroup && !db.data.chats[m.chat].game) {
					fail('game', m, this)
					continue
				}
				if (component.group && !m.isGroup) { // Group Only
					fail('group', m, this)
					continue
				} else if (component.botAdmin && !isBotAdmin) { // You Admin
					fail('botAdmin', m, this)
					continue
				} else if (component.admin && !isAdmin) { // User Admin
					fail('admin', m, this)
					continue
				}
				if (component.private && m.isGroup) { // Private Chat Only
					fail('private', m, this)
					continue
				}
				if (component.register == true && _user.registered == false) { // Butuh daftar?
					fail('unreg', m, this)
					continue
				}
				m.isCommand = true
				_user.spamcount += 1
				let xp = 'exp' in component ? parseInt(component.exp) : 17 // XP Earning per command
				if (xp > 200)
					m.reply('Ngecit -_-') // Hehehe
				else
					m.exp += xp
				if (!isPrems && component.limit && db.data.users[m.sender].limit < component.limit * 1) {
					this.reply(m.chat, `Your limit has run out, please buy via *${usedPrefix}buy*`, m)
					continue // Limit habis
				}
				if (component.level > _user.level) {
					this.reply(m.chat, `${component.level} level is required to use this command. Your level ${_user.level}`, m)
					continue // If the level has not been reached
				}
				let extra = {
					match,
					usedPrefix,
					noPrefix,
					_args,
					args,
					command,
					text,
					oreo: this,
					participants,
					groupMetadata,
					user,
					bot,
					isROwner,
					isOwner,
					isRAdmin,
					isAdmin,
					isBotAdmin,
					isPrems,
					chatUpdate,
					__dirname: ___dirname,
					__filename
				}
				try {
					await component.call(this, m, extra)
					if (!isPrems)
						m.limit = m.limit || component.limit || false
				} catch (e) {
					// Error occured
					m.error = e
					console.error(e)
					if (e) {
						let text = format(e)
						for (let key of Object.values(global.APIKeys))
							text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
						if (e.name)
							if (db.data.datas.rowner.length > 0) {
								for (let [jid] of db.data.datas.rowner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
									let data = (await this.onWhatsApp(jid))[0] || {}
									if (data.exists)
										m.reply(`*component:* ${m.component}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${usedPrefix}${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
								}
							}
						m.reply(text)
					}
				} finally {
					// m.reply(util.format(_user))
					if (typeof component.after === 'function') {
						try {
							await component.after.call(this, m, extra)
						} catch (e) {
							console.error(e)
						}
					}
				}
				break
			}
		}
	} catch (e) {
		console.error(e)
	} finally {
		if (m.isGroup) {
			//auto typing / record
			if (db.data.chats[m.chat].presence) await this.sendPresenceUpdate(['composing', 'recording'].getRandom(), m.chat) 
		}
		if (opts['queque'] && m.text) {
			const id = m.id
			this.msgqueque.unqueue(id)
		}
		//console.log(db.data.users[m.sender])
		let user, stats = db.data.stats
		if (m) {
			if (m.sender && (user = db.data.users[m.sender])) {
				user.exp += m.exp
				user.limit -= m.limit * 1
			}

			let stat
			if (m.component) {
				let now = +new Date
				if (m.component in stats) {
					stat = stats[m.component]
					if (!isNumber(stat.total))
						stat.total = 1
					if (!isNumber(stat.success))
						stat.success = m.error != null ? 0 : 1
					if (!isNumber(stat.last))
						stat.last = now
					if (!isNumber(stat.lastSuccess))
						stat.lastSuccess = m.error != null ? 0 : now
				} else
					stat = stats[m.component] = {
						total: 1,
						success: m.error != null ? 0 : 1,
						last: now,
						lastSuccess: m.error != null ? 0 : now
					}
				stat.total += 1
				stat.last = now
				if (m.error == null) {
					stat.success += 1
					stat.lastSuccess = now
				}
			}
		}

		try {
			if (!opts['noprint']) await printMessage(m, this)
		} catch (e) {
			console.log(m, m.quoted, e)
		}
		if (opts['autoread'])
			await this.readMessages([m.key]).catch(() => { }) // WARNING : easy to get banned

	}
}

/**
 * Handle groups participants update
 * @this {import('./lib/connection').Socket}
 * @param {import('@shizodevs/shizoweb').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({ id, participants, action }) {
	if (opts['self']) return
	if (this.isInit) return
	if (db.data == null) await loadDatabase()
}

/**
 * Handle groups update
 * @this {import('./lib/connection').Socket}
 * @param {import('@shizodevs/shizoweb').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
	if (opts['self'])
		return
	for (const groupUpdate of groupsUpdate) {
		const id = groupUpdate.id
		if (!id) continue
		let chats = db.data.chats[id], text = ''
		if (!chats?.detect) continue
		if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || Connection.oreo.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
		if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || Connection.oreo.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
		if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || Connection.oreo.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
		if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || Connection.oreo.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
		if (!text) continue
		await this.sendMessage(id, { text, mentions: this.parseMention(text) })
	}
}

/**
 * @this {import('./lib/connection').Socket}
 * @param {import('@shizodevs/shizoweb').BaileysEventMap<unknown>['messages.delete']} message 
 */
export async function deleteUpdate(message) {

	if (Array.isArray(message.keys) && message.keys.length > 0) {
		const tasks = await Promise.allSettled(message.keys.map(async (key) => {
			if (key.fromMe) return
			const msg = this.loadMessage(key.remoteJid, key.id) || this.loadMessage(key.id)
			if (!msg || !msg.message) return
			let chat = db.data.chats[key.remoteJid]
			if (!chat || chat.delete) return

			// if message type is conversation, convert it to extended text message because if not, it will throw an error
			const mtype = getContentType(msg.message)
			if (mtype === 'conversation') {
				msg.message.extendedTextMessage = { text: msg.message[mtype] }
				delete msg.message[mtype]
			}

			const participant = msg.participant || msg.key.participant || msg.key.remoteJid
			await this.reply(key.remoteJid, `@${participant.split`@`[0]} has removed the\n*.off antidelete* message to disable`, msg, { mentions: [participant] })
			return await this.copyNForward(key.remoteJid, msg).catch(e => console.log(e, msg))
		}))
		tasks.map(t => t.status === 'rejected' && console.error(t.reason))
	}
}


global.dfail = (type, m, oreo) => {
	let msg = {
		rowner: `*「OWNER BOT ONLY」*`,
		owner: `*「OWNER BOT ONLY」*`,
		mods: `*「DEV / MODS ONLY」*`,
		premium: `*「PREMIUM USER ONLY」*`,
		group: `*「GROUP ONLY」*`,
		private: `*「PRIVATE CHAT ONLY」*`,
		admin: `*「ADMIN GROUP ONLY」*`,
		nsfw: `[ *NSFW NOT ACTIVE* ]`,
		game: '```「 ACTIVATE GAME MODE! 」```',
		botAdmin: `*「BOT MUST BE ADMIN」*`,
		unreg: 'Please register to use this feature by typing:\n\n*#register name.age*\n\nExample: *#register shizo.16*',
		restrict: 'This feature is *disabled*!'
	}[type]
	if (msg) return m.reply(msg)
}

let file = Helper.__filename(import.meta.url, true)
watchFile(file, async () => {
	unwatchFile(file)
	console.log(chalk.redBright("Update 'operator.js'"))
	if (Connection.reload) console.log(await Connection.reload(await Connection.oreo))
})