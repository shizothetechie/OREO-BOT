import MessageType from '@shizodevs/shizoweb'
import { generateWAMessageFromContent } from '@shizodevs/shizoweb'

let handler = async (m, { oreo, text, participants }) => {
  let users = participants.map(u => oreo.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  let c = m.quoted ? m.quoted : m.msg
  const msg = oreo.cMod(
    m.chat,
    generateWAMessageFromContent(
      m.chat,
      {
        [c.toJSON ? q.mtype : 'extendedTextMessage']: c.toJSON
          ? c.toJSON()
          : {
              text: c || '',
            },
      },
      {
        quoted: m,
        userJid: oreo.user.id,
      }
    ),
    text || q.text,
    oreo.user.jid,
    { mentions: users }
  )
  await oreo.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}
handler.help = ['hidetag']
handler.tags = ['group']
handler.command = ['hidetag', 'notify']
handler.group = true
handler.admin = true

export default handler
