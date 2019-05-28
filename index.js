var express = require('express');
var app = express();
var router = express.Router();

/* GET home page. */
app.get('/', function(req, res, next) {
    res.writeHead(200,
        {"Content-Type" : "text/plain"});
    res.end("Hello World\n");
})
var port = process.env.PORT || 3000

app.server = app.listen(port, function() {
    console.log('server running @ http://localhost:${port}')
})
module.exports = router;
