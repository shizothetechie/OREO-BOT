let handler  = async (m, { conn }) => {
if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, 'Why dont you go directly with the Bot number?', m)
else {
await conn.reply(m.chat, 'Goodbye Bot', m)
conn.ws.close()}}
handler.help = ['stop']
handler.tags = ['oreo-share']
handler.command = /^(stop)$/i
handler.owner = true  
handler.fail = null
export default handler
