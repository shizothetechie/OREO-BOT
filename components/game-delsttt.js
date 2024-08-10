let handler = async (m, { oreo, text }) => {
  let room = Object.values(oreo.game).find(
    room =>
      room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender)
  )
  if (room == undefined) return oreo.reply(m.chat, `✳️ You are not in game of TicTacToe 🎮 `, m)
  delete oreo.game[room.id]
  await oreo.reply(m.chat, `✅ The session of *tictactoe is restarted 🎮*`, m)
}
handler.help = ['delttt']
handler.tags = ['game']
handler.command = ['delttc', 'delttt', 'delxo']

export default handler
