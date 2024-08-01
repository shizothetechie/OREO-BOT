import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, args, command }) => {
    let query = `Input text\nEx. ${command} Doraemon\n${usedPrefix}${command} <text>`;
    let text;

    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw new Error(query);
    }

    if (command === "tenor") {
        try {
            let response = await fetch(`https://g.tenor.com/v1/search?q=${text}&key=LIVDSRZULELA`);
            let json = await response.json();
            let results = json.results;

            let message = "*[ TENOR SEARCH RESULTS ]*\n";
            results.forEach((result, index) => {
                message += `\n🗃️ *${index + 1}.${result.title}*\n- desc: ${result.content_description}\n- url: ${result.url}\n- item: ${result.itemurl}\n`;
            });

            m.reply(message);
        } catch (e) {
            console.error(e);
            m.reply("An error occurred while fetching Tenor results.");
        }
    }
};

handler.tags = ["search"];
handler.command = handler.help = ["tenor"];

export default handler;
