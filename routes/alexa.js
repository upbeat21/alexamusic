var express = require('express');
var app = express();
var router = express.Router();
var request = require('request')



/* GET home page. */
router.post('/', function(req, res, next) {
    var response = {};
    if(req.body.payload.content.invocationRequest.body.request.type === 'LaunchRequest') {
        response.response = {};
        response.response.outputSpeech = {};
        response.response.outputSpeech.text = 'Welcome to Anna Music'
    }
    res.writeHead(200,
        {"Content-Type" : "text/plain"});
    res.end(JSON.stringify(response));
});

module.exports = router;