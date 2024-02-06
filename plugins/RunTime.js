//made with ❤️ by Shizo 
import { cpus as _cpus, totalmem, freemem } from 'os'
import util from 'util'
import os from 'os'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'
let handler = async (m, { conn, isRowner}) => {
	let _muptime
    let muptime = clockString(_muptime)
  await conn.sendMessage(m.chat, {
          react: {
            text: clock,
            key: m.key,
          }})
let text = `Bot is Running from 
${muptime}`
await conn.sendMessage(m.chat, { text: text, mentions: [m.sender] }, { quoted: m })
}
handler.help = ['runtime', 'uptime']
handler.tags = ['main']
handler.command = /^(uptime|runtime)$/i
export default handler
function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* '].map(v => v.toString().padStart(2, 0)).join('')
}