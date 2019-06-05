var request = require('request')
var dao = require('../db/dao.js')

var host = 'https://musichihi.azurewebsites.net';

function getHotSongs(type, callback) {
    var command = '/top/song?type=';
    var typeList = [0,7,8,16,96];
    if(typeList.indexOf(type) >= 0) command += type;
    else command += 0;
    var url = host + command;
    request(url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
        var res = JSON.parse(body);
        var data = processHotSongsResponse(res);
        dao.saveHotSongs(data)

        //get url for music id
        command = '/song/url?id='
        command += res.data[0].id;
        url = host + command;
        request(url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
            var res = JSON.parse(body)
            var url = getUrl(res.data[0].url)
            callback(url)
        });
    });
}

function processHotSongsResponse(body) {
    var data = [];
    console.log(Object.keys(body))
    for(var i=0;i<body.data.length;i++) {
        data[i] = {}
        data[i].id = body.data[i].id;
    }
    return data;
}

function getUrl(url) {
    url = url.replace('http', 'https')
    url = url.replace(/(m\d+?)(?!c)\.music\.126\.net/, '$1c.music.126.net')
    console.log(url)
    return url
}


module.exports = {
    getHotSongs: getHotSongs
}