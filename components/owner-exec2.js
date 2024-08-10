import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'
let exec = promisify(_exec).bind(cp)
let handler = async (m, { oreo, isOwner, command, text }) => {
  if (oreo.user.jid != oreo.user.jid) return
  m.reply('✅ running...')
  let o
  try {
    o = await exec(command.trimStart() + ' ' + text.trimEnd())
  } catch (e) {
    o = e
  } finally {
    let { stdout, stderr } = o
    if (stdout.trim()) m.reply(stdout)
    if (stderr.trim()) m.reply(stderr)
  }
}
handler.help = ['$']
handler.tags = ['advanced']
handler.customPrefix = /^[$] /
handler.command = new RegExp()
handler.rowner = true
export default handler
