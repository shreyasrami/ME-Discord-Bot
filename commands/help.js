const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('View all commands'),
                
	async execute(interaction) {

        let commands = '`/help` - Shows all commands.\n\n`/server` - Shows server information.\n\n`/user` - Shows user information.\n\n`/add address: foo` - Adds Wallet Address: \`foo\` for the user.\n\n`/add nft: foo` - Adds NFT: \`foo\` for the user.\n\n`/remove_address address: foo` - Removes Wallet Address: \`foo\`.\n\n`/remove_nft nft: foo` - Removes NFT: \`foo\`.\n\n`/details` - Shows a select menu with all the nfts to get the details from Magic Eden.'
        const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Commands`)
                        .setDescription(commands)                        
				
		await interaction.reply({ embeds: [embed] , ephemeral: true });

	},
};