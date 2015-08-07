'use strict';
var util = require('util');
var mraa = require('mraa');

var led = new mraa.Gpio(13); 
led.dir(mraa.DIR_OUT);
var deviceId = "abc";

module.exports = {
  relay: relay
};

function relay(req, res) {
   
  var requestedDeviceId = req.swagger.params.deviceId.value;
  var requestedAction = req.swagger.params.action.value;
	if (requestedDeviceId  === deviceId  ){
      if (requestedAction === "on"){
        led.write(1);
         res.json("Success");
      }
      if (requestedAction === "off"){
        led.write(0);
         res.json("Success");
      }
		   res.json("Action Undefined");
	}
  res.json("Device Id is not found");
}
