let handler = async (m, { oreo }) => {
  let who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? oreo.user.jid
        : m.sender
  oreo.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/misc/simpcard', {
      avatar: await oreo
        .profilePictureUrl(who, 'image')
        .catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
    }),
    'error.png',
    '*your religion is simping*',
    m
  )
}
handler.help = ['simpcard']
handler.tags = ['maker']
handler.command = /^(simpcard)$/i
export default handler
