process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import './config.js';
import './shizo_modules.js';
import { createRequire } from "module";
import path, { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk'
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import dotenv from 'dotenv'
import { Low, JSONFile } from 'lowdb';
import pino from 'pino';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import store from './lib/store.js'
import genses from './lib/genses.js'
import {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    delay
   } from '@whiskeysockets/baileys'
const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()
dotenv.config()

async function main() {
  const txt = process.env.SESSION_ID
  if (!txt) {
    console.error('Environment variable not found.')
    return
  }
  try {
    await genses(txt)
    console.log('genses completed.')
  } catch (error) {
    console.error('Error:', error)
  }
}
main()

await delay(1000 * 10)
async function shizocheck() {
  try {
    const packageJson = readFileSync('package.json', 'utf8')
    const packageData = JSON.parse(packageJson)
    const gnome = packageData.author && packageData.author.name
    if (!gnome) {
      console.log('LOl')
      process.exit(1)
    }
    const shizoname = Buffer.from('c2hpem8=', 'base64').toString()
    const shizoKingOnly = Buffer.from(
      `Q2hlYXAgQ29weSBPZiBTaGl6by1PUkVPLUJvdCBGb3VuZCAsIFBsZWFzZSBVc2UgdGhlIE9yaWdpbmFsIHNoaXpvLU9SRU8tQm90IEZyb20gaHR0cHM6Ly9naXRodWIuY29tL3NoaXpvdGhldGVjaGllL29yZW8tYm90CgrinaTvuI/inKjwn5SlCg==`,
      'base64'
    ).toString()
    const endi = Buffer.from(
      `U2VjdXJpdHkgY2hlY2sgcGFzc2VkLCBUaGFua3MgRm9yIHVzaW5nIFNoaXpvLU9SRU8tQk9UIE11bHRpRGV2aWNl`,
      'base64'
    ).toString()
    if (gnome && gnome.trim().toLowerCase() !== shizoname.toLowerCase()) {
      console.log(shizoKingOnly)
      process.exit(1)
    } else {
      console.log(`${endi}`)
      console.log(chalk.bgBlack(chalk.redBright('initializing Shizo-OREO-Bot')))
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
shizocheck()

const MAIN_LOGGER = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` })

const logger = MAIN_LOGGER.child({})
logger.level = 'fatal'

const store = useStore ? makeInMemoryStore({ logger }) : undefined
store?.readFromFile('./session.json')

setInterval(() => {
  store?.writeToFile('./session.json')
}, 10000 * 6)



global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) } 

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
// global.Fn = function functionCallBack(fn, ...args) { return fn.call(global.conn, ...args) }
global.timestamp = {
  start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['PREFIX'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')


global.opts['db'] = process.env.DATABASE_URL || 'mongodb+srv://xeisensei7:DeepakR3442A@xeisensei.1vo3dqm.mongodb.net/?retryWrites=true&w=majority&appName=xeisensei'

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb(\+srv)?:\/\//i.test(opts['db']) ?
      (opts['mongodbv2'] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db'])) :
      new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}userdb.json`)
)


global.DATABASE = global.db 
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this)
      resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
    }
  }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = chain(global.db.data)
}
loadDatabase()

//-- SESSION
global.authFolder = `Authenticators`

const { state, saveCreds } = await useMultiFileAuthState(global.authFolder)
let { version, isLatest } = await fetchLatestBaileysVersion() 
const connectionOptions = {
	    version,
        printQRInTerminal: true,
        auth: state,
        browser: ['OREO-BOT', 'Edge', '107.0.1418.26'], 
	      patchMessageBeforeSending: (message) => {
                const requiresPatch = !!(
                    message.buttonsMessage 
                    || message.templateMessage
                    || message.listMessage
                );
                if (requiresPatch) {
                    message = {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadataVersion: 2,
                                    deviceListMetadata: {},
                                },
                                ...message,
                            },
                        },
                    };
                }

                return message;
            }, 
      logger: pino({ level: 'silent' })
} 
//--
global.conn = makeWASocket(connectionOptions)
conn.isInit = false

