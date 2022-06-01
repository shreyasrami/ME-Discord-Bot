const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require('discord.js');
const axios = require('axios');
const Wallets = require('../db-schema/wallets');
const Projects = require('../db-schema/projects');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('details')
		.setDescription('Gives options for NFT details'),
	async execute(interaction) {
		const row = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('my_nfts')
								.setLabel('Added NFTs')
								.setStyle('PRIMARY'),
							new MessageButton()
								.setCustomId('wallet_nfts')
								.setLabel('Wallet NFTs')
								.setStyle('SUCCESS'),
							
						);
		
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`Select a type`)
						
		await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
	},
};