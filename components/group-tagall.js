let handler = async (m, { oreo, text, participants, isAdmin, isOwner, groupMetadata }) => {
  let users = participants.map(u => u.id).filter(v => v !== oreo.user.jid)
  m.reply(
    `▢ Group : *${groupMetadata.subject}*\n▢ Members : *${participants.length}*${text ? `\n▢ Message : ${text}\n` : ''}\n┌───⊷ *MENTIONS*\n` +
      users.map(v => '▢ @' + v.replace(/@.+/, '')).join`\n` +
      '\n└──✪ GURU ┃ ᴮᴼᵀ ✪──',
    null,
    {
      mentions: users,
    }
  )
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = ['tagall']
handler.admin = true
handler.group = true

export default handler
