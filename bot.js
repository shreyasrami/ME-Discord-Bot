var http = require('http');

http.createServer(function (req, res) {
    var logger = require('winston');
    require('dotenv').config();
    var logger = require('winston');
    const fetch = require("node-fetch")

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

                    stats = stats + `\nFloor Price: ${response.data['floorPrice']}`;
                    stats = stats + `\nListed Count: ${response.data['listedCount']}`;
                    stats = stats + `\nAverage Price: ${response.data['avgPrice24hr']}`;
                    stats = stats + `\nTotal Volume: ${response.data['volumeAll']}`;
                
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


    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(`{"message": "This endpoint is for a Discord Bot"}`);
}).listen(process.env.PORT || 8080);