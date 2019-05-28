var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    httpProxy = require('http-proxy');

var isHttps = true; // do you want a https proxy?

var options = {
    https: {
        key: fs.readFileSync('./key.pem', 'utf8'),
        cert: fs.readFileSync('./server.crt', 'utf8')
    }
};

// this is the target server
var proxy = new httpProxy.createProxyServer({
    target:
        '127.0.0.1:8080'

});

if (isHttps)
    https.createServer(options.https, function(req, res) {
        console.log('Proxying https request at %s', new Date());
        proxy.proxyRequest(req, res);
    }).listen(443, function(err) {
        if (err)
            console.log('Error serving https proxy request: %s', req);

        console.log('Created https proxy. Forwarding requests from %s to %s:%s', '443', proxy.target.host, proxy.target.port);
    });
else
    http.createServer(options.https, function(req, res) {
        console.log('Proxying http request at %s', new Date());
        console.log(req);
        proxy.proxyRequest(req, res);
    }).listen(80, function(err) {
        if (err)
            console.log('Error serving http proxy request: %s', req);

        console.log('Created http proxy. Forwarding requests from %s to %s:%s', '80', proxy.target.host, proxy.target.port);
    });