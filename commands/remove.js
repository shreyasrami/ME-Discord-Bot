const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallets = require('../db-schema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove an existing Wallet Address')
		.addStringOption(option =>
            option.setName('address')
                .setDescription('Wallet Address to be removed')
                .setRequired(true)
				.setAutocomplete(true)),
				
	async execute(interaction) {
		const user = interaction.user.tag
        const remove_address = interaction.options.getString('address')
        const userExist = await Wallets.findOne({ user });
    
        if (userExist) {
			let addresses = userExist.wallet_addresses
			const index = addresses.findIndex(wallet_address => wallet_address === remove_address)
			if (index === -1)
        		await interaction.reply(`Wallet Address: \`${remove_address}\` does not exist in My Collections for ${user}`)
			
			addresses.splice(index,1)
            await userExist.updateOne({wallet_addresses: addresses})
        } else {
        	await interaction.reply(`${user} has no wallets added yet, please add a wallet address first.`);
        }
		
		await interaction.reply(`Successfully removed Wallet Address: \`${remove_address}\` for ${user}`);
		

	},
};