//import db from '../lib/database.js'

import { createHash } from 'crypto'
let handler = async function (m, { conn, args, usedPrefix}) {
  if (!args[0]) throw `🛸 *Enter serial number*\nCheck your serial number with the command...\n\n*${usedPrefix}nserie*`
  let user = global.db.data.users[m.sender]
  let sn = createHash('md5').update(m.sender).digest('hex')
  if (args[0] !== sn) throw '⚠️ *Incorrect serial number*'
  user.registered = false
  m.reply(`✅ Register eliminated`)
}
handler.help = ['unreg <Num Serie>'] 
handler.tags = ['rg']

handler.command = ['unreg'] 
handler.register = true

export default handler

