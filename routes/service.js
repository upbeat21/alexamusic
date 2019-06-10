var request = require('request')
var dao = require('../db/dao.js')

var host = 'https://musichihi.azurewebsites.net';

function getHotSongs(type, callService, callback) {

    if(!callService) {
        var hotSongs = dao.getHotSongs()
        var isSongValid = checkSong(hotSongs[0].url)
        if(hotSongs != undefined && hotSongs != "" && hotSongs.length > 0 && checkSong(hotSongs[0].url)) {
            addPlaylist(hotSongs.data)
            callback(hotSongs.data[0])
            return
        }
    }

    var command = '/top/song?type=';
    var typeList = [0,7,8,16,96]
    if(typeList.indexOf(type) >= 0) command += type
    else command += 0
    var url = host + command
    console.log(url)
    request(url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
        console.log(body)
        var res = JSON.parse(body)


        //get url for music id
        command = '/song/url?id='
        for(var i=0;i<res.data.length;i++) {
            command += res.data[i].id + ','
        }
        command = command.substr(0, command.length-1)
        url = host + command
        console.log(url)
        request(url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
            //console.log(body)
            var res = JSON.parse(body)
            var data = process(res)
            console.log(JSON.stringify(data))
            dao.saveHotSongs(data)

            addPlaylist(data.data)

            callback(data.data[0])
        });
    });
}

function getNextSong(id) {
    var song = undefined
    var playlist = dao.getPlaylist()
    if(playlist.length > 0) song = playlist[0]
    for(var i=0;i<playlist.length;i++) {
        if(playlist[i].id == id) {
            song = playlist[i+1]
        }
    }
    return song
    //Check if the CDN link has expired
    /*var url = song.url
    request(url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
        //console.log(body)
        var res = JSON.parse(body)
        var data = process(res)
        console.log(JSON.stringify(data))
        dao.saveHotSongs(data)

        addPlaylist(data.data)

        callback(data.data[0])
    });*/

}

function process(res) {
    var fileData = {}
    var data = [];
    console.log(Object.keys(res))
    for(var i=0;i<res.data.length;i++) {
        if(!res.data[i].url && res.data[i] != undefined) continue
        data[i] = {}
        data[i].id = res.data[i].id
        data[i].url = getUrl(res.data[i].url)
    }
    fileData.data = data
    fileData.date = new Date()
    return fileData;
}

function addPlaylist(songs) {
    dao.savePlaylist(songs)
}

function getUrl(url) {
    url = url.replace('http', 'https')
    url = url.replace(/(m\d+?)(?!c)\.music\.126\.net/, '$1c.music.126.net')
    console.log(url)
    return url
}


module.exports = {
    getHotSongs: getHotSongs,
    getNextSong: getNextSong
}