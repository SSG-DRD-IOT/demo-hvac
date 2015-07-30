//Sound Sensor\\

//Requirements\\
var mraa = require('mraa'); // Required for the sensor data reading
var winston = require('winston');

//Return raw data from a given pin
exports.readData = function getRawAioDataSound(pin)
{
  console.log(pin);
  var analogPin = new mraa.Aio(+pin);
  var a = analogPin.read();  //Read the data coming in from the temperature sensor
  return a;
};

exports.returnType = function returnTypeOfDevice() {
    var configs = require('./sound.json');
    return configs.type;
};

exports.returnIO = function getIoOfDevice() {
    var configs = require('./sound.json');
    return configs.io;
}