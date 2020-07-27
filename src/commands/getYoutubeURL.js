const { Command } = require('discord-akairo');
const { GOOGLE_API } = require('../../config.json')

const lyrics = require('./lyrics');
const music = require('./music')

const axios = require('axios');
const querystring = require('querystring')

class SearchCommand extends Command {
    constructor() {
        super('search', {
            aliases: ['search'],
        });
    }

    async exec(message, args) {
        const params = {
            q: 'Yorushika That\'s Why I Gave Up on Music',
            part: 'id',
            maxResults: 30,
            key: GOOGLE_API,
        }
        const songTitle = args.slice(1)
        const songAuthor = args[0]

        const lirik = await lyrics.getLyrics(songAuthor, songTitle)
        message.channel.send(lirik)

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
                console.log(findings)
                return message.reply('nih linknya bang', findings[0].link)
            })
        .catch(function(err) {
            return console.log(err)
        })
    }
}

module.exports = SearchCommand;