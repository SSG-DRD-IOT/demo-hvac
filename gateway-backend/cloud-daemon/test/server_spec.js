////////////////////////////////////////////////////////////////////////////////
// Testing Suite for the Sensor Data DB Model
////////////////////////////////////////////////////////////////////////////////
//var config = require ('./config.json');
//var data_fixtures = require('../fixtures/data.js');
//var sensor_fixtures = require('../fixtures/sensor.js');
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
    it("a list of all sensor ids should be return", function(done) {
        var data = [
            {
                sensor_id: '1',
                value: 74.54047151375562,
                timestamp: 'Mon Jul 27 2015 09:47:59 GMT-0700 (PDT)'
            },
            {
                sensor_id: '2',
                value: 74.54047151375562,
                timestamp: 'Mon Jul 27 2015 09:47:59 GMT-0700 (PDT)'
            },
            {
                sensor_id: '1',
                value: 74.54047151375562,
                timestamp: 'Mon Jul 27 2015 09:47:59 GMT-0700 (PDT)'
            }
        ];

        var sensor_ids = server_utils.getSensorIDs(data);
        expect(sensor_ids).to.be.eql(['1','2']);
        done();
    });
});
