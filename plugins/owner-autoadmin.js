let handler = async (m, { conn, isAdmin }) => {
  if (m.fromMe) throw 'So youre a bot as an admin'
  if (isAdmin) throw 'Already'
await m.reply(`Awwww 🥰`)
  await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
}
handler.command = /^autoadmin$/i
handler.rowner = true 

export default handler