// require the discord.js module
const Discord = require('discord.js');
const config = require('./config.json');


// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Halo weebs!');
});

//listener

client.on('message', message => {
	if (message.content === '!ping') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.')
    } else if (message.content === '!weeb') {
        message.channel.send(':ariqout:')
    }
});



// login to Discord with your app's token
client.login(config.token);
