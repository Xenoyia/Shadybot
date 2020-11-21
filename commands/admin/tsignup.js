const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');

module.exports = class TsignupCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tsignup',
			aliases: ['tsignup'],
            group: 'admin',
            memberName: 'tsignup',
            description: 'Toggle the signup open/closed',
            examples: ['tsignup']
        });
    }

    async run(msg) {
		msg.delete(100);
		let carrierRole = msg.guild.roles.find(role => role.name === "Carrier");
		let adminRole = msg.guild.roles.find(role => role.name === "Admin");
			
		if(msg.member.roles.has(carrierRole.id) || msg.member.roles.has(adminRole.id)) {
				var response = Utils.toggleSignup();
				let embedMsg = new Discord.RichEmbed()
					.setAuthor("Shadywish Admin", "https://i.imgur.com/yTsb91C.png")
					.setFooter("This message will automatically delete in 10 seconds!")
						
				embedMsg.addField("Signup Toggle", "The signup is now "+response+"!");	
				return msg.embed(embedMsg)
				.then(msg => {
						msg.delete(10000)
				})
		} else {
			return msg.say("You don't have permission to do this!");
		}
    };
}