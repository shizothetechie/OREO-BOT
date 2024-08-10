let handler = async (m, { text, oreo, usedPrefix, command }) => {
  let why = `*ERROR, EXAMPLE:*\n*—◉ ${usedPrefix + command} @${m.sender.split('@')[0]}*`
  let who = m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.quoted
      ? m.quoted.sender
      : text
        ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        : false
  if (!who) oreo.reply(m.chat, why, m, { mentions: [m.sender] })
  let res = []
  switch (command) {
    case 'block':
    case 'unblock':
      if (who)
        await oreo.updateBlockStatus(who, 'block').then(() => {
          res.push(who)
        })
      else oreo.reply(m.chat, why, m, { mentions: [m.sender] })
      break
    case 'unblock':
    case 'unblock':
      if (who)
        await oreo.updateBlockStatus(who, 'unblock').then(() => {
          res.push(who)
        })
      else oreo.reply(m.chat, why, m, { mentions: [m.sender] })
      break
  }
  if (res[0])
    oreo.reply(
      m.chat,
      `*SUCCESS! USER ${command} ACTION PERFORMED ON ${res ? `${res.map(v => '@' + v.split('@')[0])}` : ''}*`,
      m,
      { mentions: res }
    )
}

handler.command = /^(block|unblock)$/i
handler.rowner = true
export default handler
