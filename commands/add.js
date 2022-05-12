const { SlashCommandBuilder } = require('@discordjs/builders');
const Projects = require('../db-schema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add an NFT collection to My Collections')
        .addStringOption(option =>
            option.setName('nft')
                .setDescription('Name of the NFT collection to be added')
                .setRequired(true)
                .setAutocomplete(true)),
                
	async execute(interaction) {
        const user = interaction.user.tag
        const new_nft = interaction.options.getString('nft')
        const userExist = await Projects.findOne({ user });
    
        if (userExist) {
			let nfts = userExist.user_projects
            const index = nfts.findIndex(nft_name => nft_name === new_nft)
			if (index === -1){
                userExist.user_projects.push(new_nft)
                console.log(userExist.user_projects)
			    await userExist.updateOne({user_projects: userExist.user_projects})
            }
            else
        		await interaction.reply(`${new_nft} already exists in My Collections for ${user}`)
        } else {
            await Projects.create({
                user,
                user_projects: [new_nft]
            });
        }
        
        await interaction.reply(`Successfully added new NFT to My Collections for ${user}`);

    
	},
};