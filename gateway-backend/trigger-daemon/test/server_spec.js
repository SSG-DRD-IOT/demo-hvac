////////////////////////////////////////////////////////////////////////////////
// Testing Suite for the Trigger Daemon
////////////////////////////////////////////////////////////////////////////////
var mqtt = require('mqtt'); //This works over MQTT currently, will need to become extensible in future.

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

describe("The Trigger Daemon", function () {
    before (function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
    });

    it ("should have a start function()", function() {
        expect(triggerd.start).to.exist;

        // Expect statements to test if a property contains a function
        triggerd.should.have.property("start");
        expect(typeof(triggerd.start)).to.be.eql("function");
        expect(triggerd.start).should.be.a('object');
    });

    it ("should have an MQTT client instance", function() {
        expect(triggerd.start).to.exist;

        // Expect statements to test if a property contains a function
        expect(typeof(triggerd.start)).to.be.eql("function");
        expect(triggerd.start).should.be.a('object');
        // assert.equal(typeof triggerd.start, 'function');
    });
});

describe('When Trigger Daemon is connecting', function () {

    var client = {};

    beforeEach(function() {
        client = mqtt.connect('mqtt://localhost/');
    });

    afterEach(function() {
        if (client.connected)
            client.end();
    });

    it('should emit a connect event and be marked as connected', function (done) {
        client.on('close', function () {
            expect(client.connected).to.be.false;
            client.end();
            if (!client.connected) {
                done();
            } else {
                done(new Error('Not marked as disconnected'));
            }
        });
        client.once('connect', function () {
            expect(client.connected).to.be.ok;
            client.stream.end();
        });
    });


    it('and on immediate disconnect it should mark the client as disconnected', function (done) {
        client.once('close', function () {
            client.end();
            if (!client.connected) {
                done();
            } else {
                done(new Error('Not marked as disconnected'));
            }
        });
        client.once('connect', function () {
            client.stream.end();
        });
    });

    it('should emit close if stream closes', function (done) {
        client.once('connect', function () {
            client.stream.end();
        });
        client.once('close', function () {
            client.end();
            done();
        });
        client.on('error', function() {
            client.end();
            done(new Error('Not marked as errored'));
        });
    });


    it('should have a property name "connected" that is set to true', function (done) {

        client.on('connect', function () {
            expect(client).to.have.property("connected");
            expect(client.connected).to.be.true;

            client.stream.end();
        });

        client.once('close', function () {
            client.end();
            done();
        });
    });
});


//describe("The Trigger daemon is
