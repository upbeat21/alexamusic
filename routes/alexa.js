var express = require('express');
var app = express();
var router = express.Router();
var request = require('request')
var data = require('./res.json')
var service = require('./service.js')



/* GET home page. */
router.post('/', (async function(req, res, next) {
    var response = {
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: ''
            },
            card: {
                type: "Simple",
                title: "Keyhole Software",
                content: "Getting User Blog Info"
            },
            shouldEndSession: false
        }
    };
    if(req.body.request.type === 'LaunchRequest') {
        response.response.outputSpeech.text = 'Welcome to Pipa Music, what are you up to today?'
    } else if(req.body.request.type === 'IntentRequest') {
        if(req.body.request.intent.name === 'PlayHotSongsIntent') {
            response.response.shouldEndSession = true

            let playlist = await service.getHotSongs(0)

            var directives = [
                {
                    type: "AudioPlayer.Play",
                    playBehavior: "REPLACE_ALL",
                    audioItem: {
                        stream: {
                            token: playlist[0].id,
                            url: playlist[0].url,
                            offsetInMilliseconds: 0
                        }
                    }
                }
            ]
            response.response.directives = directives;
            response.response.outputSpeech.text = "Now playing hot songs " + playlist[0].id
            response.response.card.title = playlist[0].id
            response.response.card.content = playlist[0].url
        } /*else if(req.body.request.intent.name = 'AMAZON.PauseIntent') {
            var directives = [
                {
                    type: 'AudioPlayer.Stop'
                }
            ]
            response.response.directives = directives
            response.response.shouldEndSession = true
        } else if(req.body.request.intent.name = 'AMAZON.ResumeIntent') {

        }

    }*/ else if(req.body.request.type === 'AudioPlayer.PlaybackNearlyFinished') {
        var id = req.body.request.token;
        var song = await service.getNextSong(id)
        response.response.outputSpeech = undefined
        response.response.card = undefined
        response.response.shouldEndSession = true
        var directives = [
            {
                type: "AudioPlayer.Play",
                playBehavior: "ENQUEUE",
                audioItem: {
                    stream: {
                        token: song.id,
                        url: song.url,
                        offsetInMilliseconds: 0,
                        expectedPreviousToken: id
                    }
                }
            }
        ]
        response.response.directives = directives;
    } else if(req.body.request.type === 'AudioPlayer.PlaybackPaused') {
        var directives = [
            {
                type: 'AudioPlayer.Stop'
            }
        ]
        response.response.directives = directives
        response.response.shouldEndSession = true
    } else {
        res.writeHead(200, {"Content-Type" : "text/plain"})
        res.end()
        return
    }
    res.writeHead(200,
        {"Content-Type" : "text/plain"});
    res.end(JSON.stringify(response));

}));

module.exports = router;