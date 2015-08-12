////////////////////////////////////////////////////////////////////////////////
// Testing Suite for the Sensor Data DB Model
////////////////////////////////////////////////////////////////////////////////

var config = require ('./config.json');
var data_fixtures = require('../fixtures/data.js');
var sensor_fixtures = require('../fixtures/sensor.js');
var cloudprovider_fixtures = require('../fixtures/cloudprovider.js');

// Load the export and should testing styles
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

// Connect to the MongoDB
var mongoose = require('mongoose');
var sensorSchema = require('../schema/sensorSchema.js');
var actuatorSchema = require('../schema/actuatorSchema.js');
var cloudproviderSchema = require('../schema/cloudproviderSchema.js');
var Sensor = mongoose.model('Sensor', sensorSchema);
var Actuator = mongoose.model('Actuator', actuatorSchema);
var CloudProvider = mongoose.model('CloudProvider', cloudproviderSchema);

mongoose.connect(config.mongodb);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    //   console.log("Connection to MongoDB successful");
});
