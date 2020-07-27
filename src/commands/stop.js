const { Command } = require('discord-akairo');

class StopCommand extends Command {
    constructor() {
        super('stop', {
            aliases: ['stop'],
        });
    }

    async exec(message) {
        const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
    }
}

module.exports = StopCommand;