////////////////////////////////////////////////////////////////////////////////
// Testing Suite for the Trigger Daemon
////////////////////////////////////////////////////////////////////////////////

var config = require ('./config.json');
var trigger_fixtures = require('./fixtures/triggers.js');
var config_fixtures =  require('./fixtures/configs.js');

// Load the export and should testing styles
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

// Connect to the MongoDB
var mongoose = require('mongoose');
var TriggerModel = require('intel-commerical-iot-database-models').TriggerModel;
var errorModel = require('intel-commerical-iot-database-models').ErrorModel;
var TriggerDaemon = require('../server.js');

mongoose.connect(config.mongodb.host);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    //   console.log("Connection to MongoDB successful");
});

describe("When instantiating the Trigger Daemon with no configuration file", function() {
    before (function () {
        triggerd = new TriggerDaemon();
    });

    it ("should exist", function() {
        expect(triggerd).to.be.ok;
    });

    it("there should be a property called config", function() {
        expect(triggerd.config).to.be.ok;
        expect(triggerd.hasOwnProperty('config')).to.be.true;
    });

    it("the default MQTT server should be mqtt://localhost", function () {
        expect(triggerd.config.mqtt.uri).to.exist;
    });

    it("the default MongoDB server URI should be mongodb://localhost/iotdemo", function () {
        expect(triggerd.config.mongodb.uri).to.exist;
    });

    it("the default log level should error", function () {
        expect(triggerd.config.debug.level).to.be.eql("error");
    });
});

describe("When instantiating the Trigger Daemon with a configuration file", function() {
    before (function () {
        triggerd = new TriggerDaemon(config_fixtures.config_1);
    });

    it ("should exist", function() {
        expect(triggerd).to.be.ok;
    });

    it("there should be a property called config", function() {
        expect(triggerd.config).to.be.ok;
        expect(triggerd.hasOwnProperty('config')).to.be.true;
    });

    it("the default MQTT server should be mqtt://localhost", function () {
        expect(triggerd.config.mqtt.uri).to.exist;
    });

    it("the default MongoDB server URI should be mongodb://localhost/iotdemo", function () {
        expect(triggerd.config.mongodb.uri).to.exist;
    });

    it("the default log level should error", function () {
        expect(triggerd.config.debug.level).to.be.eql("config_1");
    });
});

// describe("The Trigger daemon", function() {
//     var triggerd = new TriggerDaemon
//     before(function() {

//     });

//     it("should have a start() function", function() {

//     });
// });
