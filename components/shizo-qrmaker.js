import { toDataURL } from 'qrcode'
let handler = async (m, { text, oreo }) => {
  if (!text) throw `*Give a text to convert*`
  oreo.sendFile(
    m.chat,
    await toDataURL(text.slice(0, 2048), { scale: 8 }),
    'qrcode.png',
    'Here u go',
    m
  )
}
handler.help = ['', 'code'].map(v => 'qr' + v + ' <text>')
handler.tags = ['tools']
handler.command = /^qr(code)?$/i
export default handler
