const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallets = require('../db-schema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add an NFT collection to My Collections')
        .addStringOption(option =>
            option.setName('address')
                .setDescription('Name of the NFT collection to be added')
                .setRequired(true)),
                
	async execute(interaction) {
        const user = interaction.user.tag
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
        		await interaction.reply(`Wallet Address: \`${new_address}\` already exists for ${user}`)
        } else {
            await Wallets.create({
                user,
                wallet_addresses: [new_address]
            });
        }
        
        await interaction.reply(`Successfully added new Wallet Address: \`${new_address}\` for ${user}`);

    
	},
};