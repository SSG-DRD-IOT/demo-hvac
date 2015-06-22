var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Sensor Schema describes the immutable characteristics of a sensor
// Every sensor definition must have a json file that details these.
var sensorSchema = new Schema({

    // A unique identifier that allows the system to address a sensor
    deviceId: {type: String, required: true},

    // The name of the sensor. e.g. "Temperature Sensor"
    name: {type: String, required: true},

    // A helping hint on using the sensor
    description: {type: String, required: true},

    // Maximum rate at which updates can occur
    // Specified in milliseconds
    maxFrequency: {type: Number, required: true, default: 1000}

});
