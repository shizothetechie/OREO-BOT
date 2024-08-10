let handler = async (m, { oreo, usedPrefix }) => {
  let chats = Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned)
  let users = Object.entries(global.db.data.users).filter(user => user[1].banned)

  m.reply(
    `
≡ *USERS BANNED*

▢ Total : *${users.length}* 

${
  users
    ? '\n' +
      users
        .map(([jid], i) =>
          `
${i + 1}. ${oreo.getName(jid) == undefined ? 'UNKNOWN' : oreo.getName(jid)}
▢ ${jid}
`.trim()
        )
        .join('\n')
    : ''
}
`.trim()
  )
}
handler.help = ['listban']
handler.tags = ['owner']
handler.command = ['banlist', 'listban']

export default handler
