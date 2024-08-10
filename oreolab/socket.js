// @ts-check
import * as os from 'os'
import chalk from 'chalk'
import db, { loadDatabase } from './database.js'
import fs from 'fs'
import Helper from './helper.js'
import importFile from './import.js'
import open from 'open'
import P from 'pino'
import path, { resolve } from 'path'
import readline from 'readline'
import storeSystem from './store.js'
import { fileURLToPath } from 'url'
import { HelperConnection } from './labMast.js'

const {
	default: makeWASocket,
	DisconnectReason,
	fetchLatestBaileysVersion,
	PHONENUMBER_MCC,
	useMultiFileAuthState
} = (await import('@shizodevs/shizoweb')).default

const Device = (os.platform() === 'win32') ? 'Windows' : (os.platform() === 'darwin') ? 'MacOS' : 'Linux'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const authFolder = storeSystem.fixFileName(`${Helper.opts._[0] || ''}oreo-Auth`)
const authFile = `${Helper.opts._[0] || 'session'}.data.json`
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const usePairingCode = Helper.opts['pairing']
const useMobile = Helper.opts['mobile']

let [
	isCredsExist,
	isAuthSingleFileExist,
	authState
] = await Promise.all([
	Helper.checkFileExists(authFolder + '/creds.json'),
	Helper.checkFileExists(authFile),
	useMultiFileAuthState(authFolder)
])

const store = storeSystem.makeInMemoryStore()
const storeFile = `${Helper.opts._[0] || 'data'}.store.json`
store.readFromFile(storeFile)

const logger = P({
	timestamp: () => `,"time":"${new Date().toJSON()}"`,
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true
		}
	}
}).child({ class: 'baileys' })

const connectionOptions = {
	printQRInTerminal: !usePairingCode,
	mobile: useMobile,
	ignoreMsgLoading: true,
	syncFullHistory: false,
	auth: authState.state
}

