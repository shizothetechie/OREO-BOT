let handler = m => m

handler.before = function (m, { isAdmin, isBotAdmin, conn }) {
let bot = db.data.settings[conn.user.jid]
  if (m.isBaileys) return true
if (bot.autostatus){
    if(m.chat == 'status@broadcast'){
    conn.readMessages([m.key])
}
    }
}

export default handler