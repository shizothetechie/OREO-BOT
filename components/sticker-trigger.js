import { sticker } from '../oreolab/sticker.js'

let handler = async (m, { oreo }) => {
  let who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? oreo.user.jid
        : m.sender
  let marah = global.API('https://some-random-api.ml', '/canvas/triggered', {
    avatar: await oreo.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png'),
  })
  let stiker = await sticker(false, marah, global.packname, global.author)
  if (stiker) return await oreo.sendFile(m.chat, stiker, null, { asSticker: true }, m)

  throw stiker.toString()
}

handler.help = ['trigger <@user>']
handler.tags = ['sticker']
handler.command = ['trigger', 'triggered', 'ger']

export default handler
