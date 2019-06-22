const express = require('express');
const app = express();
const router = express.Router();
const request = require('request')
const data = require('./res.json')
const service = require('./service.js')
const mapper = require('../utils/mapper.js')


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
        if(req.body.request.intent.name === 'PlayNewSongsIntent') {
            response.response.shouldEndSession = true
            let songType
            if(req.body.request.intent.slots != undefined)
                songType = req.body.request.intent.slots.type.value
            else songType = 'all'
            let playlist = await service.getNewSongs(songType)

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
            response.response.outputSpeech.text = "Now playing new songs " + playlist[0].id
            response.response.card.title = playlist[0].id
            response.response.card.content = playlist[0].url
        } else if(req.body.request.intent.name === 'PlayArtistSongIntent') {
            let artistName = req.body.request.intent.slots.artist.value
            let playlist = await service.getSongsOfArtist(artistName)
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
            response.response.outputSpeech.text = "Now playing new songs " + playlist[0].id
            response.response.card.title = playlist[0].id
            response.response.card.content = playlist[0].url
        } else if(req.body.request.intent.name === 'AMAZON.PauseIntent') {
            var directives = [
                {
                    type: 'AudioPlayer.Stop'
                }
            ]
            response.response.directives = directives
            response.response.shouldEndSession = true
        } else if(req.body.request.intent.name === 'AMAZON.ResumeIntent') {
            const song = await service.getPausedSong()
            var directives = [
                {
                    type: "AudioPlayer.Play",
                    playBehavior: "REPLACE_ALL",
                    audioItem: {
                        stream: {
                            token: song.id,
                            url: song.url,
                            offsetInMilliseconds: song.offsetInMilliseconds
                        }
                    }
                }
            ]
            response.response.directives = directives;
            response.response.outputSpeech.text = undefined
            response.response.card.title = song.id
            response.response.card.content = song.url
            response.response.shouldEndSession = true
        }

    } else if(req.body.request.type === 'AudioPlayer.PlaybackNearlyFinished') {
        var id = req.body.request.token;
        //Get next song from playlist
        var song = await service.getSongFromPlaylist(id, 1, 0)
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
    } else if(req.body.request.type === 'AudioPlayer.PlaybackStopped') {
        response = undefined
        service.savePausedSong(req.body.request.token, req.body.request.offsetInMilliseconds)
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