let handler = async (m, { oreo, args }) => {
  let text = args.slice(1).join(' ')
  let who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? oreo.user.jid
        : m.sender
  oreo.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/misc/its-so-stupid', {
      avatar: await oreo
        .profilePictureUrl(who, 'image')
        .catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
      dog: text || 'im+stupid',
    }),
    'error.png',
    `*@${author}*`,
    m
  )
}
handler.help = ['itssostupid', 'iss', 'stupid']
handler.tags = ['maker']
handler.command = /^(itssostupid|iss|stupid)$/i
export default handler
