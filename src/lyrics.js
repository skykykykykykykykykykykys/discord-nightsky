const scraper = require("azlyrics-scraper");

function removeSpace(text) {
    return text.split(" ").join("");
}

export function getLyrics(artist, title) {

    artist = removeSpace(artist);
    title = removeSpace(title);

    url = 'https://www.azlyrics.com/lyrics/'+ artist + '/' + title + '.html'
    scraper.getLyricFromLink(url).then(result => {
        console.log(result.join(""));
        return result;
    }).catch(error => {
        console.log(error)
    });
};
