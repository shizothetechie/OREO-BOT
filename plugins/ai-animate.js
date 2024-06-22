import axios from 'axios'

let shizo = async (m, { conn, text, command, usedPrefix }) => {
if (!text) return m.reply(`*• Example:* ${usedPrefix + command} A boy staring a girl at Street`)

try {
let shizoai = await (await fetch(`https://itzpire.com/ai/animate-diff?prompt=${text}`)).json()
const response = await axios.get(shizoai.data.image_urls, { responseType: 'arraybuffer' })
const buffer = Buffer.from(response.data, "utf-8")
var fetchedgif = await GIFBufferToVideoBuffer(buffer)
await conn.sendMessage(m.chat, {video: fetchedgif, gifPlayback: true, caption: '*✨ Result for:* ' + text}, {quoted: m})
 } catch(e) {
 console.log(e)
 m.reply(error)
}

}
shizo.help = ['animate']
shizo.tags = ['ai']
shizo.command = /^(animate)$/i;
export default shizo
