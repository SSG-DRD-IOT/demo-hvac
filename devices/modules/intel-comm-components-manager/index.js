//Manager for the individual components that may interface with
//commercial IoT projects.

//As of 7-30-15, we're opting to use UPM for sensors.
var upm = require('jsupm_grove');

//However, due to the nature of the relays, relays still require
//a separate API
var relay = require('intel-comm-components-relay')

//This function returns the UPM component for a sensor, or the API components
//for an actuator.  
exports.getComponent = function getComponent(name, pin)
{
  var returnedComponent = {};
  
  //Note: the below is bad practice, and will be changed eventually.
  if (name === "light")
  {
    returnedComponent = new groveSensor.GroveLight(+pin);
  }
  if (name === "sound")
  {
    returnedComponent = new loudnessSensor.GroveLoudness(+pin);
  }
  if (name === "temperature")
  {
    returnedComponent = new groveSensor.GroveTemp(+pin);
  }
  if (name === "relay")
  {
    returnedComponent = relay;
  }
  
  //Note that it's not required that returnedComponent is assigned to anything, so it could be NULL in some
  //situations.
  
  return returnedComponent;
}

exports.returnType = function returnTypeOfDevice(name) {
    var configs = require('./'+name+'.json');
    return configs.type;
};

exports.returnIO = function getIoOfDevice(name) {
    var configs = require('./'+name+'.json');
    return configs.io;
}