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
};

module.exports = deviceAnnouncer;

var announcer = new deviceAnnouncer(configFile);
announcer.announce();
