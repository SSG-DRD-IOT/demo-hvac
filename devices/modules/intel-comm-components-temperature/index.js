//Temperature Sensor\\

//Requirements\\
var mraa = require('mraa'); // Required for the sensor data reading
var winston = require('winston'); // Data logging

//Transformation variables
var B = 3975; // Required for data transformations

function getRawAioDataTemp(pin)
{
  console.log(pin);
  var analogPin = new mraa.Aio(+pin);
  var a = analogPin.read();  //Read the data coming in from the temperature sensor
  return a;
};

exports.readData = function getTempReading(pin)
{
  var a = getRawAioDataTemp(pin);
  var resistance = (1023 - a) * 10000 / a;  //Obtain the resistance of the sensor
  var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15; //convert to temperature via datasheet

  //Convert this temperature to farenheit
  var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;

  //Output the temperature after it has been obtained/transformed
  fahrenheit_temperature = fahrenheit_temperature.toFixed(2);
  return fahrenheit_temperature;
  //}
};

exports.returnType = function returnTypeOfDevice() {
    var configs = require('./temperature.json');
    return configs.type;
};

exports.returnIO = function getIoOfDevice() {
    var configs = require('./temperature.json');
    return configs.io;
}
