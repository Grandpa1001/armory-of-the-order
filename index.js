const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ] });

client.once('ready', () => {
    console.log('bot is ready');
    client.user.setActivity('!help', { type: 'WATCHING' });

});


client.on('messageCreate', async message => {

    console.log(message.content);
    if (message.content.toLowerCase() === 'czesc') {
        message.channel.send('Cześć!');
    }
});

client.login(token);