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
    
        if (userExist && remove_address !== 'None') {
			let addresses = userExist.wallet_addresses
			const index = addresses.findIndex(wallet_address => wallet_address === remove_address)
			if (index === -1)
        		await interaction.reply({content: `Wallet Address: \`${remove_address}\` does not exist in My Collections for ${user}`, ephemeral: true })
			
			addresses.splice(index,1)
            await userExist.updateOne({wallet_addresses: addresses})

			await interaction.reply({ content: `Successfully removed Wallet Address: \`${remove_address}\` for ${user}`, ephemeral: true });

        } else {
        	await interaction.reply({content: `${user} has no wallets added yet, please add a wallet address first.`, ephemeral: true });
        }
			
	},
};