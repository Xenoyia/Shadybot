const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');
const config = require("../../config.json");

module.exports = class SignupCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'signup',
            group: 'carry',
            memberName: 'signup',
            description: 'Sign up to the next Shadywish carry!',
            examples: ['signup'],
			guildOnly: true
        });
    }

    async run(msg) {
		Utils.log("\x1b[36m","ACT: Starting signup from "+msg.member.user.tag);
		//theMsg = "";
		msg.delete(100);
		if(msg.channel.name !== "shadybot") {
			return msg.reply('This command can only be used in the <#758177882840498236> channel!')
				.then(msg => {
					msg.delete(10000)
				})
			.catch();
		}
		else if(Utils.isSignupClosed() == true) {
			Utils.clog("Signup Failed", "Signup from **"+msg.member.user.tag+"** failed because signups are closed. Brain extremely smooth.", this.client);
			return msg.reply('Signups are currently closed! Please check <#746593850231095387> for when they open next!')
				.then(msg => {
					msg.delete(10000)
				})
			.catch();
		}
		try {
			var numberInQueue = await Utils.getCount();
			if(numberInQueue >= 120) {
				return msg.direct('Hello! Thanks for your interest in Shadywish. Unfortunately, our queue is now full for the next run. You are welcome to join the stream once the run begins to try to get a raffle spot, but please check the upcoming-runs channel in the discord server for when the next sign ups are open if you would like a guaranteed spot!');
			}
			var name = "";
			var battletag = "";
			var realm = "";
			var blockProcess = 0;
			var cancel = 0;
			var realmCheck = 0;
			if (blockProcess === 0) {
				await msg.direct('Hello! Welcome to Shadywish! What is the name of the character you would like to bring? Please note it must be 120, Horde, and have the legendary cloak ready for invite. Make sure the spelling is correct with all accented characters. If you do not meet the requirements, please say `cancel`.');
				await msg.author.dmChannel.awaitMessages(res  => {
				  if(!res.author.bot) {
					if (res.content.toLowerCase() === 'cancel') {
					  return cancel = 1;
					}
					if (res.content.indexOf('-') > -1)
					{
						let cleanName = res.content.replace(/\s+/g, '');
						let splitName = cleanName.split('-');
						name = splitName[0];
						realm = splitName[1];
						realmCheck = 1;
						Utils.log("\x1b[33m","RES: " + res.content + ' <- smooth brain');
					} else {
						blockProcess = 1;
						name = res.content;
						Utils.log("\x1b[33m","RES: " + res.content);
					}
					if(realmCheck == 1) {
						//theMsg.edit(Utils.addclog(//theMsg, "Name", "Input: " + name));
						let oldRealm = realm;
						realm = Utils.realmCheck(realm);
						//theMsg.edit(Utils.addclog(//theMsg, "Realm", "Input: " + oldRealm+"\nLevenshtein: " +realm));
						return msg.direct('Got it! Recorded your name as ' + name + ' and your realm as ' + realm + '. Remember, if you mess up any of these, just contact an admin quickly to get it fixed.');
					} else {
						//theMsg.edit(Utils.addclog(//theMsg, "Name", "Input: " + name));
						return msg.direct('Got it! Recorded your name as ' + name + '. Remember, if you mess up any of these, just contact an admin quickly to get it fixed.');
					}
				  }
				}, { max: 1, time: 60000, errors: ['time'] })
				.catch(() => {
					cancel = 1;
				  return msg.direct('You ran out of time! If you want to try the sign up again, please use the `!signup` command once more.');
				});
			}
			
			if(cancel == 1) {
				Utils.log("\x1b[31m","BOT: Signup timed out!");
				//theMsg.edit(Utils.addclog(//theMsg, "Error", "Signup has timed out or been canelled!"));
				Utils.clog("Signup Failed", "Signup from **"+msg.member.user.tag+"** failed, either cancelled or ran out of time. User input was:\n**Name:** "+name+"\n**Realm:** "+realm, this.client);
				return msg.direct('The signup has been cancelled!');
			}
			
			if (blockProcess === 1 && realmCheck == 0 && cancel == 0) {
				await msg.direct('What realm is the character on? Please make sure it is the correct realm with the correct spelling.');
				await msg.author.dmChannel.awaitMessages(res  => {
				  if(!res.author.bot) {
					blockProcess = 2;
					realm = res.content;
					Utils.log("\x1b[33m","RES: " + res.content);
					let oldRealm = realm;
					realm = Utils.realmCheck(realm);
					//theMsg.edit(Utils.addclog(//theMsg, "Realm", "Input: " + oldRealm+"\nLevenshtein: " +realm));
					return msg.direct('Okay, noted your realm as ' + realm + '.');
				  }
				}, { max: 1, time: 60000, errors: ['time'] })
				.catch(() => {
					cancel = 1;
				  return msg.direct('You ran out of time! If you want to try the sign up again, please use the `!signup` command once more.');
				});
			}
			if(cancel == 0) {				
				if(await Utils.isInQueue(name,realm)) {
					Utils.log("\x1b[31m","BOT: User is already in the queue!");		
					Utils.clog("Signup Failed", "Signup from **"+msg.member.user.tag+"** failed, user was already in queue? Please double check. User input was:\n**Name:** "+name+"\n**Realm:** "+realm, this.client);
					//theMsg.edit(Utils.addclog(//theMsg, "Error", "User was already in the queue?"));
					return msg.direct('Hmm, it seems like you are already in our queue! Was this a mistake? Please contact an admin right away if you think this is an error.');
				} else {
					var queueNumber = await Utils.addToQueue(name,realm);
					var nextRun = await Utils.getNextRun();
					//theMsg.edit(Utils.addclog(//theMsg, "Success", "User was successfully added to the queue at position "+queueNumber+"!"));
					Utils.clog("Signup Success", "Signup from **"+msg.member.user.tag+"** successful. User input was:\n**Name:** "+name+"\n**Realm:** "+realm+"\n**Position:** "+queueNumber, this.client);
					return msg.direct('As far as I can see, it all went through successfully. Your position in the queue at this time is ***'+queueNumber+'***, and the next run is: **'+nextRun+'**. Make sure you are on and ready for invite!');
				}
			} else {
				//theMsg.edit(Utils.addclog(//theMsg, "Error", "Signup has timed out or been canelled!"));
				Utils.clog("Signup Failed", "Signup from **"+msg.member.user.tag+"** failed, either cancelled or ran out of time. User input was:\n**Name:** "+name+"\n**Realm:** "+realm, this.client);
				Utils.log("\x1b[31m","BOT: Signup timed out!");				
			}
		} catch(e) {
			Utils.log("\x1b[31m","ERR: " + e.stack);
		}
    };
}