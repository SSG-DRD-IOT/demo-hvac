//// Sensor Code \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//// Automated workflow for a sensor based on configuration file \\\\\\\\\\\\\\\
var config = {};
try {
    //config = require(process.argv[2]);
    config = require('./relay.json');
} catch(e) {
    console.log("No configuration file found");
    process.exit();
};

var transportManager = require('intel-comm-transport-manager'); // transport
var winston = require('winston'); // Allows for async logging.
//This JSON is automatically imported as a JSON object, so it does not
//need to be parsed!
var gatewayIp = {};
var client = {};

var pinsubscriber = function (configFile) {

    this.config = configFile;


};

module.exports = pinsubscriber;

//Now we can define a loop we'll be using later:
function loop () {

    var loopnum = 0; //Debugging.  Every time the loop restarts, the loopnum goes to 0.

    var interval = config.frequency * 1000; //Get our frequency, from config.
    //Defined in seconds.

    var component = componentManager.getComponent(config.name, config.pin);

    setInterval(function () //Start our loop....
                {
                    winston.log('debug','Loop began.'); //Loop is beginning its work.

                    //Get a reading (UPM style)
                    var data = component.value();
                    winston.log('debug','Data was read from a pin: ' + data);

                    //Send a reading
                    transportManager.publishData(client, data, config);

                    //Another loop completed!
                    loopnum = loopnum+1;
                    winston.log('debug','Data has been published to the server ' + loopnum + " times.");

                }, interval);  //Once a [interval]!
};

exports.publishDataLoop = function dataLoop(ip, config) {

    gatewayIp = ip;
    console.log("'" + gatewayIp + "'");

    //Before we actually begin, we're also going to set up our logging to catch any
    //bugs that may pop up.
    winston.log('info', 'Informative logs set up.');
    winston.level = 'debug';  //This allows our debug logs to print to console.
    winston.log('debug', 'Debug logs set up.');

    ////////////// Now we can begin the module code! ///////////////////////////////
    client = transportManager.connectToTransport(gatewayIp, config);

    //Announce our presence.  At this point, we need to
    //tell the gateway this Edison is functional.
    transportManager.announcePresence(client, config);
    winston.log('debug','Hello!  I, Edison, have arrived to the announcement server.');

    //Step Four: Start publishing your data!  We now run the loop we crafted
    //earlier.
    loop();
};


exports.publishDataLoop(config.gateway.hostname, config);
