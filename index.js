var express = require('express');
var app = express();
var router = express.Router();
var alexaRouter = require('./routes/alexa');
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


/* GET home page. */
app.get('/', function(req, res, next) {
    res.writeHead(200,
        {"Content-Type" : "text/plain"});
    res.end("Hello World\n");
})
app.use('/alexa', alexaRouter);
var port = process.env.PORT || 3000

app.server = app.listen(port, function() {
    console.log('server running @ http://localhost:${port}')
})
module.exports = router;
