//import db from '../lib/database.js'

let handler = async (m, { oreo, isOwner, isAdmin, isROwner }) => {
  if (!(isAdmin || isOwner)) return dfail('admin', m, oreo)
  global.db.data.chats[m.chat].isBanned = false
  m.reply('✅ Bot active in this group')
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = ['chaton', 'unbanchat']

export default handler
