const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const Projects = require('../db-schema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('View all commands'),
                
	async execute(interaction) {

        let commands = '`/help` - Shows all commands.\n\n`/server` - Shows server information.\n\n`/user` - Shows user information.\n\n`/add nft: foo` - Adds nft named foo to My Collections.\n\n`/remove nft: foo` - Removes nft named foo from My Collections.\n\n`/details` - Shows a select menu with all the nfts in My Collections to get the details from Magic Eden.'
        const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Commands`)
                        .setDescription(commands)                        
				
		await interaction.reply({ embeds: [embed] });

	},
};