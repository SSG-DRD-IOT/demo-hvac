//// Transport and Networking Code \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//// Includes: deviceIDs, connections, disconnections, publish and subscribe \\\

//Requirements
var crypto = require('crypto');
var winston = require('winston');
var mqtt = require('intel-comm-transport-mqtt')
var configFile = require('../../config.json');

/////Get the transport protocol.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function getTransportProtocol (configFile) {
  var transportProtocol = configFile.transport;
  return transportProtocol;
}

/////Hash a device ID for the Edison.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//Code Resource: http://stackoverflow.com/questions/5878682/node-js-hash-string
function returnDeviceID(configFile)
{
  return crypto.createHash('md5').update(configFile.description).digest('hex');
}

/////Connect to a transport protocol.  Returns a client, or other file needed by
/////chosen transportation protocol. \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
exports.connectToTransport = function connectToTransport(gatewayIP)
{
  var deviceID = returnDeviceID(configFile);
  var transportProtocol = getTransportProtocol(configFile);

  var client;

  if (transportProtocol === "mqtt")
  {
    console.log(gatewayIP);
    client  = mqtt.connectClient(gatewayIP);
    winston.info('Connected to: ' + gatewayIP );
  }
  else
  {
    //this shouldn't happen yet
    winston.info('Error: unsupported transport protocol called.');
    client = NULL;
  }
  return client;
}

/////Publish an announcement to gateway announcement topic. \\\\\\\\\\\\\\\\\\\\
exports.announcePresence = function announcePresence(client)
{

  var deviceID = returnDeviceID(configFile);
  var transportProtocol = getTransportProtocol(configFile);

  //For this, we also need to differentiate between actuators and sensors.
  //The type field tells us if we're dealing with a sensor or an actuator.  So
  //use configFile.type below.

  if (transportProtocol === "mqtt")
  {
    if (configFile.type === "sensor")
    {
      var announceJSON = { id: deviceID, name: configFile.name, description: configFile.description, verification_sensor: configFile.verification_sensor, maxfrequency: configFile.frequency, frequency: configFile.frequency, active: true, ioType: configFile.io };
      var pubString = JSON.stringify(announceJSON);
      winston.info('Announcement sent: ' + pubString);
      mqtt.publishAnnouncement(pubString, client);
    }
    else if (configFile.type === "actuator")
    {
		var announceJSON = { id: deviceID, name: configFile.name, description: configFile.description, api: configFile.api, pin: configFile.pin, active: true, ioType: configFile.ioType };
		console.log(announceJSON);
		var pubString = JSON.stringify(announceJSON);
		winston.info('Announcement sent: ' + pubString);
        mqtt.publishAnnouncement(pubString,client);
    }
    else
    {
      //This shouldn't happen yet.
      winston.info('Error: unsupported device in use.');
    }
    //The announcements channel on the gateway does not differentiate itself
    //with a device ID of any sort (gateway or sensor).
  }

}

/////Publish data to device data topic. Called from sensors. \\\\\\\\\\\\\\\\\\\
//Note: this only publishes one instance of data.  Needs to be called in a loop\
exports.publishData = function publishDataTopic(client, newData)
{
  var deviceID = returnDeviceID(configFile);
  var transportProtocol = getTransportProtocol(configFile);

  //For this, we also need to differentiate between actuators and sensors.
  //The type field tells us if we're dealing with a sensor or an actuator.  So
  //use configFile.type below.

  if (transportProtocol === "mqtt")
  {
    if (configFile.type === "sensor")
    {
      var dataJSON = { sensor_id: deviceID, value: newData, timestamp: Date.now() };
      var pubString = JSON.stringify(dataJSON);
      winston.info('Data sent: ' + pubString);
      mqtt.publishData(deviceID, client, pubString);
    }
    else if (configFile.type == "actuator")
    {
      //Not required at this time.
    }
    else
    {
      //We need to build support for this device type.

    }
    //The announcements channel on the gateway does not differentiate itself
    //with a device ID of any sort (gateway or sensor).
  }
}

/////Publish errors to device error topic. \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
exports.publishError = function publishErrorTopic(client, newError)
{
  var deviceID = returnDeviceID(configFile);
  var transportProtocol = getTransportProtocol(configFile);


  //The type field tells us if we're dealing with a sensor or an actuator.  So
  //use deviceInfo.type below.

  if (transportProtocol === "mqtt")
  {
    if (configFile.type === "sensor")
    {
      var pubString = { sensor_id: deviceID, error: newError, timestamp: Date.now() };
      mqtt.publishErrors(topicTitle, client);
    }
    else if (configFile.type == "actuator")
    {
      var pubString = { error: newData };
      mqtt.publishErrors(topicTitle, client);
    }
    else
    {
      //We need to build support for this device type.
    }
    //The announcements channel on the gateway does not differentiate itself
    //with a device ID of any sort (gateway or sensor).
  }
}

/////Subscribe to gateway's control topic. Called from actuators. \\\\\\\\\\\\\\
exports.subscribeControl = function subscribeControlTopic(client, configFile)
{
	var deviceID = returnDeviceID(configFile);
	var channelTitle = "actuator/" + deviceID + "/trigger";

	var transportProtocol = getTransportProtocol(configFile);
	 if (transportProtocol === "mqtt"){
		 if (configFile.type === "sensor")
		{
		// Not needed.
		}
		else if (configFile.type == "actuator")
		{
			mqtt.subscribeToControl(channelTitle,client);
		}
		else
		{
		//We need to build support for this device type.
		}
	}

	client.subscribe

}
