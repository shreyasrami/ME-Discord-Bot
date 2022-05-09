const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with server info!'),
	async execute(interaction) {
        await interaction.reply(`Server name: ${interaction.guild.name}\nCreated At: ${interaction.guild.createdAt}\nTotal members: ${interaction.guild.memberCount}`);

	},
};