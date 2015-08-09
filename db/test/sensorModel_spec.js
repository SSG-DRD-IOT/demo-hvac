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
var cloudproviderSchema = require('../schema/cloudproviderSchema.js');
var Sensor = mongoose.model('Sensor', sensorSchema);
var CloudProvider = mongoose.model('CloudProvider', cloudproviderSchema);

mongoose.connect(config.mongodb);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    //   console.log("Connection to MongoDB successful");
});


describe("When a sensor is saved", function() {
    describe("with valid data", function() {

        before (function() {
            Sensor.remove({}, function() {
                console.log("Sensors cleared");
            });
        });

        it("should be successful", function(done) {
            var sensor = new Sensor(sensor_fixtures.valid_sensor_1);
            sensor.save(function(err, sensor) {
                try {
                    Sensor.find({}, function(err, sensors) {
                        expect(err).to.be.null;
                        sensors.length.should.equal(1);
                    });
                    done();
                } catch( err ) {
                    done( err );
                }
            });
        });

        it("there should be 1 sensor", function(done) {
            var sensor = new Sensor(sensor_fixtures.valid_sensor_1);
            sensor.save(function(err, sensor) {
                try {
                    Sensor.find({}, function(err, sensors) {
                        expect(err).to.be.null;
                        sensors.length.should.equal(1);
                    });
                    done();
                } catch( err ) {
                    done( err );
                }
                var num = Sensor.count();
                expect(num).to.be.equal(1);
            });
        });

    });
});

describe("When a sensor finds its data", function() {
    it("should return a piece of data and a timestamp", function() {
        Sensor.findData(function(data) {

        });
    });
});

describe("When a sensor is associated with a cloud provider", function() {
    describe("with valid data", function() {

        before(function() {
            Sensor.remove({}, function(err) {if (err) console.log(err);});
            CloudProvider.remove({}, function(err) {if (err) console.log(err);});
        });

        it("should be successful", function(done) {
            var sensor = new Sensor(sensor_fixtures.valid_sensor_1);

            sensor.cloudproviders.push(cloudprovider_fixtures.microsoft);
            sensor.save(function(err, sensor) {
                try {
                    Sensor.find({}, function(err, sensors) {
                        if (err) console.log(err);
                        expect(err).to.be.empty;
                        sensors.length.should.equal(1);
                    });
                    Sensor.findOne({}, function(s) {
                        expect(s.cloudproviders).length.should.equal(1);
                    });
                    done();
                } catch( err ) {
                    done( err );
                }
            });
        });


        it("there should be one cloudprovider stored with the sensor", function(done) {
            var sensor = new Sensor(sensor_fixtures.valid_sensor_1);

            sensor.cloudproviders.push(cloudprovider_fixtures.microsoft);
            sensor.save(function(err, sensor) {
                try {
                    Sensor.find({}, function(err, sensors) {
                        if (err) console.log(err);
                        expect(err).to.be.empty;
                        sensors.length.should.equal(1);
                    });
                    Sensor.findOne({}, function(s) {
                        expect(s.cloudproviders).length.should.equal(1);
                    });
                    done();
                } catch( err ) {
                    done( err );
                }
            });
        });

    });
});



// describe("When a sensor is associated with a cloud", function() {
// });
