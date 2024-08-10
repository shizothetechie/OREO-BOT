let handler = async (m, { oreo, text }) => {
  let who
  if (m.isGroup) {
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
  } else {
    who = m.chat
  }
  let name = await oreo.getName(m.quoted.sender)
  if (!who) throw 'Tag the person you want to make an Owner!'
  if (global.owner.includes(who.split('@')[0])) throw 'This person is already an owner!'
  global.owner.push([who.split('@')[0], name, true])
  const caption = `Now @${who.split('@')[0]} has been made an Owner!`
  await oreo.reply(m.chat, caption, m, {
    mentions: oreo.parseMention(caption),
  })
}
handler.help = ['addowner @user']
handler.tags = ['owner']
handler.command = /^(add|give|-)(owner|sudo)$/i
handler.owner = true

export default handler
