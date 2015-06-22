var mongoose = require('mongoose');
var SensorSchema = require('sensor-schema.js');

var Sensor = mongoose.model('Sensor', SensorSchema);

modules.exports = Sensor;
