async function handler(m, { usedPrefix }) {
let users = [...new Set([...global.conns.filter(conn => conn.user && conn.state !== 'close').map(conn => conn.user)])]
await m.reply(users.map(v => 'wa.me/' + v.jid.replace(/[^0-9]/g, '') + ` (${v.name})`).join('\n'))}
handler.command = ['sharedbots']
handler.help = ['sharedbots']
handler.tags = ['share-oreo']
export default handler
