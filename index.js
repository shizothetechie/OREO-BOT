console.clear();
import fs from 'fs'
import express from 'express'
import {
  join,
  dirname
} from 'path'
import {
  createRequire
} from "module";
import {
  fileURLToPath
} from 'url'
import {
  setupMaster,
  fork
} from 'cluster'
import {
  watchFile,
  unwatchFile
} from 'fs'
import cfonts from 'cfonts';
import chalk from "chalk"
import {
  createInterface
} from 'readline'
import yargs from 'yargs'
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const {
  name,
  author
} = require(join(__dirname, './package.json'))
const {
  say
} = cfonts
const PORT = 8080 || 5000 || 300
var app = express()
app.enable('trust proxy');
app.set("json spaces",2)
app.use(cors())
app.use(secure)
app.use(express.static("public"))
const rl = createInterface(process.stdin, process.stdout)
console.log('OREO-BOT is starting 🚀')
say('OREO-WA-BOT\nBy Shizo', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']})
say(`Github@shizothetechie\nInstagram@shizo_the_techie`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']})

app.get('/', (req, res) => {
    res.sendFile(__path + '/media/oreo-shizo.html')
})

app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})

var isRunning = false
/**
* Start a js file
* @param {String} file `path/to/file`
*/
function start(file) {
  if (isRunning) return
  isRunning = true
  let args = [join(__dirname, file),
    ...process.argv.slice(2)]

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  })
  let p = fork()
  p.on('message', data => {
    switch (data) {
      case 'reset':
        p.process.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }})
  p.on('exit', (_, code) => {
    isRunning = false
    console.error('⚠️ Unexpected error ⚠️', code)

    p.process.kill()
    isRunning = false
    start.apply(this, arguments)

    if (process.env.pm_id) {
      process.exit(1)
    } else {
      process.exit()
    }
  })
  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
  if (!opts['test'])
    if (!rl.listenerCount()) rl.on('line', line => {
    p.emit('message', line.trim())})}
start('main.js')