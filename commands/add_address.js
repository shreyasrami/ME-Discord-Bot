const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallets = require('../db-schema/wallets');
const Projects = require('../db-schema/projects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_address')
		.setDescription('Add a new Wallet Address')
        .addStringOption(option =>
            option.setName('address')
                .setDescription('Wallet Address to be added')),
                
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
                await interaction.reply({ content: `Wallet Address: \`${new_address}\` already exists for ${user}`, ephemeral: true })
        } 
        else 
            await Wallets.create({
                user,
                wallet_addresses: [new_address]
            });
    
        await interaction.reply({ content: `Successfully added new Wallet Address: \`${new_address}\` for ${user}`, ephemeral: true });

	},
};