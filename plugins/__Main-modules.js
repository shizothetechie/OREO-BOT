let handler = m => m
handler.all = async function (m) {

let ran = ['available']
	return this.sendPresenceUpdate(ran.getRandom(), m.chat)
    
}
export default handler 