const { Command } = require('discord.js-commando');
const Utils = require('../../core/utils.js');
const Discord = require('discord.js');

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

module.exports = class MissedCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'missed',
            group: 'carrier',
            memberName: 'missed',
            description: 'Record a missed connection',
            examples: ['missed'],
			args: [
			{
				key: 'name',
				prompt: 'What is the name of the missed connection?',
                type: 'string',
                validate: text => {
                    if (text.length < 30 && text.length > 1) return true;
                    return 'That name is too long or too short! Please ask an admin for assistance!';
                }
			}]
        });
    }
	
	    async run(msg, {name}) {
			let carrierRole = msg.guild.roles.find(role => role.name === "Carrier");
			let adminRole = msg.guild.roles.find(role => role.name === "Admin");
			
			if(msg.member.roles.has(carrierRole.id) || msg.member.roles.has(adminRole.id)) {
				var data = await Utils.getQueue();
				var splitData = data.split(',');
				for(let i = 1; i < splitData.length+1; i++) {
					if(ciEquals(name, splitData[i-1]) || splitData[i-1].toLowerCase().indexOf(name.toLowerCase()) !== -1) {
						let splitName = splitData[i-1].split('-');
						let name = splitName[0];
						let realm = splitName[1];
						await Utils.missedConnection(name,realm);
						return msg.say("Done! "+splitData[i-1]+" has been logged as a missed connection.");
					}
				}
				return msg.say("That name wasn't found in the queue.");
				
			} else {
				return msg.say("You don't have permission to do this!");
			}
		}
};