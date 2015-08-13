var http = require('http');
var options = {
            hostname: "localhost"
            ,port: 4000
            ,path: '/api/v0001/azure/historic/data?id=temperature'
            ,method: 'GET'
        };

var req = http.get(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
        res.on('data', function(chunk) {
           console.log('BODY: ' + chunk);
        });
});

        req.on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });
