//import db from '../lib/database.js'

let handler = async (m, { oreo, isOwner, isAdmin, isROwner }) => {
  if (!(isAdmin || isOwner)) return dfail('admin', m, oreo)
  global.db.data.chats[m.chat].isBanned = true
  m.reply('✅ The bot was deactivated in this group')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = ['banchat', 'chatoff']

export default handler
