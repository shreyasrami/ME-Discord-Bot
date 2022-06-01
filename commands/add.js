const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallets = require('../db-schema/wallets');
const Projects = require('../db-schema/projects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add a new Wallet Address')
        .addStringOption(option =>
            option.setName('address')
                .setDescription('Wallet Address to be added')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nft')
                .setDescription('NFT to be added')
                .setRequired(true)),
                
	async execute(interaction) {
        const user = interaction.user.tag
        if (interaction.options.getString('address')) {
            const new_address = interaction.options.getString('address')
            const userExist = await Wallets.findOne({ user });
        
            if (userExist) {
                let addresses = userExist.wallet_addresses
                const index = addresses.findIndex(wallet_address => wallet_address === new_address)
                if (index === -1){
                    userExist.wallet_addresses.push(new_address)
                    await userExist.updateOne({wallet_addresses: userExist.wallet_addresses})
                }
                else
                    await interaction.reply({ content: `Wallet Address: \`${new_address}\` already exists for ${user}`, ephemeral: true })
            } 
            else 
                await Wallets.create({
                    user,
                    wallet_addresses: [new_address]
                });
            
            
            await interaction.reply({ content: `Successfully added new Wallet Address: \`${new_address}\` for ${user}`, ephemeral: true });

        }
        else if (interaction.options.getString('nft')) {

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

        }
        else 
            await interaction.reply({ content: `Please add a valid option for command (either \`address\` or \`nft\`)`, ephemeral: true });

	},
};