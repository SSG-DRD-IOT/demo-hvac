//Module 1 - Temperature Sensor\\
//This application subscribe to one channel and wait for trigger from 
//gateway and change relay accordingly.

//Requirements\\
//var CommandLine=require("node-commandline").CommandLine;
var componentManager = require('intel-comm-components-manager');
var transportManager = require('intel-comm-transport-manager');
var winston = require('winston'); // Allows for async logging.

//Before we actually begin, we're also going to set up our logging to catch any
//bugs that may pop up.
winston.log('info', 'Informative logs set up.');

//We use our command line to pass in the gateway IP address.
var args = process.argv.slice(2);
var gateway = args[0];
var gatewayIP = "mqtt://"+gateway;

//Step One: Get your configuration information.
var moduleData = require('./config.json');
//This JSON is automatically imported as a JSON object, so it does not
//need to be parsed!

///Step Two: Get our component.
var component = componentManager.getComponent(moduleData.name);

//Step Three: Make our connection.
console.log(moduleData);
var client = transportManager.connectToTransport(gatewayIP, moduleData);
winston.info('Transport manager connected.');

//Step Three: Announce our presence.  At this point, we need to
//tell the gateway this Edison is functional. (Required date is User-defined Json + Api Json)
//var component = componentManager.getComponent(moduleData.name); // Get the name of module
var apiData = component.getApi(); // Get the Api data from the module
var moduleandApiData = mergeJson(moduleData,apiData); // We need user defined json file (module.json) and preloaded api json of component(api.json) in announcement.
console.log(moduleandApiData);
transportManager.announcePresence(client, component ,moduleandApiData);

//Step Four: Start subscribing your data! 
component.initializePin(moduleData.pin) // Just Initialize the pin number
transportManager.subscribeControl (client,component,moduleandApiData); // Subscribe to that channel
client.on('message',function(topic,message){ // On message receive, pass that message to component api so required action can be taken.
	var obj = JSON.parse(message);		
	console.log(message);
    component.action(moduleandApiData.pin,obj.triggerFunc)

});



// Method to merge two json files. 
function mergeJson(json1,json2){
	var finalJson = {};
	for(var _obj in json1) finalJson[_obj ]=json1[_obj];
    for(var _obj in json2) finalJson[_obj ]=json2[_obj];
	return finalJson;
}