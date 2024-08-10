import uploadImage from '../oreolab/uploadImage.js'
import fetch from 'node-fetch'

let handler = async (m, { oreo, usedPrefix, command, args, text }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!mime) throw '⚠️️ Reply to an image or video.'
  if (!text) throw '⚠️️ Enter the new file size for the image/video.'
  if (isNaN(text)) throw '🔢 Only numbers are allowed.'

  if (!/image\/(jpe?g|png)|video|document/.test(mime)) throw '⚠️️ Unsupported format.'

  let img = await q.download()
  let url = await uploadImage(img)

  if (/image\/(jpe?g|png)/.test(mime)) {
    oreo.sendMessage(
      m.chat,
      { image: { url: url }, caption: `Here you go`, fileLength: `${text}`, mentions: [m.sender] },
      { ephemeralExpiration: 24 * 3600, quoted: m }
    )
  } else if (/video/.test(mime)) {
    return oreo.sendMessage(
      m.chat,
      { video: { url: url }, caption: `Here you go`, fileLength: `${text}`, mentions: [m.sender] },
      { ephemeralExpiration: 24 * 3600, quoted: m }
    )
  }
}

handler.tags = ['tools']
handler.help = ['length <amount>']
handler.command = /^(length|filelength|edittamaño|totamaño|tamaño)$/i

export default handler
