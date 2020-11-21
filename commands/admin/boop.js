const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');

module.exports = class BoopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'boop',
			aliases: ['boop'],
            group: 'admin',
            memberName: 'boop',
            description: 'A secret command',
            examples: ['boop'],
			args: [
			{
				key: 'message',
				prompt: '',
                type: 'string',
				default: 'NoArgumentProvided'
			}],
			argsPromptLimit: 0
        });
    }

    async run(msg,{message}) {
		msg.delete(100);
		let carrierRole = msg.guild.roles.find(role => role.name === "Carrier");
		let adminRole = msg.guild.roles.find(role => role.name === "Admin");
		if(msg.member.roles.has(carrierRole.id) || msg.member.roles.has(adminRole.id)) {
			this.client.channels.get('746371944659681400').send(message);
		} else {
			return msg.say("You don't have permission to do this!");
		}
    };
}