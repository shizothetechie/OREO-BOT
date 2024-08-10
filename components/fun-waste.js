let handler = async (m, { oreo }) => {
  let who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? oreo.user.jid
        : m.sender
  let name = oreo.getName(who)
  let pp = await oreo.profilePictureUrl(who, 'image').catch(_ => './Guru.jpg')
  oreo.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/overlay/wasted', {
      avatar: pp,
    }),
    'waste.png',
    `*Ah! Shit :* ${name}\n\nWastedeeznuts`,
    m
  )
}

handler.help = ['waste @user']
handler.tags = ['fun']
handler.command = ['waste']

export default handler
