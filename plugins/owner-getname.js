let handler = async(m, { conn, command }) => {
  try {
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  else who = m.quoted.sender ? m.quoted.sender : m.sender
  let name = await conn.getName(who)
  m.reply(name)
  } catch {
    try {
    let who = m.quoted ? m.quoted.sender : m.sender
    let name = await conn.getName(who)
    m.reply(name)
  } catch {
    throw `sorry can't try another one⍨`
    }
  }
}
handler.help = ['getname <@tag/reply>']
handler.tags = ['owner']
handler.command = /^(get)?name?a?$/i
handler.owner = true
export default handler
