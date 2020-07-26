// require the discord.js module
const Discord = require('discord.js');
const config = require('../config.json');
const lyrics = require('./lyrics');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Halo weebs!');
});

//listener

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    console.log(message.content)

	if (command === 'ping') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.')
    } else if (message.content === '!weeb') {
        console.log(message.content)
        console.log(lyrics.getLyrics("Aimer", "Ref:rain"))
        message.channel.send("test")
    }
});



// login to Discord with your app's token
client.login(config.token);
