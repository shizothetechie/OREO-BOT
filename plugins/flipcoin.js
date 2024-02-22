let handler = async(m, { conn, args }) => {
let shizo = Math.floor(Math.random() * 2) + 1
if (shizo === 1) { conn.reply(m.chat, `Tail 🪙`, m)
} else { conn.reply(m.chat, `Head 🪙`, m)
}
        }
handler.help = ['flipcoin']
handler.tags = ['fun']
handler.command = /^(flip|flipcoin)$/i

export default handler
