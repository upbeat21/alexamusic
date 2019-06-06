var fs = require('fs')

function saveHotSongs(data) {
    fs.writeFile(__dirname + '/hotSongs.json', JSON.stringify(data), function(err){
        if(err) console.log(err)
        else console.log('Hot songs saved!')
    })
}

function getHotSongs() {
    var data = fs.readFileSync(__dirname + '/hotSongs.json')
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

module.exports = {
    saveHotSongs: saveHotSongs,
    getHotSongs: getHotSongs,
    savePlaylist: savePlaylist,
    getPlaylist: getPlaylist
}