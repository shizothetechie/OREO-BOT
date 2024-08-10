let handler = async (m, { oreo, usedPrefix }) => {
  let who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? oreo.user.jid
        : m.sender
  let user = global.db.data.users[who]

  let username = oreo.getName(who)
  if (!(who in global.db.data.users)) throw `🟨 The user is not found in my database`
  oreo.reply(
    m.chat,
    `👛 *Wallet | ${username}*

🪙 *Gold* : ${user.credit}
`,
    m,
    { mentions: [who] }
  )
}
handler.help = ['wallet']
handler.tags = ['economy']
handler.command = ['wallet', 'gold']

export default handler
