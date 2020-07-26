const lyricsFinder = require('lyrics-finder');

async function getLyrics(artist, title) {

    let lyrics = await lyricsFinder(artist, title) || "Not Found!";
    return lyrics;
    
}

module.exports = {
    getLyrics
}