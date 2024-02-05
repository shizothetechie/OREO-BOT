import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone' 
import fs from 'fs' 

//OwnerShip
global.owner = [
  ['919172389527', 'Shizo Techie ❤️✨', true],
  ['919172389527', 'Developer Shizo 🤖', true]
]
global.mods = []
global.prems = []

global.author = 'Shizo The Techie'
global.botname = 'ShizoBot'
 
 
 //Api's
global.APIs = {
  shizoapi: 'https://shizoapi.onrender.com'
}
global.APIKeys = { 
  'https://shizoapi.onrender.com': 'shizo'
}

//Apikeys
global.shizokeys = 'shizo'

//Sticker Watermarks
global.stkpack = 'ShizoBot 🥵'
global.stkowner = '© Shizo The Techie'

//management
global.bug = '*!! Sorry 💢 !!*\nSomething went wrong 🌋'
global.stop = '*!! 🎭 Unfortunately 💔 !!*\nBot system is not Responding 🙃'

//TimeLines
global.botdate = `*⫹⫺ Date:*  ${moment.tz('Asia/Kolkata').format('DD/MM/YY')}`
global.bottime = `*⫹⫺ Time:* ${moment.tz('Asia/Kolkata').format('HH:mm:ss')}`



let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
