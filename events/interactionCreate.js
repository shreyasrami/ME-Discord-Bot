const axios = require('axios');
const Projects = require('../db-schema');
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }

        }
	
        
        if (interaction.isSelectMenu()) {

			if (interaction.customId === 'select') {
				await interaction.deferUpdate()
				let projects = [...interaction.values]
				let urls = projects.map(project => `https://api-mainnet.magiceden.dev/v2/collections/${project}/stats`)
				let responses = []

				for (let url of urls) 
					responses.push(await axios.get(url)) 
				
				let convertToSol = 0.000000001

				let modifyResponses = response => {
					let stats = ''

					for ( let property in response.data ) {
						let temp = response.data[property]
						if ( !isNaN(temp) ) 
							if (temp > 100000) // which is not possible since listings cannot be greater than 100000 and fp cannot be lower than 0.0001  
								response.data[property] = parseFloat(temp * convertToSol).toFixed(2)
						
					}

					stats = stats + `\nFloor Price: ${response.data['floorPrice']}`
					stats = stats + `\nListed Count: ${response.data['listedCount']}`
					stats = stats + `\nAverage Price: ${response.data['avgPrice24hr']}`
					stats = stats + `\nTotal Volume: ${response.data['volumeAll']}`

					return stats
				}

				const modifiedResponses = responses.map(modifyResponses)
	
				for (let [index,response] of modifiedResponses.entries()) {
					let embed = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`${projects[index]}`)
						.setDescription(response)
						.setURL(`https://magiceden.io/marketplace/project_tenjin`)
					await interaction.channel.send({ ephemeral: true, embeds: [embed], components: [] });

				}

			}
        }

		if (interaction.isButton()) {
			await interaction.deferUpdate()
			const user = interaction.user.tag
			let all_projects = await Projects.findOne({ user })
			all_projects = all_projects.user_projects
			let urls = all_projects.map(project => `https://api-mainnet.magiceden.dev/v2/collections/${project}/stats`)
			let responses = []

			for (let url of urls) 
				responses.push(await axios.get(url)) 
			
			let convertToSol = 0.000000001

			let modifyResponses = response => {
				let stats = ''

				for ( let property in response.data ) {
					let temp = response.data[property]
					if ( !isNaN(temp) ) 
						if (temp > 100000) // which is not possible since listings cannot be greater than 100000 and fp cannot be lower than 0.0001  
							response.data[property] = parseFloat(temp * convertToSol).toFixed(2)
					
				}

				stats = stats + `\nFloor Price: ${response.data['floorPrice']}`
				stats = stats + `\nListed Count: ${response.data['listedCount']}`
				stats = stats + `\nAverage Price: ${response.data['avgPrice24hr']}`
				stats = stats + `\nTotal Volume: ${response.data['volumeAll']}`

				return stats
			}

			const modifiedResponses = responses.map(modifyResponses)

			for (let [index,response] of modifiedResponses.entries()) {
				let embed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`${all_projects[index]}`)
					.setDescription(response)
					.setURL(`https://magiceden.io/marketplace/project_tenjin`)
				await interaction.channel.send({ ephemeral: true, embeds: [embed], components: [] });
			}

		}

		if (interaction.isAutocomplete()) {
			const user = interaction.user.tag
			let all_projects = await Projects.findOne({ user })
			all_projects = all_projects.user_projects
			let choices = []
			for (const project of all_projects) 
				choices.push({'name': project, 'value': project})
			
			interaction.respond(choices);
		}

        
	},
};