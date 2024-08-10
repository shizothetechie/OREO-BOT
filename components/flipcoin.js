let handler = async(m, { oreo, args }) => {
let shizo = Math.floor(Math.random() * 2) + 1
if (shizo === 1) { oreo.reply(m.chat, `Tail 🪙`, m)
} else { oreo.reply(m.chat, `Head 🪙`, m)
}
        }
handler.help = ['flipcoin']
handler.tags = ['fun']
handler.command = /^(flip|flipcoin)$/i

export default handler
