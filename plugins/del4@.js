let handler = function (m, { conn, isOwner, isBotAdmin }) {
	    let { chat } = m.chat
 let key = {}
 try {
 	key.remoteJid = m.quoted ? m.quoted.fakeObj.key.remoteJid : m.key.remoteJid
	key.fromMe = m.quoted ? m.quoted.fakeObj.key.fromMe : m.key.fromMe
	key.id = m.quoted ? m.quoted.fakeObj.key.id : m.key.id
 	key.participant = m.quoted ? m.quoted.fakeObj.participant : m.key.participant
 } catch (e) {
 	console.error(e)
 }
conn.sendMessage(m.chat, { delete: key })

}

handler.help = ["del4 <tag msg>"]
handler.tags = ["owner", "ogroup"]
handler.command = /^(4del|del4)$/i
handler.rowner = true

export default handler