if (!opts['test']) {
  setInterval(async () => {
    if (global.db.data) await global.db.write().catch(console.error)
    if (opts['autocleartmp']) try {
      clearTmp()

    } catch (e) { console.error(e) }
  }, 60 * 1000)
}

if (!opts['server']) (await import('./server.js')).default(global.conn, PORT)

/* Clear */
async function clearTmp() {
  const tmp = [tmpdir(), join(__dirname, './tmp')]
  const filename = []
  tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))

  //---
  return filename.map(file => {
    const stats = statSync(file)
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file) // 3 minuto
    return false
  })
}
setInterval(async () => {
	var a = await clearTmp()
	console.log(chalk.cyan(`🚀 Bot Boosted and Temp Directory is Cleared 🔥`))
}, 180000) //3 minutes

async function connectionUpdate(update) {
  const {connection, lastDisconnect, isNewLogin} = update;
  if (isNewLogin) conn.isInit = true;
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    console.log(await global.reloadHandler(true).catch(console.error));
    global.timestamp.connect = new Date;
  }
  if (global.db.data == null) loadDatabase()
    if (code && code == DisconnectReason.restartRequired) {
    conn.logger.info(chalk.yellow('\n🚩Restart Required... Restarting'))
    process.send('reset')
  }
  
  if (connection === 'open') {
    const { jid, name } = conn.user

    let msgf = `Hai🤩${name} Congrats you have successfully deployed SHIZO-OREO-BOT\nJoin my support Group for any Query\nhttps://chat.whatsapp.com/DWqdPuQ0yFkKyf1SzZ0k9Y`

    let gmes = conn.sendMessage(
      jid,
      {
        text: msgf,
        mentions: [jid],
      },
      {
        quoted: null,
      }
    )

    conn.logger.info(chalk.yellow('\n🚩 R E A D Y'))
  }

  if (connection == 'close') {
    conn.logger.error(chalk.yellow(`\nconnection closed....Get a New Session`))
  }
}


process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if (restatConn) {
    const oldChats = global.conn.chats
    try { global.conn.ws.close() } catch { }
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('message.delete', conn.onDelete)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.welcome = 'Hey 👋, @user\nWelcome to @group 👑'
  conn.bye = 'GoodBye 👋 @user'
  conn.spromote = '@user is now Admin 🧧'
  conn.sdemote = '@user is no Longer Admin 🧧🔫'
  conn.sDesc = 'Group description has been Updated\n*🔮 New Description:*\n@desc'
  conn.sSubject = 'Group name just updated\n*👑 New Name:*\n@group'
  conn.sIcon = 'The group icon has been changed 🌸'
  conn.sRevoke = 'The group link has been changed.\n*🖇️ New Link:*\n@revoke'
  conn.handler = handler.handler.bind(global.conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
  conn.onDelete = handler.deleteUpdate.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn, true)

  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('message.delete', conn.onDelete)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true
}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(e)
      delete global.plugins[filename]
    }
  }
}
filesInit().then(_ => console.log(Object.keys(global.plugins))).catch(console.error)

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    let dir = global.__filename(join(pluginFolder, filename), true)
    if (filename in global.plugins) {
       if (existsSync(dir)) conn.logger.info(`🌟 Updated Plugin - '${filename}'`)
      else {
        conn.logger.warn(`🗑️ Plugin Deleted - '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`✨ New plugin - '${filename}'`)
    let err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })
    if (err) conn.logger.error(`❌ syntax error while loading '${filename}'\n${format(err)}`)
    else try {
      const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
    } finally {
     global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

// Quick Test
async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
  console.log(test)
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  }
  // require('./lib/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) conn.logger.warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
  if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}

_quickTest()
  .then(() => conn.logger.info('🤖 SYSTEM SUCESSFULLY PERFORMED AND PASSED THE NORMAL OPERATION TEST 🚀'))
  .catch(console.error)
