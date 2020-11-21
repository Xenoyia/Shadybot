const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');

module.exports = class RuntimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'runtime',
			aliases: ['runtime'],
            group: 'carry',
            memberName: 'runtime',
            description: 'Show the estimated time for X run',
            examples: ['runtime'],
			args: [
			{
				key: 'run',
				prompt: '',
                type: 'integer',
				default: 'NoArgumentProvided',
				validate: run => {
					if(run > 0) return true;
					return 'The run needs to be above 0!';
				}
			}],
			argsPromptLimit: 0
        });
    }

    async run(msg, {run}) {
		msg.delete(100);
		Utils.log("\x1b[36m","ACT: Runtime request from "+msg.member.user.tag);
		if(msg.channel.name !== "shadybot") {
			return msg.reply('This command can only be used in the <#758177882840498236> channel!')
				.then(msg => {
					msg.delete(5000)
				})
			.catch();
		}
		else if(run == "NoArgumentProvided") {
			return msg.reply('You need to provide the number of your run. For example: !runtime 1')
				.then(msg => {
					msg.delete(5000)
				})
			.catch();
		}
		
		let time = "";
		
		if(run > 0 && run < 11) {
			switch(run) {
				case 1:
					time = "8:00pm - 8:10pm EST";
					break;
				case 2:
					time = "8:15pm - 8:25pm EST";
					break;
				case 3:
					time = "8:30pm - 8:40pm EST";
					break;
				case 4:
					time = "8:45pm - 8:55pm EST";
					break;
				case 5:
					time = "9:00pm - 9:10pm EST";
					break;
				case 6:
					time = "9:15pm - 9:25pm EST";
					break;
				case 7:
					time = "9:45pm - 9:55pm EST";
					break;
				case 8:
					time = "10:00pm - 10:10pm EST";
					break;
				case 9:
					time = "10:15pm - 10:25pm EST";
					break;
				case 10:
					time = "10:30pm - 10:40pm EST";
					break;
				case 11:
					time = "10:45pm - 10:55pm EST";
					break;
			}
		}
		try {
			const attachment = new Discord.Attachment('./img/shadywish.png', 'shadywish.png');
			let embedMsg = new Discord.RichEmbed()
				.attachFile(attachment)
				.setThumbnail('attachment://shadywish.png')
				.setAuthor("Shadywish Runtime", "https://i.imgur.com/yTsb91C.png")		
			embedMsg.addField("Run "+run, "Run "+run+" should be starting at an estimated "+time+". Bear in mind we may be faster or slower depending on how the night goes, so please tune in at least 15 minutes before the start time to avoid missing the run.");
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