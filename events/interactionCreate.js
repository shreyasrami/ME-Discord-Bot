const axios = require('axios');
const Wallets = require('../db-schema');
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
                await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
            }

        }
	
        
        if (interaction.isSelectMenu()) {

			if (interaction.customId === 'select') {
				await interaction.deferReply({ ephemeral: true })
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

					stats = stats + `\n> Floor Price: ${response.data['floorPrice']}`
					stats = stats + `\n> Listed Count: ${response.data['listedCount']}`
					stats = stats + `\n> Average Price: ${response.data['avgPrice24hr']}`
					stats = stats + `\n> Total Volume: ${response.data['volumeAll']}`

					return stats
				}

				const modifiedResponses = responses.map(modifyResponses)

				let all_details = ``
				for (let [index,response] of modifiedResponses.entries()) 
					all_details = all_details + `\n**[${projects[index]}](https://magiceden.io/marketplace/${projects[index]})**\n${response}\n\n\n`
				

				let embed = new MessageEmbed()
						.setColor('#0099ff')
						.setDescription(all_details)
					
				await interaction.editReply({ ephemeral: true, embeds: [embed]});
	
			}
        }

		if (interaction.isButton()) {
			await interaction.deferReply({ ephemeral: true })
			const user = interaction.user.tag
			let all_wallets = await Wallets.findOne({ user })
			all_wallets = all_wallets.wallet_addresses
			let all_projects = []
			let responses = []

			for (const wallet of all_wallets) {
				const collections = await axios.get(`https://api-mainnet.magiceden.dev/v2/wallets/${wallet}/tokens?offset=0&limit=100`)
				for (const collection of collections.data) {
					if(collection.collection)
						all_projects.push(collection.collection)	
				}
			}
			
			all_projects = all_projects.filter((v, i, a) => a.indexOf(v) === i)

			for(const project of all_projects) 
				responses.push(await axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${project}/stats`))

			
			
			let convertToSol = 0.000000001

			let modifyResponses = response => {
				let stats = ''

				for ( let property in response.data ) {
					let temp = response.data[property]
					if ( !isNaN(temp) ) 
						if (temp > 100000) // which is not possible since listings cannot be greater than 100000 and fp cannot be lower than 0.0001  
							response.data[property] = parseFloat(temp * convertToSol).toFixed(2)
					
				}

				stats = stats + `\n> Floor Price: ${response.data['floorPrice']}`
				stats = stats + `\n> Listed Count: ${response.data['listedCount']}`
				stats = stats + `\n> Average Price: ${response.data['avgPrice24hr']}`
				stats = stats + `\n> Total Volume: ${response.data['volumeAll']}`

				return stats
			}

			const modifiedResponses = responses.map(modifyResponses)

			let all_details = ``
			for (let [index,response] of modifiedResponses.entries()) 
				all_details = all_details + `\n**[${all_projects[index]}](https://magiceden.io/marketplace/${all_projects[index]})**\n${response}\n\n\n`
			

			let embed = new MessageEmbed()
					.setColor('#0099ff')
					.setDescription(all_details)
				
			await interaction.editReply({ ephemeral: true, embeds: [embed]});
			
		}

		if (interaction.isAutocomplete()) {
			let choices = []

			if (interaction.commandName === "remove") {
				const user = interaction.user.tag
				let all_wallets = await Wallets.findOne({ user })
				if(all_wallets){
					all_wallets = all_wallets.wallet_addresses
					for (const wallet of all_wallets) 
						choices.push({'name': wallet, 'value': wallet})
				
					interaction.respond(choices);
				
				}
				else
					interaction.respond([{'name': 'None','value': 'None'}])
			}

		}

        
	},
};