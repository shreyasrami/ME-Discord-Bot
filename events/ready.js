var logger = require('winston');
const mongoose = require('mongoose')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await mongoose.connect(
			process.env.MONGO_URI,
			{
				keepAlive:true
			}
		)
        logger.info(`Logged in as ${client.user.tag}`);
	},
};