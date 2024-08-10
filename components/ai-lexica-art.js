import fetch from 'node-fetch'
let handler = async (m, {
    text,
    command,
    usedPrefix,
    oreo
}) => {

var suggest = `Type the command Along with Promp 🥺`
if (!text) throw suggest
try {
    let res = await(await fetch('https://lexica.art/api/v1/search?q=' + text)).json()
    let randm = res.images
    let resul = randm.getRandom()
    await m.reply(wait)
    await oreo.sendFile(m.chat, 
    resul.src, text, maker + "\n*Creative:* " + resul.prompt + '\n\n https://github.com/shizothetechie/oreo-bot', m)
    } catch (e) {
    throw e
    }
}
handler.help = ["lexica"]
handler.tags = ['ai']
handler.command = ["lexica"]

export default handler
