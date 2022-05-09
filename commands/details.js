const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('details')
		.setDescription('Gives options for NFT details'),
	async execute(interaction) {
		let projects = {'Tenjin': 'project_tenjin', 'Honey Bee': 'honey_genesis_bee', 'Balloon': 'balloonsville'}
		let options = []
		for (const project in projects) {
			options.push({'label': project, 'value': projects[project]})
		}

		try {
			
			const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Select NFTs')
					.setMinValues(1)
					.addOptions(options),
			);
		

			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`Magic Eden Stats`)
				.setDescription(`Select an option to fetch the stats of you NFT collections from Magic Eden`)
				.setURL(`https://magiceden.io/marketplace/`)
				
			
			await interaction.reply({ content: 'NFT Details', ephemeral: true, embeds: [embed], components: [row] });




		} catch (err) {
			console.error(err);
		}
            
                
	},
};