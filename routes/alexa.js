var express = require('express');
var app = express();
var router = express.Router();
var request = require('request')
var data = require('./res.json')
var service = require('./service.js')



/* GET home page. */
router.post('/', function(req, res, next) {
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
            shouldEndSession: false,
            type: '_DEFAULT_RESPONSE'
        }
    };
    if(req.body.request.type === 'LaunchRequest') {
        response.response.outputSpeech.text = 'Welcome to Pipa Music, what are you up to today?'
    } else if(req.body.request.type === 'IntentRequest') {
        if(req.body.request.intent.name === 'PlayHotSongsIntent') {
            response.response.outputSpeech.text = "Now playing hot songs!"
            response.response.shouldEndSession = true

            service.getHotSongs(0, false, function(song){
                console.log(JSON.stringify(song))
                var directives = [
                    {
                        type: "AudioPlayer.Play",
                        playBehavior: "REPLACE_ALL",
                        audioItem: {
                            stream: {
                                token: song.id,
                                url: song.url,
                                offsetInMilliseconds: 0
                            }
                        }
                    }
                ]
                response.response.directives = directives;
                res.writeHead(200,
                    {"Content-Type" : "text/plain"});
                res.end(JSON.stringify(response));
            })


        }

    } else if(req.body.request.type === 'AudioPlayer.PlaybackStarted') {
        var id = req.body.request.token;
        var song = service.getNextSong(id)
        response.response.outputSpeech.text = ""
        response.response.shouldEndSession = true
        var directives = [
            {
                type: "AudioPlayer.Play",
                playBehavior: "ENQUEUE",
                audioItem: {
                    stream: {
                        token: song.id,
                        url: song.url,
                        offsetInMilliseconds: 0
                    }
                }
            }
        ]
        response.response.directives = directives;
        res.writeHead(200,
            {"Content-Type" : "text/plain"});
        res.end(JSON.stringify(response));
    }

});

module.exports = router;