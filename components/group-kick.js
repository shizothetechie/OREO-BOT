let handler = async (m, { oreo, participants, usedPrefix, command }) => {
  let kickte = `✳️ Correct use of the command\n*${usedPrefix + command}* @tag`

  if (!m.mentionedJid[0] && !m.quoted)
    return m.reply(kickte, m.chat, { mentions: oreo.parseMention(kickte) })
  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  let owr = m.chat.split`-`[0]
  await oreo.groupParticipantsUpdate(m.chat, [user], 'remove')
  m.reply(`✅ User kicked`)
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'expulsar']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
