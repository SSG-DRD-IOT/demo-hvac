/////////////////////The Main File for Edge Devices\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////This file kicks off all of the other scripts in the setup and brings together
////the configuration files for a particular set up.

////In short, this begins the gateway script, which is required for this file to
////run (and only the gateway script)
var gateway = require('intel-comm-gateway-discovery');

////Note that for a gateway, we need to know what hostname we're looking for,
////which is going to be stored in the gateway.json file.
var gatewayconfig = require('./gateway.json');

//Now we can just start the gateway discovery scripts!
gateway.startGatewaySearch(gatewayconfig.host);
