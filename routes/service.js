var request = require('request')
const req = require('../utils/request')
var dao = require('../db/dao.js')

var host = 'https://musichihi.azurewebsites.net';

async function getHotSongs(type) {

    let playlist
    let hotSongsDO = dao.getHotSongs()
    //var isSongValid = checkSong(hotSongs[0].url)
    let isSongValid = true
    //After the if/else, we will populate the playlist with [{id:},{id:}]
    //First read from db toget the hot songs
    //TODO: Add retention period for hot songs in db
    if(hotSongsDO != undefined && hotSongsDO != "" && hotSongsDO.data.length > 0 && isSongValid) {
        //Add the ids to playlist
        playlist = hotSongsDO.data
    } else { //Then read from the service if none is in DB or it expires after the retention
        let command = '/top/song?type=';
        const typeList = [0,7,8,16,96]
        if(typeList.indexOf(type) >= 0) command += type
        else command += 0
        let url = host + command
        //Get hot songs by calling service
        try {
            const res = await req('GET', url, '')
            const newHotSongsDO = {}
            newHotSongsDO.date = new Date()
            newHotSongsDO.data = new Array()
            playlist = new Array()
            for(let i=0;i<res.body.data.length;i++) {
                newHotSongsDO.data.push({id:res.body.data[i].id})
                playlist.push({id:res.body.data[i].id})
            }
            //Save the hot songs to hot songs DB with [{id:},{id:}], at now only saving ids, don't care if the song is playable or not
            dao.saveHotSongs(newHotSongsDO)
        } catch(err) {
            console.log(err)
        }
    }
    //Then refresh the urls for all the ids in the playlist
    playlist = await refreshPlaylistUrls(playlist)
    //Save the playlist to db with [{id:,url:}]
    return playlist
}

async function getNextSong(id) {
    var song = undefined
    var playlist = dao.getPlaylist()
    if(playlist.length > 0) song = playlist[0]
    for(var i=0;i<playlist.length;i++) {
        if(playlist[i].id == id) {
            song = playlist[i+1]
            break
        }
    }
    const url = await getSongUrl(playlist, i)
    return {url: url, id: id}
}

async function getSongUrl(playlist, i, callback) {

    try {
        const res = await req('GET', playlist[i].url, '')
        if(res && res.status != '200') {
            playlist = await refreshPlaylistUrls(playlist)
        }
        return playlist[i]
    } catch(error) {
        console.log(error)
        return undefined
    }

}

//refresh all the urls or add urls for the playlist and change the value of playlist, then save the playlist to DB
async function refreshPlaylistUrls(playlist) {
    var command = '/song/url?id='
    for(var i=0;i<playlist.length;i++) {
        command += playlist[i].id + ','
    }
    command = command.substr(0, command.length-1)
    url = host + command

    const res = await req('GET', url, '')
    let data = process(res.body)
    addPlaylist(data.data)

    return data.data

}
//Parse the response body into hostSongs.json format
function process(res) {
    var fileData = {}
    var data = [];
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
    return url
}


module.exports = {
    getHotSongs: getHotSongs,
    getNextSong: getNextSong
}