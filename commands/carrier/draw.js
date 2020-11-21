const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');

function ciEquals(a, b) {
   return typeof a === 'string' && typeof b === 'string'
       ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
       : a === b;
}

function isDivideBy(number, a, b) {
  return (number % a === 0);
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

module.exports = class DrawCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'draw',
			aliases: ['draw'],
            group: 'carrier',
            memberName: 'draw',
            description: 'Draw x number of people from the raffle list',
            examples: ['draw'],
			args: [
			{
				key: 'num',
				prompt: 'How many people to draw from the raffle?',
                type: 'integer',
				validate: num => {
					if(num > 0) return true;
					return 'You need to draw more than 0, dummy.';
				}
			}]
        });
    }

    async run(msg, {num}) {
		msg.delete(100);
		try {
			let carrierRole = msg.guild.roles.find(role => role.name === "Carrier");
			let adminRole = msg.guild.roles.find(role => role.name === "Admin");
			
			if(msg.member.roles.has(carrierRole.id) || msg.member.roles.has(adminRole.id)) {
				const attachment = new Discord.Attachment('./img/shadywish.png', 'shadywish.png');
				let processingMsg = new Discord.RichEmbed()
					.attachFile(attachment)
					.setThumbnail('attachment://shadywish.png')
					.setAuthor("Shadywish Raffle", "https://i.imgur.com/yTsb91C.png")
				processingMsg.addField("Processing...", "This may take a second, getting raffle results!");
				const message = await msg.channel.send(processingMsg);
				var data = await Utils.drawRaffle(num);
				var finalString = "";
				let members = msg.channel.members;
				for(let i = 0; i < data.length; i++) {
					let mem = members.find('id', data[i][1]);
					mem.send("Hello! Your raffle number came up, and it's your turn to get the dragon! Please make sure you're online and available on **"+data[i][0]+"**, or you may miss the spot!");
					finalString = finalString + "<@"+data[i][1]+">\n/invite "+data[i][0]+"\n";
				}
				let embedMsg = new Discord.RichEmbed()
					.attachFile(attachment)
					.setThumbnail('attachment://shadywish.png')
					.setAuthor("Shadywish Raffle", "https://i.imgur.com/yTsb91C.png")
						
				embedMsg.addField("Shadywish Raffle Draw", finalString);	
				return message.edit(embedMsg);
			} else {
				return msg.say("You don't have permission to do this!");
			}
		} catch(e) {
			Utils.log("\x1b[31m","ERR: " + e.stack);
		}
    };
}