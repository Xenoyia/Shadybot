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

module.exports = class RunsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'runs',
            group: 'carrier',
            memberName: 'runs',
            description: 'Show everyone to be invited in the next Shadywish run',
            examples: ['runs']
        });
    }

    async run(msg) {
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
				var array = [];
				var finalString = "";
				for(let i = 1; i < splitData.length+1; i++) {
					let newData = splitData[i-1];
					if(newData.length < 1) {
						finalString = finalString + "(RAFFLE SPOT) \n";
					} else {
						finalString = finalString + "/invite " + splitData[i-1] + " \n";
					}
					if (isDivideBy(i, 12)) {
						array.push(finalString);
						finalString = "";
						inRun++;
					}
				}
				if(finalString.length > 0) {
					array.push(finalString);
					finalString = "";
				}
				let embedMsg = new Discord.RichEmbed()
					.setAuthor("Shadywish Full Queue", "https://i.imgur.com/yTsb91C.png")
				
				for(let i = 0; i < array.length; i++) {
					embedMsg.addField("Run " + (i + 1), array[i], true);	
				}
				return msg.embed(embedMsg);
			} else {
				return msg.say("You don't have permission to do this!");
			}
		} catch(e) {
			Utils.log("\x1b[31m","ERR: " + e.stack);
		}
    };
}