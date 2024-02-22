import { cleartmp } from '../../FussionScreen/owner.js'
import { tmpdir } from 'os'
import path, { join } from 'path'
import {
readdirSync,
statSync,
unlinkSync,
existsSync,
readFileSync,
watch
} from 'fs'
let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => { 

await cleartmp(conn, m.chat, m) 

const tmp = [(__dirname, './tmp')]
const filename = []
tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
return filename.map(file => {
const stats = statSync(file)
unlinkSync(file)
})}
handler.help = ['cleartmp']
handler.tags = ['owner']
handler.command = /^(cleartmp|cleartemp|borrartmp|eliminartmp|borrartemp|borrartemp)$/i
handler.exp = 500
handler.rowner = true
export default handler
