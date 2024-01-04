import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

let msg = `Neko 😂😁`
let endpoint = `https://shizoapi.onrender.com/api/sfw/neko?apikey=${shizokeys}`
const response = await fetch(endpoint);
if (response.ok) {
      const imageBuffer = await response.buffer();
      await conn.sendFile(m.chat, imageBuffer, 'shizo.techie.error.png', msg, m);
    } else {
      throw bug
    }
}

handler.tags = ['sfw']
handler.help = handler.command = ['neko']

export default handler