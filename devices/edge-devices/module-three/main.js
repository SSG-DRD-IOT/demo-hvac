//Module 1 - Temperature Sensor\\
//This application only reads data from the temperature sensor, and
//sends it at the appropriate frequency to the gateway.

//Requirements\\
var componentManager = require('intel-comm-components-manager'); // edge devices
var transportManager = require('intel-comm-transport-manager'); // transport
var winston = require('winston'); // Allows for async logging.

//Before we actually begin, we're also going to set up our logging to catch any
//bugs that may pop up.
winston.log('info', 'Informative logs set up.');

//We use our command line to pass in the gateway IP address.
var args = process.argv.slice(2);
var gateway = args[0];
var gatewayIP = "mqtt://"+gateway;

////////////// Now we can begin the module code! ///////////////////////////////

//Step One: Get your configuration information.
var moduleData = require('./config.json');
//This JSON is automatically imported as a JSON object, so it does not
//need to be parsed!

//Step Two: Get our component.
var component = componentManager.getComponent(moduleData.name);

//Step Three: Make our connection.
var client = transportManager.connectToTransport(gatewayIP, moduleData);
winston.info('Transport manager connected.');

//Step Three: Get our component.
var component = componentManager.getComponent(moduleData.name);

//Step Four: Define our loop:

function loop () {
  //Does nothing...for now
  var loopnum = 0; //Debugging.  Every time the loop restarts, the loopnum goes to 0.
  var interval = moduleData.frequency * 1000; //Get our frequency, from config.
                                              //Defined in seconds.
  setInterval(function () //Start our loop....
                {
                    winston.info('Loop began.'); //Loop is beginning its work.
                    //Get a reading, send a reading!
                    var data = component.readData(moduleData.pin);
                    winston.info('Data was read from a pin: ' + data);
                    transportManager.publishData(client, component, moduleData, data);
                    loopnum = loopnum+1;
                    winston.info('Data has been published to the server ' + loopnum + " times.");
                }, interval);  //Once a [interval]!
};

//Step Five: Announce our presence.  At this point, we need to
//tell the gateway this Edison is functional.
transportManager.announcePresence(client, component, moduleData);
winston.info('Hello!  I, Edison, have arrived to the announcement server.');

//Step Six: Start publishing your data!  We now run the loop we crafted
//earlier.
loop();
