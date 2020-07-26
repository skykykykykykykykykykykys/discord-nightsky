// require the discord.js module
const Discord = require('discord.js');
const { token, prefix } = require('../config.json');
const lyrics = require('./lyrics');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Halo weebs!');
});

//listener

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    console.log(message.content)

	if (command === 'ping') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.')
        
    } else if (command === 'lyrics') {
        let songTitle = args.slice(1)
        let songAuthor =  args[0]

        let lirik = await lyrics.getLyrics(songAuthor, songTitle)
        message.channel.send(lirik)
        
    } else if (command === 'argsinfo') {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }
    
        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    }
});



// login to Discord with your app's token
client.login(token);
