
const xpperrupees = 350 
let handler = async (m, { conn, command, args }) => {
  let count = command.replace(/^buy/i, '')
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xpperrupees) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (global.db.data.users[m.sender].exp >= xpperrupees * count) {
    global.db.data.users[m.sender].exp -= xpperrupees * count
    global.db.data.users[m.sender].rupees += count
    conn.reply(m.chat, `
┌─「 *PAYMENT NOTE* 」
‣ *Nominal purchase* : + ${count} 
‣ *Spent* : -${xpperrupees * count} XP
└──────────────`, m)
  } else conn.reply(m.chat, `❎ Sorry, you don't have enough *XP* to buy *${count}* Rupees\n\n You can get *XP* using the commands from the *games and economy menu*`, m)
}
handler.help = ['buy', 'buyall']
handler.tags = ['economy']
handler.command = ['buy', 'buyall'] 

handler.disabled = false

export default handler
