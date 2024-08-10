import fetch from 'node-fetch'
let handler = async (m, { oreo }) => {
  let data = await (
    await fetch('https://raw.githubusercontent.com/shizothetechie/shizoFiles/main/compilation/ppcouple.json')
  ).json()
  let cita = data[Math.floor(Math.random() * data.length)]

  let cowi = await (await fetch(cita.shizo)).buffer()
  await oreo.sendFile(m.chat, cowi, '', '♂️', m)
  let ciwi = await (await fetch(cita.shizony)).buffer()
  await oreo.sendFile(m.chat, ciwi, '', '♀️', m)
}
handler.help = ['ppcouple', 'ppcp']
handler.tags = ['img']
handler.command = ['couplepp', 'ppcouple']

export default handler
