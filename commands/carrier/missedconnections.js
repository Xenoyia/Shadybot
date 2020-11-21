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

module.exports = class MissedConnectionsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'missedconnections',
			aliases: ['mc', 'mlist', 'missedlist', 'mclist'],
            group: 'carrier',
            memberName: 'missedconnections',
            description: 'Show everyone logged as a missed connection',
            examples: ['missedconnections']
        });
    }

    async run(msg, {run}) {
		try {
			var data = await Utils.getMissed();
			var splitData = data.split(',');
			var finalPosition = 0;
			var finalName = "";
			var finalRealm = "";
			var finalRun = 1;
			var queueCount = 1;
			var backupName = "";
			var backupRealm = "";
			var finalString = "";
			for(let i = 1; i < splitData.length+1; i++) {
				let newData = splitData[i-1];
				if(newData.length < 1) {
					finalString = finalString + "(RAFFLE SPOT) \n";
				} else {
					finalString = finalString + "/invite " + splitData[i-1] + " \n";
				}
			}
			const attachment = new Discord.Attachment('./img/shadywish.png', 'shadywish.png');
			let embedMsg = new Discord.RichEmbed()
				.attachFile(attachment)
				.setThumbnail('attachment://shadywish.png')
				.setAuthor("Shadywish Queue", "https://i.imgur.com/yTsb91C.png")
					
			embedMsg.addField("Missed Connections", finalString);	
			return msg.embed(embedMsg);
		} catch(e) {
			Utils.log("\x1b[31m","ERR: " + e.stack);
		}
    };
}