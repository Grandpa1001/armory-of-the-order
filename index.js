const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

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



client.on('messageCreate', async (message) => {

    console.log(message.content);
    if (message.content.toLowerCase() === 'czesc') {
        message.channel.send('Cześć!');
    }

    if (message.attachments.size > 0) {
        if (message.attachments.size > 0) {
            message.attachments.forEach(async (attachment) => {
              if (attachment.name.endsWith('.csv')) {
                const response = await axios.get(attachment.url, {
                  responseType: 'stream'
                });
        
                const filePath = './downloaded.csv';
                const writer = fs.createWriteStream(filePath);
        
                response.data.pipe(writer);
        
                writer.on('finish', () => {
                  console.log('Plik pobrany pomyślnie.');
                  processCSV(filePath);
                  message.channel.send('zapisano plik!');
                });
        
                writer.on('error', (err) => {
                  console.error('Błąd podczas zapisywania pliku:', err);
                });
              }
            });
          }
        }
    });

function processCSV(filePath) {
    const products = {};
  
    fs.createReadStream(filePath)
      .pipe(csv({ separator: '\t' })) // Użycie tabulatora jako separatora
      .on('data', (row) => {
        const player = row.Gracz;
        const item = row.Przedmiot;
        const quantity = parseInt(row.Ilość, 10);
  
        if (!products[player]) {
          products[player] = {};
        }
  
        if (!products[player][item]) {
          products[player][item] = 0;
        }
  
        products[player][item] += quantity;
    })
    .on('end', () => {
      const jsonFilePath = './grouped_products.json';
      fs.writeFile(jsonFilePath, JSON.stringify(products, null, 2), (err) => {
        if (err) {
          console.error('Błąd podczas zapisywania pliku JSON:', err);
        } else {
          console.log(`Dane zostały zapisane do pliku ${jsonFilePath}`);
        }
      });
    })
    .on('error', (error) => {
      console.error(error);
    });
}

client.login(token);