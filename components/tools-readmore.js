let handler = async (m, { oreo, text }) => {
  let [l, r] = text.split`|`
  if (!l) l = ''
  if (!r) r = ''
  oreo.reply(m.chat, l + readMore + r, m)
}
handler.help = ['readmore <text1>|<text2>']
handler.tags = ['tools']
handler.command = ['readmore']

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
