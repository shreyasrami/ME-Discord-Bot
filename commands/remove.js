const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallets = require('../db-schema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove an NFT collection from My Collections')
		.addStringOption(option =>
            option.setName('address')
                .setDescription('Name of the NFT collection to be removed')
                .setRequired(true)
				.setAutocomplete(true)),
				
	async execute(interaction) {
		const user = interaction.user.tag
		let all_projects = await Wallets.findOne({ user })
		all_projects = all_projects.wallet_addresses
        const remove_address = interaction.options.getString('address')
        const userExist = await Wallets.findOne({ user });
    
        if (userExist) {
			let addresses = userExist.wallet_addresses
			const index = addresses.findIndex(wallet_address => wallet_address === remove_address)
			if (index === -1)
        		await interaction.reply(`Wallet Address: \`${remove_address}\` does not exist in My Collections for ${user}`)
			
			nfts.splice(index,1)
            await userExist.updateOne({wallet_addresses: addresses})
        } else {
        	await interaction.reply(`${user} has no wallets added yet, please add a wallet address first.`);
        }
		
		await interaction.reply(`Successfully removed Wallet Address: \`${remove_address}\` for ${user}`);
		

	},
};