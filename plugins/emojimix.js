import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
import fs from "fs"
let handler = async (m, { conn, text, args, usedPrefix, command}) => {
let [emoji1, emoji2] = text.split`&`
	if (emoji1 && emoji2) {
let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
for (let res of anu.results) {
let stiker = await sticker(false, res.url, global.stkpack, global.stkowner)
conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
}
} else throw `Example: ${usedPrefix+command} ${decodeURI('%F0%9F%92%80')}&${decodeURI('%F0%9F%92%80')}`

}
handler.help = ['emojimix'].map(v => v + ' emoji1|emoji2>')
handler.tags = ['maker']
handler.command = /^(emojimix)$/i
export default handler

const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
fetch(url, options)
.then(response => response.json())
.then(json => {
resolve(json)
})
.catch((err) => {
reject(err)
})})
