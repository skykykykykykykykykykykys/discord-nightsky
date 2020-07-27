const { Command } = require('discord-akairo')
const { GOOGLE_API } = require('../../config.json')

const axios = require('axios')
const querystring = require('querystring')

class SearchCommand extends Command {
    constructor() {
        super('search', {
            aliases: ['search'],
        });
    }

    async exec(message) {
        console.log((message.toString()).split(' ').slice(1))
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
                hasil = findings[0].link
            })
            return message.reply(hasil)
        .catch(function(err) {
            return console.log(err)
        })
    }
}

async function getYoutubeURL(message) {
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
            console.log(findings[0].link)
            // eslint-disable-next-line no-unused-vars
            hasil = findings[0].link
        })
        return hasil
    .catch(function(err) {
        return console.log(err)
    })
}

module.exports = SearchCommand, getYoutubeURL;