const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallets = require('../db-schema/wallets');
const Projects = require('../db-schema/projects');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove_nft')
		.setDescription('Remove an existing NFT name')
		.addStringOption(option =>
            option.setName('nft')
                .setDescription('NFT name to be removed')
				.setRequired(true)
				.setAutocomplete(true)),
				
	async execute(interaction) {
		const user = interaction.user.tag        
		const remove_nft = interaction.options.getString('nft')
		const userExist = await Projects.findOne({ user });
	
		if (userExist && remove_nft !== 'None') {
			let nfts = userExist.user_projects
			const index = nfts.findIndex(nft => nft === remove_nft)
			if (index === -1)
				await interaction.reply({content: `NFT: \`${remove_nft}\` does not exist for ${user}`, ephemeral: true })
			
			nfts.splice(index,1)
			await userExist.updateOne({user_projects: nfts})

			await interaction.reply({ content: `Successfully removed NFT: \`${remove_address}\` for ${user}`, ephemeral: true });

		} 
		else 
			await interaction.reply({content: `${user} has no NFTs added yet, please add NFT symbol first.`, ephemeral: true });
		
	},
};