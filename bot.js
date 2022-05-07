var http = require('http');
var logger = require('winston');
require('dotenv').config();

const { Client, Intents, MessageEmbed } = require('discord.js');

const client = new Client(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }
);
const axios = require('axios')
    

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`)

});


client.on('messageCreate', (msg) => {
    let args = msg.content.split(' ')
    let command = args[0];

    if (command === '!nft') {

        let name = args[1];

        if (!name) {
            msg.reply("Please provide the name of NFT collection.");
        } else {
            let axiosOptions = {
            method: "get",
            url: `https://api-mainnet.magiceden.dev/v2/collections/${name}/stats`
            }

            axios(axiosOptions)
            .then(response => {
                let stats = ''
                let convertToSol = 0.000000001

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
            
                let embed = new MessageEmbed()
                    .setTitle(`Magic Eden: ${name}`)
                    .setDescription(stats)
                    .setURL(`https://magiceden.io/marketplace/${name}`)
                msg.channel.send({ embeds: [embed] });

            })
        }
    }
        
});

client.login(process.env.DISCORD_TOKEN)

http.createServer(function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(`{"message": "This endpoint is for a Discord Bot"}`);
}).listen(process.env.PORT || 8080);