const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const Jimp = require('jimp');
const { drawImageWithTint } = require('../../core/canvas');

module.exports = class PumpkinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pumpkin',
			group: 'meme',
			memberName: 'pumpkin',
			description: 'Pumpkin.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
        // JIMP processing stuff
        let imgPumpkin = './assets/images/pumpkin.png';
        let avatarURL = user.displayAvatarURL;
		
        // Compile everything together
        let tpl = await Jimp.read(avatarURL);
        tpl = await tpl.clone();
		tpl.resize(200,200);
        const papTpl = await Jimp.read(imgPumpkin);
        papTpl.composite(tpl, 150, 180, [Jimp.BLEND_MULTIPLY, 0.5, 0.9]);
		
        // render to buffer
        const buffer = await papTpl.filterType(0).getBufferAsync('image/png');
		await msg.say("", {
					files: [buffer]
		});
	}
};