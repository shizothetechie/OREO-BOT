let handler = async (m, { conn, text, command }) => {
let id = text ? text : m.chat  
await conn.reply(id, '*OREO LEAVES THE GROUP IT WAS A PLEASURE HE WAS HERE SEE YOU SOON UNTIL*\n*TAKE CARE AND GOOD BYE 👋*') 
await conn.groupLeave(id)}
handler.command = /^(salir|leavegc|fuckoff|leave)$/i
handler.group = true
handler.owner = true

export default handler
