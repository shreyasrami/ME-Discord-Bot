const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
const axios = require('axios');
const Projects = require('../db-schema');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('details')
		.setDescription('Gives options for NFT details'),
	async execute(interaction) {
		const user = interaction.user.tag
        const userExist = await Projects.findOne({ user });
		if (userExist && userExist.user_projects.length > 0) {
			
			try {
				let projects = userExist.user_projects
				let options = []
				for (const project of projects) 
					options.push({'label': project, 'value': project})
				
				
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
		}
		else
			await interaction.reply(`There are no NFTs added for ${user} yet, Please add new NFTs to get the details`);


                
	},
};