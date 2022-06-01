const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallets = require('../db-schema/wallets');
const Projects = require('../db-schema/projects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_nft')
		.setDescription('Add a new NFT name')
        .addStringOption(option =>
            option.setName('nft')
                .setDescription('NFT name to be added')
                .setRequired(true)),
                
	async execute(interaction) {
        const user = interaction.user.tag
        const new_nft = interaction.options.getString('nft')
        const userExist = await Projects.findOne({ user });
    
        if (userExist) {
            let nfts = userExist.user_projects
            const index = nfts.findIndex(nft => nft === new_nft)
            if (index === -1){
                userExist.user_projects.push(new_nft)
                await userExist.updateOne({user_projects: userExist.user_projects})
            }
            else
                await interaction.reply({ content: `NFT: \`${new_nft}\` already exists for ${user}`, ephemeral: true })
        } 
        else 
            await Projects.create({
                user,
                user_projects: [new_nft]
            });
        
        await interaction.reply({ content: `Successfully added new NFT: \`${new_nft}\` for ${user}`, ephemeral: true });

	},
};