//Light Sensor\\

//Requirements\\
var mraa = require('mraa'); // Required for the sensor data reading
var winston = require('winston');

exports.readData = function getRawAioDataLight(pin)
{
  console.log(pin);
  var analogPin = new mraa.Aio(+pin);
  var a = analogPin.read();  //Read the data coming in from the temperature sensor
  return a;
};

exports.returnType = function returnTypeOfDevice() {
    var configs = require('./light.json');
    return configs.type;
};

exports.returnIO = function getIoOfDevice() {
    var configs = require('./light.json');
    return configs.io;
}