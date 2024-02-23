let handler = async (m, { conn, text, command }) => {
let id = text ? text : m.chat  
await conn.reply(id, '*BOT LEAVES THE GROUP IT WAS A PLEASURE*\n*HE IS HERE SEE YOU SOON UNTIL TAKE CARE 😼👋*') 
await conn.groupLeave(id)}
handler.command = /^(leavegc|fuckoff|leave)$/i
handler.group = true
handler.rowner = true
export default handler