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

module.exports = class PositionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'position',
			aliases: ['pos', 'p', 'q', 'queue', 'que'],
            group: 'carry',
            memberName: 'position',
            description: 'Show your position in the queue',
            examples: ['position'],
			guildOnly: true,
			args: [
			{
				key: 'name',
				prompt: '',
                type: 'string',
				default: 'NoArgumentProvided',
                validate: text => {
                    if (text.length < 30 && text.length > 0) return true;
                    return 'That name is too long or too short! Please ask an admin for assistance!';
                }
			}],
			argsPromptLimit: 0
        });
    }

    async run(msg, {name}) {
		Utils.log("\x1b[36m","ACT: Position request from "+msg.member.user.tag);
		msg.delete(100);
		if(msg.channel.name !== "shadybot") {
			return msg.reply('This command can only be used in the <#758177882840498236> channel!')
				.then(msg => {
					msg.delete(5000)
				})
			.catch();
		}
		else if(name == "NoArgumentProvided") {
			return msg.reply('You need to provide a name or name-realm for this command. For example: !pos Yourname or !pos Yourname-Area52')
				.then(msg => {
					msg.delete(5000)
				})
			.catch();
		}
		try {
			var data = await Utils.getQueue();
			//fs.readFileSync('queue.txt', 'utf8');
			var splitData = data.split(',');
			var finalPosition = 0;
			var finalName = "";
			var finalRealm = "";
			var finalRun = 1;
			var queueCount = 1;
			var inRun = 1;
			var backupName = "";
			var backupRealm = "";
			for(let i = 1; i < splitData.length+1; i++) {
				if (isDivideBy(i, 12)) {
					inRun++;
				}
				if(ciEquals(name, splitData[i-1]) || splitData[i-1].toLowerCase().indexOf(name.toLowerCase()) !== -1) {
					finalPosition = i;
					let splitSplitData = splitData[i-1].split('-');
					finalName = splitSplitData[0];
					finalRealm = splitSplitData[1];
					if (isDivideBy(i, 12)) {
						inRun --;
					}
					finalRun = inRun;
				}
				queueCount++;
			}
			const attachment = new Discord.Attachment('./img/shadywish.png', 'shadywish.png');
			let embedMsg = new Discord.RichEmbed()
				.attachFile(attachment)
				.setThumbnail('attachment://shadywish.png')
				.setAuthor("Shadywish Queue", "https://i.imgur.com/yTsb91C.png")		
				.setFooter("This message will automatically delete in 15 seconds.")
			if(finalPosition > 0) {
				if(typeof finalRealm == 'undefined') {
					finalRealm = "Unknown"
					embedMsg.addField("Notice", "We may have an issue with your realm, please contact one of the admins right away with the correct name of your character's realm, or you may not be able to get your dragon!");
				}				
				embedMsg.addField("Hello, "+finalName+"-"+finalRealm+"!", "<@"+msg.author.id+"> - You are in position "+finalPosition+", which will be in our "+ordinal_suffix_of(finalRun)+" run!");	
			} else {
				embedMsg.addField("Hello!", "<@"+msg.author.id+"> - Unfortunately, we couldn't find a "+name+" in the queue.. please make sure you've formatted it correctly with all the right spellings and accents! Capitalization does not matter.");
			}
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