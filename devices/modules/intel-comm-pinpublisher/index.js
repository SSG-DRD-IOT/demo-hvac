//// Sensor Code \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//// Automated workflow for a sensor based on configuration file \\\\\\\\\\\\\\\

//If we're in debug mode, allow for the temperature values to be changed
//via a potentiometer.
var debug = true;

//We're also going to use a configuration file - for the time being, we're
//bypassing gateway-discovery and intel-iot-commercial-edge-devices.
var config = {};
try {
    //config = require(process.argv[2]);
    config = require('./config.json');
} catch(e) {
    //If there's no configuration file there, say so!
    console.log("No configuration file found");
    process.exit();
};

//If we're debugging, require information for the potentiometer.
if (debug == true)
{
  var upm_grove = require('jsupm_grove');
  //If we're debugging this code, we're going to be using a potentiometer.
  //It must be on A3.
  var groveRotary = new upm_grove.GroveRotary(3);
}

//Now for our normal requirements!
var componentManager = require('intel-comm-components-manager'); // edge devices
var transportManager = require('intel-comm-transport-manager'); // transport
var winston = require('winston'); // Allows for async logging.

//This JSON is automatically imported as a JSON object, so it does not
//need to be parsed!
var gatewayIp = {};
var client = {};

//Now we can define a loop we'll be using later:
function loop ()
{
    var loopnum = 0; //Debugging.  Every time the loop restarts, the loopnum goes to 0.
    var interval = config.frequency * 1000; //Get our frequency, from config.
    //Defined in seconds.
    var component = componentManager.getComponent(config.name, config.pin);
    setInterval(function () //Start our loop....
                {
                    winston.log('debug','Loop began.'); //Loop is beginning its work.
                    //Get a reading (UPM style)
                    var data = component.value();
                    if (debug === true)
                    {
                      var numericValue = +data;
                      var rel = +groveRotary.rel_value() * 0.05;
                      var data = numericValue + rel;
                    }
                    winston.log('debug','Data was read from a pin: ' + data);

                    //Send a reading
                    transportManager.publishData(client, data, config);

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
