import fetch from 'node-fetch'

let handler = async (m, { oreo, text }) => {
  if (!text) throw 'What do you want to create?'
  m.react(rwait)
  let msg = encodeURIComponent(text)
  let res = await fetch(`https://aemt.me/bingimg?text=${msg}`)
  let data = await res.json()
  console.log(data)
  let buffer = data.result
  oreo.sendFile(m.chat, buffer, 'image.png', `${text}`, m)
  m.react(done)
}

handler.help = ['bingimg <query>']
handler.tags = ['AI']
handler.command = /^bingimg$/i

export default handler
