const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');

module.exports = class StreamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stream',
			aliases: ['stream', 'twitch', 'ttv'],
            group: 'donate',
            memberName: 'stream',
            description: 'Show the link to Gretham\'s stream',
            examples: ['stream']
        });
    }

    async run(msg) {
		Utils.log("\x1b[36m","ACT: !stream link request from "+msg.member.user.tag);
		msg.delete(100);
		try {
			const attachment = new Discord.Attachment('./img/stream.jpg', 'stream.jpg');
			let embedMsg = new Discord.RichEmbed()
				.attachFile(attachment)
				.setThumbnail('attachment://stream.jpg')
				.setAuthor("Shadywish Stream", "https://i.imgur.com/yTsb91C.png")		
			embedMsg.addField("Gretham's Stream on Twitch.tv", "https://www.twitch.tv/grethamplz");
			return msg.embed(embedMsg)
				.then(msg => {
						msg.delete(15000)
					})
				.catch();
		} catch(e) {
			Utils.log("\x1b[31m","ERR: " + e.stack);
		}
    };
}