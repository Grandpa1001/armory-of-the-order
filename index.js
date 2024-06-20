const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log('bot is ready');
    client.user.setActivity('!help', { type: 'WATCHING' });

});

client.login(token);