const { SlashCommandBuilder } = require('@discordjs/builders');
const Projects = require('../db-schema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove an NFT collection from My Collections')
		.addStringOption(option =>
            option.setName('nft')
                .setDescription('Name of the NFT collection to be removed')
                .setRequired(true)
				.setAutocomplete(true)),
				
	async execute(interaction) {
		const user = interaction.user.tag
		let all_projects = await Projects.findOne({ user })
		all_projects = all_projects.user_projects
        const remove_nft = interaction.options.getString('nft')
        const userExist = await Projects.findOne({ user });
    
        if (userExist) {
			let nfts = userExist.user_projects
			const index = nfts.findIndex(nft_name => nft_name === remove_nft)
			if (index === -1)
        		await interaction.reply(`${remove_nft} does not exist in My Collections for ${user}`)
			
			nfts.splice(index,1)
            await userExist.updateOne({user_projects: nfts})
        } else {
        	await interaction.reply(`${user} has no NFT collections added yet`);
        }
		
		await interaction.reply(`Successfully removed new NFT from My Collections for ${user}`);
		

	},
};