//Manager for the individual components that may interface with
//commercial IoT projects.

//Components.  Add components here so the manager can deal with them.
var light = require('intel-comm-components-light');
var sound = require('intel-comm-components-sound');
var temperature = require('intel-comm-components-temperature');
var relay = require('intel-comm-components-relay');

//This code is passed the users' sensor name, and returns the
//appropriate sensor variable.

//Sensors all use the readData command.
//Actuators vary depending on their work.

exports.getComponent = function getComponent(name)
{
  var returnedComponent = {};
  if (name === "light")
  {
    returnedComponent = light;
  }
  if (name === "sound")
  {
    returnedComponent = sound;
  }
  if (name === "temperature")
  {
    returnedComponent = temperature;
  }
  if (name === "relay")
  {
    returnedComponent = relay;
  }
  //if (name === "rgblcd")
  //{
  //  returnedComponent = rgblcd;
  //}
  return returnedComponent;
}
