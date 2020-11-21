const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');

module.exports = class ShirtCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'donate',
			aliases: ['d', 'donate', 'donation', 'fund', 'fundraiser'],
            group: 'donate',
            memberName: 'donate',
            description: 'Show the link to the Shadywish fundraiser',
            examples: ['donate']
        });
    }

    async run(msg) {
		Utils.log("\x1b[36m","ACT: !donate link request from "+msg.member.user.tag);
		msg.delete(100);
		try {
			const attachment = new Discord.Attachment('./img/shadywish.png', 'shadywish.png');
			let embedMsg = new Discord.RichEmbed()
				.attachFile(attachment)
				.setThumbnail('attachment://shadywish.png')
				.setAuthor("Shadywish Donations", "https://i.imgur.com/yTsb91C.png")		
			embedMsg.addField("Shadywish Fundraiser", "https://hstb.givecloud.co/fundraisers/shadywish");
			embedMsg.addField("Info", "We're hosting a fundraiser in memory of a friend of ours in WoW, Shady (or Sam), that passed away in early 2019. He was a passionate animal lover and we wanted to honor his memory by giving to a charity that benefited animals in his local area. All funds raised through this and the t-shirt will go directly to the Humane Society of Tampa Bay!");
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