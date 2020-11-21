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

module.exports = class RunCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'run',
			aliases: ['run', 'r', 'group', 'g'],
            group: 'carrier',
            memberName: 'run',
            description: 'Show everyone to be invited in a group',
            examples: ['run'],
			args: [
			{
				key: 'run',
				prompt: 'Which run? Choose a number from 1 - 10.',
                type: 'integer',
				validate: run => {
					if(run > 0) return true;
					return 'The run needs to be above 0!';
				}
			}]
        });
    }

    async run(msg, {run}) {
		msg.delete(100);
		try {
			let carrierRole = msg.guild.roles.find(role => role.name === "Carrier");
			let adminRole = msg.guild.roles.find(role => role.name === "Admin");
			
			if(msg.member.roles.has(carrierRole.id) || msg.member.roles.has(adminRole.id)) {
				var data = await Utils.getQueue();
				var splitData = data.split(',');
				var finalPosition = 0;
				var finalName = "";
				var finalRealm = "";
				var finalRun = 1;
				var queueCount = 1;
				var inRun = 1;
				var backupName = "";
				var backupRealm = "";
				var finalString = "";
				for(let i = 1; i < splitData.length+1; i++) {
					if(inRun == run) {
						let newData = splitData[i-1];
						if(newData.length < 1) {
							finalString = finalString + "(RAFFLE SPOT) \n";
						} else {
							finalString = finalString + "/invite " + splitData[i-1] + " \n";
						}
					}
					if (isDivideBy(i, 12)) {
						inRun++;
					}
				}
				const attachment = new Discord.Attachment('./img/shadywish.png', 'shadywish.png');
				let embedMsg = new Discord.RichEmbed()
					.attachFile(attachment)
					.setThumbnail('attachment://shadywish.png')
					.setAuthor("Shadywish Queue", "https://i.imgur.com/yTsb91C.png")
						
				embedMsg.addField("Shadywish Run " + run, finalString);	
				return msg.embed(embedMsg);
			} else {
				return msg.say("You don't have permission to do this!");
			}
		} catch(e) {
			Utils.log("\x1b[31m","ERR: " + e.stack);
		}
    };
}