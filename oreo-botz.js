process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.on('uncaughtException', console.error)

import './config.js'
import './oreoXmod.js'
import cfonts from 'cfonts'
import Connection from './oreolab/socket.js'
import Helper from './oreolab/helper.js'
import db from './oreolab/database.js'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { spawn } from 'child_process'
import { protoType, serialize } from './oreolab/labMast.js'
import {
	components,
	loadComponentFiles,
	reload,
	componentFolder,
	componentFilter
} from './oreolab/components.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const args = [join(__dirname, 'oreo-botz.js'), ...process.argv.slice(2)]
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000
const { say } = cfonts
const { name, author } = require(join(__dirname, './package.json'))

say('OREO-WABOT\nA BISCUIT WA-BOT', {
	font: 'chrome',
	align: 'center',
	gradient: ['red', 'magenta']
})
say(`'${name}' By @${author.name || author}`, {
	font: 'console',
	align: 'center',
	gradient: ['red', 'magenta']
})

say([process.argv[0], ...args].join(' '), {
	font: 'console',
	align: 'center',
	gradient: ['red', 'magenta']
})

protoType()
serialize()

// Assign all the value in the Helper to global
Object.assign(global, {
	...Helper,
	timestamp: {
		start: Date.now()
	}
})

// global.opts['db'] = process.env['db']

/** @type {import('./lib/connection.js').Socket} */
const oreo = Object.defineProperty(Connection, 'oreo', {
	value: await Connection.oreo,
	enumerable: true,
	configurable: true,
	writable: true
}).oreo

// load components
loadComponentFiles(componentFolder, componentFilter, {
	logger: oreo.logger,
	recursiveRead: true
}).then(_ => console.log(Object.keys(components)))
	.catch(console.error)
	
	
if (!opts['test']) {
	setInterval(async () => {
		await Promise.allSettled([
			db.data ? db.write() : Promise.reject('db.data is null'),
			//clearTmp(),
			//clearSessions()
		])
  Connection.store.writeToFile(Connection.storeFile)
	}, 1000 * 60 * 5)
}
if (opts['server']) (await import('./server.js')).default(oreo, PORT)


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

	if (!s.ffmpeg) (oreo?.logger || console).warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
	if (s.ffmpeg && !s.ffmpegWebp) (oreo?.logger || console).warn('Stickers may not animated without libwebp on ffmpeg (--enable-libwebp while compiling ffmpeg)')
	if (!s.convert && !s.magick && !s.gm) (oreo?.logger || console).warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}

_quickTest()
	.then(() => (oreo?.logger?.info || console.log)('Quick Test Done'))
	.catch(console.error)