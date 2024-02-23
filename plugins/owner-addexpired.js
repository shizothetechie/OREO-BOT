let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || isNaN(args[0])) throw `Enter a number that represents the number of days!\n\n📌 Example :\n*${usedPrefix + command}* 30`

    let who
    if (m.isGroup) who = args[1] ? args[1] : m.chat
    else who = args[1]

    var nDays = 86400000 * args[0]
    var now = new Date() * 1
    if (now < global.db.data.chats[who].expired) global.db.data.chats[who].expired += nDays
    else global.db.data.chats[who].expired = now + nDays
    let teks = `🤡 The expiration days were active for \n*${await conn.getName(who)}* \n\n*During:* ${args[0]} Días\n\n*Countdown :* ${msToDate(global.db.data.chats[who].expired - now)}`
    conn.reply(m.chat, teks, m)
}
handler.help = ['expired <days>']
handler.tags = ['owner']
handler.command = /^(expired|addexpired)$/i
handler.rowner = true
export default handler

function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' *Days*\n ', h, ' *hours*\n ', m, ' *minutes*\n ', s, ' *seconds* '].map(v => v.toString().padStart(2, 0)).join('')
}
