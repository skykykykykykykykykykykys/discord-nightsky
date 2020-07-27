const { Command } = require('discord-akairo');
const ytdl = require('ytdl-core');

const axios = require('axios')
const querystring = require('querystring')

const lyrics = require('./lyrics');
const { GOOGLE_API } = require('../../config')


class MusicCommand extends Command {
    constructor() {
        super('play', {
            aliases: ['play'],
        });
    }

    async exec(message) {
		const queue = message.client.queue;
		const serverQueue = await queue.get(message.guild.id);

		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need the permissions to join and speak in your voice channel!');
		}

		const youtubeURL = await this.getYoutubeURL(message)

		const songInfo = await ytdl.getInfo(youtubeURL);
		const song = {
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
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
				this.playSong(message, queueContruct.songs[0]);
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

	async playSong(message, song) {
		const queue = message.client.queue;
		const guild = message.guild;
		const serverQueue = queue.get(message.guild.id);

		const songArtist = ((message.toString()).split(' ').slice(1))[0]
		const args = (message.toString()).split(' ').slice(2)
		const songTitle = args.join(' ')

		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}

		const dispatcher = serverQueue.connection
			.play(ytdl(song.url))
			.on('finish', () => {
				serverQueue.songs.shift();
				this.playSong(message, serverQueue.songs[0]);
			})
			.on('error', error => {
				console.error(error)
				serverQueue.voiceChannel.leave()
			});
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		serverQueue.textChannel.send(`Start playing: **${song.title}**`);

		return message.channel.send(await lyrics.getLyrics(songArtist, songTitle))
	}

	async getYoutubeURL(message) {
		const args = (message.toString()).split(' ').slice(1)
		const params = {
			q: args.join(' '),
			part: 'id',
			maxResults: 30,
			key: GOOGLE_API,
		}
		let hasil = ''

		await axios.get('https://www.googleapis.com/youtube/v3/search?' + querystring.stringify(params))
			.then(function(response) {
				const result = response.data
				const findings = result.items.map(function(item) {
					let link = ''
					let id = ''
					switch (item.id.kind) {
						case 'youtube#channel':
							link = 'https://www.youtube.com/channel/' + item.id.channelId
							id = item.id.channelId
							break
						case 'youtube#playlist':
							link = 'https://www.youtube.com/playlist?list=' + item.id.playlistId
							id = item.id.playlistId
							break
						default:
							link = 'https://www.youtube.com/watch?v=' + item.id.videoId
							id = item.id.videoId
							break
					}

					return {
						id: id,
						link: link,
						kind: item.id.kind,
					}
				})
				// eslint-disable-next-line no-unused-vars
				hasil = findings[0].link
			})
		return hasil
	}
}

module.exports = MusicCommand;