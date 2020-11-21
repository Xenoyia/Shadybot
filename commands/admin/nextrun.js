const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');

module.exports = class NextRunCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nextrun',
			aliases: ['nextrun'],
            group: 'admin',
            memberName: 'nextrun',
            description: 'Change the next run info',
            examples: ['nextrun'],
			args: [
			{
				key: 'note',
				prompt: 'What should the next run info say? This message will be sent to people during the signup process. Keep it simple, like a date and time.',
                type: 'string',
				default: 'None',
                validate: text => {
                    if (text.length < 120 && text.length > 0) return true;
                    return 'That text is too long or too short! Please ask an admin for assistance!';
                }
			}]
        });
    }

    async run(msg, {note}) {
		msg.delete(100);
		let carrierRole = msg.guild.roles.find(role => role.name === "Carrier");
		let adminRole = msg.guild.roles.find(role => role.name === "Admin");
			
		if(msg.member.roles.has(carrierRole.id) || msg.member.roles.has(adminRole.id)) {
				Utils.setNextRun(note);
				let embedMsg = new Discord.RichEmbed()
					.setAuthor("Shadywish Admin", "https://i.imgur.com/yTsb91C.png")
					.setFooter("This message will automatically delete in 10 seconds!")
						
				embedMsg.addField("Next Run", "The next run info is now: *'"+note+"'*.");	
				return msg.embed(embedMsg)
				.then(msg => {
						msg.delete(10000)
				})
		} else {
			return msg.say("You don't have permission to do this!");
		}
    };
}