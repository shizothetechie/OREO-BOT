let handler = async (m, { oreo, text }) => {
  if (!text) throw 'No Text'
  oreo.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/misc/youtube-comment', {
      avatar: await oreo
        .profilePictureUrl(m.sender, 'image')
        .catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
      comment: text,
      username: oreo.getName(m.sender),
    }),
    'error.png',
    '*THANKS FOR COMMENT*',
    m
  )
}
handler.help = ['ytcomment <comment>']
handler.tags = ['maker']
handler.command = /^(ytcomment)$/i
export default handler
