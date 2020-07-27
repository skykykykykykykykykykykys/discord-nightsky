const ytdl = require('ytdl-core');
const { Command } = require('discord-akairo');

const lyrics = require('./lyrics');
const youtubeUrl = require('./getYoutubeURL');

const queue = new Map();

// async function execute(message, serverQueue) {
// 	const args = message.content.split(' ');

// 	const voiceChannel = message.member.voice.channel;
// 	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
// 	const permissions = voiceChannel.permissionsFor(message.client.user);
// 	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
// 		return message.channel.send('I need the permissions to join and speak in your voice channel!');
// 	}

// 	const songInfo = await ytdl.getInfo(args[1]);
// 	const song = {
// 		title: songInfo.title,
// 		url: songInfo.video_url,
// 	};

// 	if (!serverQueue) {
// 		const queueContruct = {
// 			textChannel: message.channel,
// 			voiceChannel: voiceChannel,
// 			connection: null,
// 			songs: [],
// 			volume: 5,
// 			playing: true,
// 		};

// 		// eslint-disable-next-line no-undef
// 		queue.set(message.guild.id, queueContruct);

// 		queueContruct.songs.push(song);

// 		try {
// 			const connection = await voiceChannel.join();
// 			queueContruct.connection = connection;
// 			play(message.guild, queueContruct.songs[0]);
//         }
//         catch (err) {
// 			console.log(err);
// 			queue.delete(message.guild.id);
// 			return message.channel.send(err);
// 		}
//     }
//     else {
// 		serverQueue.songs.push(song);
// 		console.log(serverQueue.songs);
// 		return message.channel.send(`${song.title} has been added to the queue!`);
// 	}

// }

class ExecuteMusic extends Command {
    constructor() {
        super('play', {
            aliases: ['play'],
        });
    }

    async exec(message) {
		const serverQueue = queue.get(message.guild.id);
		const args = message.content.split(' ');

		const songTitle = args.slice(1)
		const songAuthor = args[0]
		const lirik = await lyrics.getLyrics(songAuthor, songTitle)
		message.channel.send(lirik)

		const url = youtubeUrl.getYoutubeUrl(message);
		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need the permissions to join and speak in your voice channel!');
		}

		const songInfo = await ytdl.getInfo(url);
		const song = {
			title: songInfo.title,
			url: songInfo.video_url,
		};

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true,
			};

			queue.set(message.guild.id, queueContruct);

			queueContruct.songs.push(song);

			try {
				const connection = await voiceChannel.join();
				queueContruct.connection = connection;
				play(message.guild, queueContruct.songs[0]);
			}
			catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		}
		else {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send(`${song.title} has been added to the queue!`);
		}
	}
}

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

module.exports = {
    ExecuteMusic,
}

