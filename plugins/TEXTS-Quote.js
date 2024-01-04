import fetch from 'node-fetch'
let handler  = async (m, { conn }) => {
    let shizokeys = 'shizo'        
  let res = await fetch(`https://shizoapi.onrender.con/api/texts/quotes?apikey=${shizokeys}`)
  if (!res.ok) throw await res.text()
            let json = await res.json()

  let shizodevs = `${json.result}`
  conn.sendMessage(m.chat, { text: shizodevs, mentions: [m.sender] }, { quoted: m })
}
handler.help = ['quote']
handler.tags = ['fun']
handler.command = /^(quotes|quote)$/i

export default handler


function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}