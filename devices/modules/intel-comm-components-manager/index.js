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
  
  //As of 7-30, the configurations for each sensor have a general ID.  The ID is just a number.  
  //ID corresponds to a particular sensor, so it is NOT unique, but differentiates between temperature
  //and sound sensors, for example.
  var configs = require('./'+name+'.json');
  var generalID = configs.genid;
  
  //Now we perform a switch statement on the generalID that we used.
  switch (+generalID) {
      case 0:
           returnedComponent = new upm.GroveTemp(+pin);
          break;
      case 1:
          returnedComponent = new upm.GroveLight(+pin);
          break;
      case 2:
          returnedComponent = new upm.GroveLoudness(+pin);
          break;
      case 3:
          returnedComponent = relay;
          break;
      default:
          returnedComponent = NULL;
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