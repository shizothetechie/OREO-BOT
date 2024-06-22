let handler = async (m, { conn, isAdmin }) => {
  if (m.fromMe) throw 'IDK'
  if (isAdmin) throw `*YOU ARE ALREADY ADMIN SIR🤧🐢*`
  await conn.groupParticipantsUpdate(m.chat, [m.sender], "promote")
}
handler.command = /^admin|xei|autoadmin$/i
handler.rowner = true
handler.botAdmin = true
export default handler
