////////////////////////////////////////////////////////////////////////////////
// Testing Suite for the Sensor Data DB Model
////////////////////////////////////////////////////////////////////////////////
//var config = require ('./config.json');
var data_fixtures = require('./fixtures/data.js');
var sensor_fixtures = require('./fixtures/sensor.js');
//var cloudprovider_fixtures = require('../fixtures/cloudprovider.js');

// Load the export and should testing styles
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

var server_utils = require('../server.js');
// Connect to the MongoDB
//var mongoose = require('mongoose');
//var sensorSchema = require('../schema/sensorSchema.js');
//var cloudproviderSchema = require('../schema/cloudproviderSchema.js');
//var Sensor = mongoose.model('Sensor', sensorSchema);
//var CloudProvider = mongoose.model('CloudProvider', cloudproviderSchema);

// mongoose.connect(config.mongodb);
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//     //   console.log("Connection to MongoDB successful");
// });

describe("When passing Data Readings to getSensorIDs()", function() {
    it("a list of all sensor ids should be returned", function(done) {
        var sensor_ids = server_utils.getSensorIDs(data_fixtures);
        expect(sensor_ids).to.be.eql(['1','2']);
        done();
    });
});

describe("When calling groupByCloudProvider() with an array of data", function() {
    it("should return a list of data grouped by their cloud provider", function() {
       // var data_by_cloudprovider =

        done();
    });

});