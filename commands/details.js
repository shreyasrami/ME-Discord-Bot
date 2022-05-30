const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require('discord.js');
const axios = require('axios');
const Wallets = require('../db-schema');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('details')
		.setDescription('Gives options for NFT details'),
	async execute(interaction) {
		const user = interaction.user.tag
        const userExist = await Wallets.findOne({ user });
		if (userExist && userExist.wallet_addresses.length > 0) {
			
			try {
				let options = []
				let addresses = userExist.wallet_addresses
				for (const address of addresses) {
					const collections = await axios.get(`https://api-mainnet.magiceden.dev/v2/wallets/${address}/tokens?offset=0&limit=100`)
					for (const collection of collections.data) 
						options.push({'label': collection.collectionName, 'value': collection.collection})
				}
				options = [...new Map(options.map(item => [item['value'], item])).values()]
				
				const row1 = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId('select')
						.setPlaceholder('Select NFTs')
						.setMinValues(1)
						.addOptions(options),
				);
				const row2 = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('all')
							.setLabel('All')
							.setStyle('SUCCESS'),
					);

				const embed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`Magic Eden Stats`)
					.setDescription(`Select an option to fetch the stats of your NFT collections from Magic Eden`)
					.setURL(`https://magiceden.io/marketplace/`)
					
				
				await interaction.reply({ ephemeral: true, embeds: [embed], components: [row1,row2] });


			} catch (err) {
				console.error(err);
			}
		}
		else
			await interaction.reply(`There are no wallets added for ${user} yet, Please add new wallet address to get the details`);
          
	},
};