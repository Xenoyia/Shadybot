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

module.exports = class RaffleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'raffle',
            group: 'carry',
            memberName: 'raffle',
            description: 'Enter the raffle for a chance to win a spot',
            examples: ['raffle'],
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
		msg.delete(100);
		if(msg.channel.name !== "shadybot") {
			return msg.reply('This command can only be used in the <#758177882840498236> channel!')
				.then(msg => {
					msg.delete(5000)
				})
			.catch();
		}
		else if(await Utils.isRaffleClosed() == true) {
			return msg.reply('The raffle is currently closed! Please watch the stream to know when it is open!')
				.then(msg => {
					msg.delete(5000)
				})
			.catch();
		}
		else if(name == "NoArgumentProvided") {
			return msg.reply('You need to provide a name and realm for this command. For example: !raffle Yourname-Area52')
				.then(msg => {
					msg.delete(5000)
				})
			.catch();
		}
		else if(name.indexOf('-') == -1) {
			return msg.reply('You need to provide a realm for this command. For example: !raffle Yourname-Area52 <- please format it like this!')
				.then(msg => {
					msg.delete(5000)
				})
			.catch();
		}
		else if(await Utils.isInRaffle(name)) {
			return msg.reply('You are already in the raffle. We will let you know if you win! :)')
				.then(msg => {
					msg.delete(5000)
				})
			.catch();
		}
		try {
			let raffleNum = await Utils.addToRaffle(name,msg.author.id);
			let cleanName = name.replace(/\s+/g, '');
			const attachment = new Discord.Attachment('./img/shadywish.png', 'shadywish.png');
			let embedMsg = new Discord.RichEmbed()
				.attachFile(attachment)
				.setThumbnail('attachment://shadywish.png')
				.setAuthor("Shadywish Raffle", "https://i.imgur.com/yTsb91C.png")		
				.setFooter("This message will automatically delete in 15 seconds.")
			embedMsg.addField("Hello, "+cleanName+"!", "<@"+msg.author.id+"> - You are now in the raffle. You will be mentioned if it is your turn! Please be on and ready for invites.");	
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