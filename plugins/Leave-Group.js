let handler = async (m, { conn, args, command }) => {
	let group = m.chat
        await m.reply('Bot is Leaving group\nMiss You all 🥰', m.chat) 
        await  conn.groupLeave(group)
        }
handler.help = ['leavegc']
handler.tags = ['owner', 'ogroup']
handler.command = /^(leavegc)$/i
handler.rowner = true
handler.group = true
export default handler