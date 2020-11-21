const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');

module.exports = class ShirtCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shirt',
			aliases: ['shirt', 'tshirt'],
            group: 'donate',
            memberName: 'shirt',
            description: 'Show the link to buy the Shadywish t-shirt',
            examples: ['shirt']
        });
    }

    async run(msg) {
		Utils.log("\x1b[36m","ACT: !shirt link request from "+msg.member.user.tag);
		msg.delete(100);
		try {
			const attachment = new Discord.Attachment('./img/shirt.jpg', 'shirt.jpg');
			let embedMsg = new Discord.RichEmbed()
				.attachFile(attachment)
				.setThumbnail('attachment://shirt.jpg')
				.setAuthor("Shadywish Donations", "https://i.imgur.com/yTsb91C.png")		
			embedMsg.addField("Shadywish T-Shirt", "https://www.customink.com/fundraising/shadywish-part-2");
			embedMsg.addField("Info", "All funds raised from this shirt will go directly to the Humane Society of Tampa Bay, Inc, in memory of Shady!");
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