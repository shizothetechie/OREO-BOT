import fetch from 'node-fetch'
let handler = async (m, { oreo, command, args }) => {
  if (!args[0]) return oreo.reply(m.chat, '*[🔎] give url*', m)
  let ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer()
  oreo.sendFile(m.chat, ss, 'error.png', args[0], m)
}
handler.help = ['ss', 'ssf'].map(v => v + ' <url>')
handler.tags = ['tools']
handler.command = /^ss(web)?f?$/i
export default handler
