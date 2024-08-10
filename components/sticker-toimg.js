import { webp2png } from '../oreolab/webp2mp4.js'

let handler = async (m, { oreo, usedPrefix, command }) => {
  const notStickerMessage = `✳️ Reply to a sticker with :\n\n *${usedPrefix + command}*`
  if (!m.quoted) throw notStickerMessage
  const q = m.quoted || m
  let mime = q.mediaType || ''
  if (!/sticker/.test(mime)) throw notStickerMessage
  let media = await q.download()
  let out = (await webp2png(media).catch(_ => null)) || Buffer.alloc(0)
  await oreo.sendFile(m.chat, out, 'out.png', '*✅ Here you have*', m)
}
handler.help = ['toimg <sticker>']
handler.tags = ['sticker']
handler.command = ['toimg', 'jpg', 'aimg']

export default handler
