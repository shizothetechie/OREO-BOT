let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) return m.reply(`🔍 Example: ${usedPrefix + command} Avengers`)
	try {
		let anu = await (await fetch(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(text)}`)).json()
		if (anu.error) throw Error()
		let txt = `🎬 *${anu.title}*\n\n`
		+ `🔗 _${anu.imdburl}_\n\n`
		+ `⭐ *Rating:*\n`
		for (let x of anu.ratings) {
			txt += `━ ${x.value} _( ${x.source} )_\n`
		}
		txt += `\n📅 *Released:* ${anu.released}\n`
		+ `🔞 *Rated:* ${anu.rated}\n`
		+ `⏳ *Runtime:* ${anu.runtime}\n`
		+ `🎭 *Genres:* ${anu.genres}\n`
		+ `🗣️ *Languages:* ${anu.languages}\n`
		+ `🎬 *Released:* ${anu.released}\n`
		+ `🎥 *Director:* ${anu.director}\n`
		+ `✍️ *Writer:* ${anu.writer}\n`
		+ `🎭 *Actors:* ${anu.actors}\n\n`
		+ `📝 *Plot:*\n_"${anu.plot.trim()}"_`
		await conn.sendMsg(m.chat, { image: { url: anu.poster }, caption: txt }, { quoted: m })
	} catch (e) {
		console.log(e)
		m.reply(`❌ Result not found.`)
	}
}

handler.help = ['imdb <title>']
handler.tags = ['information']
handler.command = /^(film|imdb)$/i

handler.premium = false
handler.limit = false

export default handler
