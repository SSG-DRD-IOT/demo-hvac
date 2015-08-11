var configFile = require('./relay.json');
var logger = require('./logger.js');

var transportManager = require('intel-comm-transport-manager');

var deviceAnnouncer = function ( configarg ) {

    module.config = configarg;
    this.announce = function () {
        var client = transportManager.connectToTransport(module.config.gateway.hostname, module.config);

        // Announce our presence to the Gateway
        transportManager.announcePresence(client, module.config);
    };

    this.start = function(cb) {
        cb();
    };
};

module.exports = deviceAnnouncer;

var announcer = new deviceAnnouncer(configFile);
announcer.announce();

announcer.start(function() {
    var cp = require("child_process");

//    cp.exec("cd ../../actuator/relay");
    cp.exec("swagger project start");

    var exec = require('child_process').exec;
    var swaggerProcess = exec('swagger project start swagger-relay');

    swaggerProcess.stdout.on('data', function(data) {
        console.log(data);
    });
});
