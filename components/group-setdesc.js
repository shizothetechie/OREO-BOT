let handler = async (m, { oreo, args }) => {
  await oreo.groupUpdateDescription(m.chat, `${args.join(' ')}`)
  m.reply('*✅Success changing The description of the group*')
}
handler.help = ['Setdesc <text>']
handler.tags = ['group']
handler.command = /^setdesk|setdesc$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler
