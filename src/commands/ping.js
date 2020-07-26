const { Command } = require('discord-akairo');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping', 'hello'],
        });
    }

    async exec(message) {
        const sent = await message.reply('Pong!');
        const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        return message.reply([
            'Pong!',
            `🔂 **RTT**: ${timeDiff} ms`,
            `💟 **Heartbeat**: ${Math.round(this.client.ws.ping)} ms`,
        ]);
    }
}

module.exports = PingCommand;