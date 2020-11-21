const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');

module.exports = class ClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
			aliases: ['clear'],
            group: 'admin',
            memberName: 'clear',
            description: 'Clear all current shadybot data',
            examples: ['clear']
        });
    }

    async run(msg, {note}) {
		msg.delete(100);
		let carrierRole = msg.guild.roles.find(role => role.name === "Carrier");
		let adminRole = msg.guild.roles.find(role => role.name === "Admin");
			
		if(msg.member.roles.has(carrierRole.id) || msg.member.roles.has(adminRole.id)) {
			msg.say("Are you sure you want to do this? This will delete all queue, raffle and missed connection data from shadybot, making it fresh for the next run. Please respond with either 'yes' or 'no'.")
				.then(msg => {
					msg.delete(30000)
				})
			const verification = await Utils.verify(msg.channel, msg.author);
			if(verification) {
				// said yes
			} else {
				// said no
				return msg.say("Cancelled the command.")
					.then(msg => {
						msg.delete(10000)
					})
			}
		} else {
			return msg.say("You don't have permission to do this!");
		}
    };
}