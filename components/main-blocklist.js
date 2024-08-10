let handler = async (m, { oreo }) => {
  await oreo
    .fetchBlocklist()
    .then(async data => {
      let txt = `*≡ List *\n\n*Total :* ${data.length}\n\n┌─⊷\n`
      for (let i of data) {
        txt += `▢ @${i.split('@')[0]}\n`
      }
      txt += '└───────────'
      return oreo.reply(m.chat, txt, m, { mentions: await oreo.parseMention(txt) })
    })
    .catch(err => {
      console.log(err)
      throw 'no numbers blocked'
    })
}

handler.help = ['blocklist']
handler.tags = ['main']
handler.command = ['blocklist', 'listblock']

export default handler
