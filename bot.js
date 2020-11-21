// --------------------------------
// Important requires and constants
// --------------------------------

const {
    CommandoClient
} = require('discord.js-commando');
const path = require('path');
const Discord = require('discord.js');
const Utils = require('./core/utils.js');
const config = require("./config.json");
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var canPost = true;
var donationTotal = "Warming up!";

// --------------------------------
// Register the client and commands
// --------------------------------

const client = new CommandoClient({
    commandPrefix: '!',
    unknownCommandResponse: false,
    owner: '194534206217388032',
    disableEveryone: true
});

function log(colour, string) {
    console.log(colour, string);
}

async function grabData() {
	await Utils.delay(60000);
    Utils.log("\x1b[36m","ACT: Periodic data grab (60s)");
    canPost = true;
    donationTotal = await Utils.getDonationCount();
    await Utils.downloadQueue();
    await Utils.downloadMissedConnections();
    await Utils.downloadRaffle();
    grabData();
}

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['carry', 'Shadywish Commands'],
        ['donate', 'Donation Commands'],
        ['carrier', 'Carrier-only Commands'],
        ['meme', 'Meme Commands'],
        ['admin', 'Admin Commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));


// -------------------------------
// Let's a-go!
// -------------------------------

client.on('message', async message => {
    if(message.author.bot) return;    
    // Auto responder
    //if(message.channel.name !== "ask-an-admin") return;
    if(!message.content.includes('?')) return;
    if(message.content.toLowerCase().includes('vc') || message.content.toLowerCase().includes('voice chat') || message.content.toLowerCase().includes('voice')) {
        message.channel.send("**Voice chat is for our carriers and admins only!**");
    }
    else if(message.content.toLowerCase().includes('twitch') || message.content.toLowerCase().includes('stream')) {
        message.channel.send("**The stream can be found here: https://www.twitch.tv/grethamplz**");
    }
    else if(message.content.toLowerCase().includes('position') || message.content.toLowerCase().includes('queue')) {
        message.channel.send("**If you want to check your position in the queue, go to <#758177882840498236> and use !pos Yournamehere!**");
    }
    else if((message.content.toLowerCase().includes('swap') || message.content.toLowerCase().includes('earlier')) && message.content.toLowerCase().includes('run')) {
        message.channel.send("**Please check <#759132390177505302> if you're interested in swapping your run with another person!**");
    }
    else if((message.content.toLowerCase().includes('signup') || message.content.toLowerCase().includes('sign up')) && message.content.toLowerCase().includes('how')) {
        message.channel.send("**If signups are currently open, use the !signup command in the <#758177882840498236> channel!**");
    }
    else if(message.content.toLowerCase().includes('outside') || message.content.toLowerCase().includes('instance')) {
        message.channel.send("**We'd prefer you were outside and ready to enter the raid as it speeds things up, but we can summon you if necessary.**");
    }
    else if(message.content.toLowerCase().includes('requirements')) {
        message.channel.send("**All requirements are listed in the <#746150463262556231> and <#758177882840498236> channels!**");
    }
    else if(message.content.toLowerCase().includes('table')) {
        message.channel.send("https://www.youtube.com/watch?v=XtAhISkoJZc");
    }
    else if(message.content.toLowerCase().includes('this rat')) {
        let nickname = message.author.username;
        var facts = ["no rat for you, "+nickname+".", "why do you want this rat, "+nickname+"?", "if I hear someone requesting this rat again I'm going offline forever I stg.", "which rat in particular do you want, "+nickname+"? I like remy from ratatouille personally.", "why do you insist on tormenting me with this rat, "+nickname+"?", "no. no more rats.", "please, I may be a bot but I have feelings too, "+nickname+" :("];
        var fact = Math.floor(Math.random() * facts.length);
        if(Math.random() < 0.25)
            message.channel.send(facts[fact]);
        else
            message.channel.send({
            files: ['./img/postthisrat.gif']
        });
    }
    else if(message.content.toLowerCase().includes('jaina') && message.content.toLowerCase().includes('online')) {
            message.channel.send("**Please be online and ready for the Jaina run if you win the raffle, else your spot will be re-raffled and given to someone else!**");
    }
    else if(message.content.toLowerCase().includes('time')) {
        if(message.content.toLowerCase().includes('jaina')) {
            message.channel.send("**The Jaina run is raffled off at the end of the night, between 11:00pm and 11:30pm EST assuming we're on schedule! Stay tuned in to the twitch stream for more accurate info.**");
        } else if(message.content.toLowerCase().includes('run')) {
            message.channel.send("**Please check <#746150463262556231> for estimated run times, or use !runtime # in the <#758177882840498236> channel to see a specific run's time.**");
        } else {
            message.channel.send("**Please check <#746150463262556231> for more specific time info.**");
        }
    }
    else if(message.content.toLowerCase().includes('queso')) {
        message.channel.send({
            files: ['./img/queso.png']
        });
    }
    else if(message.content.toLowerCase().includes('jaina')) {
            message.channel.send("**We have one Jaina run that is raffled off at the end of the night to 2 lucky people. Please stay tuned on twitch to make sure you don't miss it!**");
    }
    else if(message.content.toLowerCase().includes('schedule')) {
            message.channel.send("**Please check <#746150463262556231> for estimated run times, and <#746593850231095387> has all information about upcoming runs!**");
    }
    else if(message.content.toLowerCase().includes('whats up') || message.content.toLowerCase().includes('what\'s up')) {
        message.channel.send("The sky!");
    } else {
        if(canPost) {
            message.channel.send("idk man it's your house")
                .then(message => {
                        message.delete(5000)
                    })
            canPost = false;
        }
    }
});

client.on('ready', () => {
    log("\x1b[36m%s\x1b[0m", "Bot has started, with " + client.users.size + " users!");
    grabData();
    setInterval(() => {
        client.user.setActivity(donationTotal); // sets bot's activities to one of the phrases in the arraylist.
    }, 10000); // Runs this every 10 seconds.
});

client.login(config.token);