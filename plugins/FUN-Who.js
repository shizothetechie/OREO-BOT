let toM = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata }) {
    let ps = groupMetadata.participants.map(v => v.id)
    let a = ps.getRandom()
    let b
    do b = ps.getRandom()
    while (b === a)
   
   
    let ownerx = /(owner|malik|Developer)/i 
    const shizox = ownerx.exec(m.text)
    if (shizox) { 
      m.reply('shizo the techie')
    } else {
   conn.reply(m.chat, `*Question: ❓* ${m.text}
*Answer: 👉* ${toM(a)}`.trim(), m, { mentions: [a] });
}
}
handler.help = ["who <questions>?"];
handler.tags = ["fun"];
handler.customPrefix = /(\!$)/;
handler.command = /^who$/i;
handler.group = true 
export default handler;