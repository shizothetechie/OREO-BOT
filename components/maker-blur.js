let handler = async (m, { oreo, usedprefix }) => {
  let who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? oreo.user.jid
        : m.sender
  oreo.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/misc/blur', {
      avatar: await oreo
        .profilePictureUrl(who, 'image')
        .catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
    }),
    'hornycard.png',
    '*[ ✔ ]*',
    m
  )
}
handler.help = ['blur', 'difuminar2']
handler.tags = ['maker']
handler.command = /^(blur|difuminar2)$/i
export default handler
