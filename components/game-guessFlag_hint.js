let handler = async (m, { oreo }) => {
  oreo.tebakbendera = oreo.tebakbendera ? oreo.tebakbendera : {}
  let id = m.chat
  if (!(id in oreo.tebakbendera)) throw false
  let json = oreo.tebakbendera[id][1]
  oreo.reply(m.chat, '```' + json.name.replace(/[AIUEOaiueo]/gi, '_') + '```', m)
}
handler.command = /^fhint$/i

export default handler
