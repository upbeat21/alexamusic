var express = require('express');
var app = express();
var router = express.Router();
var request = require('request')
var data = require('./res.json')



/* GET home page. */
router.post('/', function(req, res, next) {
    var response = {
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: 'Welcome to Pipa Music, what are you up to today?'
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

    } else if(req.body.request.type === 'PlayHotSongsIntent') {
        response.response.shouldEndSession = true
        var directives = [
            {
                type: "AudioPlayer.Play",
                playBehavior: "REPLACE_ALL",
                audioItem: {
                    stream: {
                        token: "track2-long-audio",
                        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
                        offsetInMilliseconds: 0
                    }
                }
            }
        ]
        response.directives = directives;
    }
    res.writeHead(200,
        {"Content-Type" : "text/plain"});
    res.end(JSON.stringify(response));
});

module.exports = router;