let conns = new Map();
async function start(oldSocket = null, opts = { store, logger, authState }) {
	let { version, isLatest } = await fetchLatestBaileysVersion()
	console.log(chalk.magenta(`-- using WA v${version.join('.')}, isLatest: ${isLatest} --`))
	let oreo = await makeWASocket({
		version,
		...connectionOptions,
		...opts.connectionOptions,
		logger: opts.logger,
		auth: opts.authState.state,
		generateHighQualityLinkPreview: true,
		defaultQueryTimeoutMs: undefined,
		browser: [Device, 'Chrome', '20.0.04']
	})
	HelperConnection(oreo, { store: opts.store, logger })

	if (oldSocket) {
		oreo.isInit = oldSocket.isInit
		oreo.isReloadInit = oldSocket.isReloadInit
	}
	if (oreo.isInit == null) {
		oreo.isInit = false
		oreo.isReloadInit = true
	}

	store.bind(oreo.ev, {
		groupMetadata: oreo.groupMetadata
	})
	if((usePairingCode || useMobile) && isCredsExist && !oreo.authState.creds.registered) {
		console.log(chalk.yellow('-- WARNING: creds.json is broken, please delete it first --'))
		process.exit(0)
	}
	if(usePairingCode && !oreo.authState.creds.registered) {
		if(useMobile) throw new Error('Cannot use pairing code with mobile api')
		const { registration } = { registration: {} }
		let phoneNumber = ''
		do {
			phoneNumber = await question(chalk.blueBright('ENTER A VALID NUMBER START WITH REGION CODE. Example : 91xxx:\n'))
		} while (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v)))
		rl.close()
		phoneNumber = phoneNumber.replace(/\D/g,'')
		console.log(chalk.bgWhite(chalk.blue('-- Please wait, generating code... --')))
		setTimeout(async () => {
			let code = await oreo.requestPairingCode(phoneNumber)
			code = code?.match(/.{1,4}/g)?.join('-') || code
			console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
		}, 3000)
	}

	// not tested yet
	if(useMobile && !oreo.authState.creds.registered) {
		if(usePairingCode) throw new Error('Cannot use mobile api with pairing code')
		const { registration } = { registration: {} }

		if(!registration.phoneNumber) {
			registration.phoneNumber = await question(chalk.blueBright('ENTER A VALID NUMBER START WITH REGION CODE. Example : 91xxx:\n'))
		}

		const libPhonenumber = await import('libphonenumber-js')
		const phoneNumber = libPhonenumber.parsePhoneNumber(registration.phoneNumber || '')
		if(!phoneNumber?.isValid()) {
			throw new Error('Invalid phone number: ' + registration.phoneNumber)
		}

		registration.phoneNumber = phoneNumber.format('E.164')
		registration.phoneNumberCountryCode = phoneNumber.countryCallingCode
		registration.phoneNumberNationalNumber = phoneNumber.nationalNumber
		const mcc = PHONENUMBER_MCC[phoneNumber.countryCallingCode]
		if(!mcc) {
			throw new Error('Could not find MCC for phone number: ' + registration.phoneNumber + '\nPlease specify the MCC manually.')
		}

		registration.phoneNumberMobileCountryCode = mcc

		async function enterCode() {
			try {
				const code = await question(chalk.blueBright('Please enter the one time code:\n'))
				const response = await oreo.register(code.replace(/["']/g, '').trim().toLowerCase())
				console.log('Successfully registered your phone number.')
				console.log(response)
				rl.close()
			} catch(error) {
				console.error('Failed to register your phone number. Please try again.\n', error)
				await askForOTP()
			}
		}

		async function enterCaptcha() {
			const response = await oreo.requestRegistrationCode({ ...registration, method: 'captcha' })
			const captcha = path.join(__dirname, `../tmp/captcha.png`)
			fs.writeFileSync(captcha, Buffer.from(response.image_blob, 'base64'))

			await open(captcha)
			const code = await question(chalk.blueBright('Please enter the captcha code:\n'))
			fs.unlinkSync(captcha)
			registration.captcha = code.replace(/["']/g, '').trim().toLowerCase()
		}

		async function askForOTP() {
			if (!registration.method) {
				let code = await question(chalk.blueBright('How would you like to receive the one time code for registration ?\ntype "sms" or "voice"\n'))
				code = code.replace(/["']/g, '').trim().toLowerCase()
				if(code !== 'sms' && code !== 'voice') {
					return await askForOTP()
				}

				registration.method = code
			}

			try {
				await oreo.requestRegistrationCode(registration)
				await enterCode()
			} catch(error) {
				console.error('Failed to request registration code. Please try again.\n', error)

				if(error?.reason === 'code_checkpoint') {
					await enterCaptcha()
				}

				await askForOTP()
			}
		}

		askForOTP()
	}

	await reload(oreo, false, opts).then((success) => console.log('- bind handler event -', success))

	return oreo
}


let OldHandler = null
async function reload(oreo, restartConnection, opts = { store, logger, authState }) {
	if (!opts.handler) opts.handler = importFile(Helper.__filename(resolve('./operator.js'))).catch(console.error)
	if (opts.handler instanceof Promise) opts.handler = await opts.handler;
	if (!opts.handler && OldHandler) opts.handler = OldHandler
	OldHandler = opts.handler
	// const isInit = !!oreo.isInit
	const isReloadInit = !!oreo.isReloadInit
	if (restartConnection) {
		try { oreo.ws.close() } catch { }
		// @ts-ignore
		oreo.ev.removeAllListeners()
		Object.assign(oreo, await start(oreo, opts) || {})
	}

	// Assign message like welcome, bye, etc.. to the connection
	Object.assign(oreo, getMessageConfig())

	if (!isReloadInit) {
		if (oreo.handler) oreo.ev.off('messages.upsert', oreo.handler)
		if (oreo.participantsUpdate) oreo.ev.off('group-participants.update', oreo.participantsUpdate)
		if (oreo.groupsUpdate) oreo.ev.off('groups.update', oreo.groupsUpdate)
		if (oreo.onDelete) oreo.ev.off('messages.delete', oreo.onDelete)
		if (oreo.connectionUpdate) oreo.ev.off('connection.update', oreo.connectionUpdate)
		if (oreo.credsUpdate) oreo.ev.off('creds.update', oreo.credsUpdate)
	}
	if (opts.handler) {
		oreo.handler = /** @type {typeof import('../handler')} */(opts.handler).handler.bind(oreo)
		oreo.participantsUpdate = /** @type {typeof import('../handler')} */(opts.handler).participantsUpdate.bind(oreo)
		oreo.groupsUpdate = /** @type {typeof import('../handler')} */(opts.handler).groupsUpdate.bind(oreo)
		oreo.onDelete = /** @type {typeof import('../handler')} */(opts.handler).deleteUpdate.bind(oreo)
	}
	if (!opts.isChild) oreo.connectionUpdate = connectionUpdate.bind(oreo, opts)
	oreo.credsUpdate = opts.authState.saveCreds.bind(oreo)

	/** @typedef {Required<EventHandlers>} Event */
	oreo.ev.on('messages.upsert', /** @type {Event} */(oreo).handler)
	oreo.ev.on('group-participants.update', /** @type {Event} */(oreo).participantsUpdate)
	oreo.ev.on('groups.update', /** @type {Event} */(oreo).groupsUpdate)
	oreo.ev.on('messages.delete', /** @type {Event} */(oreo).onDelete)
	if (!opts.isChild) oreo.ev.on('connection.update', /** @type {Event} */(oreo).connectionUpdate)
	oreo.ev.on('creds.update', /** @type {Event} */(oreo).credsUpdate)

	oreo.isReloadInit = false
	return true

}
 
/**
 * @this {Socket}
 * @param {StartOptions} opts
 * @param {import('@shizodevs/shizoweb').BaileysEventMap<unknown>['connection.update']} update
 */
async function connectionUpdate(opts, update) {
	const { connection, lastDisconnect, isNewLogin } = update
	// @ts-ignore
	//const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
	const code = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
	if (connection === 'close') {
		if (code) {
			/*console.log('- Connection Closed, Reconnecting -')
			await reload(this, true, opts).catch(console.error)
			global.timestamp.connect = new Date*/
			try {
				console.log('- Connection Closed, Reconnecting -')
				await reload(this, true, opts)
				global.timestamp.connect = new Date
			} catch (e) {
				console.log('-- ERROR LOG --')
				console.log(e)
			}
		} else {
			console.log(chalk.red('-- Device loggedOut --'))
			process.exit(0)
		}
	} else if (connection == 'open') console.log('- opened connection -')
	if (db.data == null) loadDatabase()
}

function getMessageConfig() {
	const welcome = 'Hello @user!\n\n🎉 *WELCOME* to the group @group!\n\n📜 Please read the *DESCRIPTION* @desc.'
	const bye = '👋GOODBYE @user \n\nSee you later!'
	const spromote = '*@user* has been promoted to an admin!'
	const sdemote = '*@user* is no longer an admin.'
	const sDesc = 'The group description has been updated to:\n@desc'
	const sSubject = 'The group title has been changed to:\n@group'
	const sIcon = '`The group icon has been updated!'
	const sRevoke = 'The group link has been changed to:\n@revoke'

	return {
		welcome,
		bye,
		spromote,
		sdemote,
		sDesc,
		sSubject,
		sIcon,
		sRevoke
	}
}

const oreo = start(null, { store, logger, authState })
	.catch(console.error)


export default {
	start,
	reload,

	oreo,
	conns,
	logger,
	connectionOptions,

	authFolder,
	storeFile,
	authState,
	store,

	getMessageConfig
}
export {
	oreo,
	conns,
	logger
}
