let handler = async (m, { conn, command, usedPrefix, text, groupMetadata }) => {
    if (!text) throw `Example:\n${usedPrefix + command} Who is most handsome ?`;

    let em = ['😀','😂','😃','🗿','🤤','😁','😐','🙂','☹️'];

    // Function to format the mention
    let toM = a => '@' + a.split('@')[0];

    // Filter participants to exclude the bot itself
    let participants = groupMetadata.participants;
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid);

    // Get random participant
    let a = users[Math.floor(Math.random() * users.length)];

    // Get random emoji
    let am = em[Math.floor(Math.random() * em.length)];

    // Prepare message with the mention
    let message = ` *${text}*  ${toM(a)} ${am}`;

    // Send message with mention
    await conn.sendMessage(m.chat, { text: message, mentions: [a] }, { quoted: m });

    // Optional: send a button message with the same content
    await conn.sendButton(m.chat, 'Dont take it seriously. its just a fun game, meant for enjoyment only 😊🎉', author, null, [['Search again', `${usedPrefix}who ${text}`]], m, { mentions: [a] });
}

handler.help = ['who'].map(v => v + ' <text>');
handler.command = ['who'];
handler.tags = ['fun'];
handler.group = true;
 
export default handler;
