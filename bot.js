var http = require('http');
var logger = require('winston');
require('dotenv').config();
var logger = require('winston');
const fetch = require("node-fetch")

const { Client, Intents } = require('discord.js');

const client = new Client(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }
);

http.createServer(function (req, res) {

    client.on('ready', () => {
        logger.info(`Logged in as ${client.user.id}`)

    });


    client.on('messageCreate', (msg) => {
        if (msg.content === 'Hello') 
        msg.reply('Hi');

    });

    client.login(process.env.DISCORD_TOKEN)

    
}).listen(process.env.PORT || 8080);