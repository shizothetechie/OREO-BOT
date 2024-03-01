let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (user.ufo > 0) return m.reply('You already have this')
    if (user.rupees < 500) return m.reply(`🟥 *You don't have sufficient amount of gold in your wallet to buy a ufo*`)

    user.rupees -= 1000
    user.ufo += 1
    m.reply(`🎉 You have successfully bought a ufo to fight! Use the command ${usedPrefix}alien-fight <amount>`)
}

handler.help = ['buyufo']
handler.tags = ['economy']
handler.command = ['buy-ufo', 'buyufos'] 

handler.group = true

export default handler