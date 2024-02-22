let handler = async(m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
let msg = args.join` `
let oi = `*Message:* ${msg}`
let teks = `╭━〔 *TagAll* 〕━⬣\n\n${oi}\n\n`
for (let mem of participants) {
teks += `┃⊹ @${mem.id.split('@')[0]}\n`}
teks += `┃\n`
teks += `┃ OREO BOT 🍪🥵\n`
teks += `╰━━━━━━━━━━⬣`
conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, )  
}
handler.help = ['tagall'].map(v => v + ' [text]')
handler.tags = ['group', 'admins']
handler.command = /^(tagall)$/i
handler.admin = true
handler.group = true
export default handler
