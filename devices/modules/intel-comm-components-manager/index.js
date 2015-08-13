//Manager for the individual components that may interface with
//commercial IoT projects.

//As of 7-30-15, we're opting to use UPM for sensors.
var upm = require('jsupm_grove');
var loudness = require('jsupm_groveloudness');
//However, due to the nature of the relays, relays still require
//a separate API

//This function returns the UPM component for a sensor, or the API components
//for an actuator.
exports.getComponent = function getComponent(name, pin)
{
    var returnedComponent = {};

    //As of 7-30, the configurations for each sensor have a general ID.  The ID is just a number.
    //ID corresponds to a particular sensor, so it is NOT unique, but differentiates between temperature
    //and sound sensors, for example.

    //Now we perform a switch statement on the generalID that we used.
    if (name == "temperature") {
        returnedComponent = new upm.GroveTemp(+pin);
    } else if (name == "light") {
        returnedComponent = new upm.GroveLight(+pin);
    } else if (name == "sound") {
        returnedComponent = new loudness.GroveLoudness(+pin);
    }

    //Note that it's not required that returnedComponent is assigned to anything, so it could be NULL in some
    //situations.

    return returnedComponent;
};
