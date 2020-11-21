const {
    Command
} = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const Utils = require('../../core/utils.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../core/canvas');
const Jimp = require('jimp');

module.exports = class NzothCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nzoth',
			group: 'meme',
			memberName: 'nzoth',
			description: 'Draws the Gift of Nzoth over a user\'s avatar.',
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
        let imgPap = './assets/images/nzoth.png';
        let snowflake = new Date().getTime();
        let imgBG = './img/temp/active_' + snowflake + '.png';
        let avatarURL = user.displayAvatarURL;
		
        // Compile everything together
        let tpl = await Jimp.read(avatarURL);
        tpl = await tpl.clone();
		tpl.resize(500,500);
        const papTpl = await Jimp.read(imgPap);
        tpl.composite(papTpl, 0, 0, [Jimp.BLEND_DESTINATION_OVER, 1, 1]);
		
        // render to buffer
        const buffer = await tpl.filterType(0).getBufferAsync('image/png');
		await msg.say("", {
					files: [buffer]
				});
    };
};