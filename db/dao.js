var fs = require('fs')

function saveNewSongs(data, type) {
    fs.writeFile(__dirname + '/newSongs' + type + '.json', JSON.stringify(data), function(err){
        if(err) console.log(err)
        else console.log('New songs saved!')
    })
}

function getNewSongs(type) {
    var data = fs.readFileSync(__dirname + '/newSongs' + type + '.json')
    return data != "" ? JSON.parse(data) : undefined
}

function savePlaylist(songs) {
    fs.writeFile(__dirname + '/playlist.json', JSON.stringify(songs), function(err){
        if(err) console.log(err)
        else console.log('Playlist saved!')
    })
}

function getPlaylist() {
    var data = fs.readFileSync(__dirname + '/playlist.json')
    return data != "" ? JSON.parse(data) : undefined
}

function savePausedSong(data) {
    fs.writeFile(__dirname + '/songOffset.json', JSON.stringify(data), function(err){
        if(err) console.log(err)
        else console.log('Playlist saved!')
    })
}

function getPausedSong() {
    var data = fs.readFileSync(__dirname + '/songOffset.json')
    return data != "" ? JSON.parse(data) : undefined
}

module.exports = {
    saveNewSongs: saveNewSongs,
    getNewSongs: getNewSongs,
    savePlaylist: savePlaylist,
    getPlaylist: getPlaylist,
    savePausedSong: savePausedSong,
    getPausedSong: getPausedSong
}