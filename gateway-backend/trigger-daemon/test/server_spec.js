////////////////////////////////////////////////////////////////////////////////
// Testing Suite for the Trigger Daemon
////////////////////////////////////////////////////////////////////////////////
var _ = require('lodash');
var mqtt = require('mqtt');

var config = require ('./config.json');
var trigger_fixtures = require('./fixtures/triggers.js');
var config_fixtures =  require('./fixtures/configs.js');
var data_fixtures = require('./fixtures/data.js');

// Load the export and should testing styles
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

// Connect to the MongoDB
var mongoose = require('mongoose');
var Trigger = require('intel-commerical-iot-database-models').TriggerModel;
//var ErrorModel = require('intel-commerical-iot-database-models').ErrorModel;
var TriggerDaemon = require('../server.js');

mongoose.createConnection(config_fixtures.test_config.mongodb.uri);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to MongoDB successful");
});

describe("The Trigger Daemon", function () {
    before (function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
    });

    after(function() {
        triggerd.close();
    });

    it ("should have a start function()", function() {
        expect(triggerd.start).to.exist;

        // Expect statements to test if a property contains a function
        triggerd.should.have.property("start");
        expect(typeof(triggerd.start)).to.be.eql("function");
        expect(triggerd.start).should.be.a('object');
    });

    it ("should have an MQTT client instance", function() {
        // Expect statements to test if a property contains a function
        triggerd.should.have.property("mqttClient");
        expect(triggerd.mqttClient).should.be.a('object');
        // assert.equal(typeof triggerd.start, 'function');
    });

    it ("should have an MongoDB client instance", function() {
        // Expect statements to test if a property contains a function
        triggerd.should.have.property("mongodb_client");
        expect(triggerd.start).should.be.a('object');
        // assert.equal(typeof triggerd.start, 'function');
    });
});


describe("When instantiating the Trigger Daemon", function() {

    describe(" with no configuration file", function() {
        before (function () {
            triggerd.close();
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
            expect(triggerd.config.debug.level).to.be.eql("false");
        });

        it("there should be a function called processSensorData", function() {
            expect(triggerd.config).to.be.ok;
            expect(triggerd.hasOwnProperty('processSensorData')).to.be.true;
        });

        it("there should be a function called refreshTriggers", function() {
            expect(triggerd.config).to.be.ok;
            expect(triggerd.hasOwnProperty('refreshTriggers')).to.be.true;
        });

        it("there should be a function called processTriggers", function() {
            expect(triggerd.config).to.be.ok;
            expect(triggerd.hasOwnProperty('processTriggers')).to.be.true;
        });

    });

    describe("with a configuration file", function() {
        before (function () {
            triggerd.close();
            triggerd = new TriggerDaemon(config_fixtures.config_1);
        });

        after(function() {
            triggerd.close();
        });

        it ("should exist", function() {
            expect(triggerd).to.be.ok;
        });

        it("there should be a property called config", function() {
            expect(triggerd.config).to.be.ok;
            expect(triggerd.hasOwnProperty('config')).to.be.true;
        });

        it("the configuration file provided an MQTT server at mqtt://localhost", function () {
            expect(triggerd.config.mqtt.uri).to.exist;
        });

        it("the configuration file provided a MongoDB URI at mongodb://localhost/iotdemo", function () {
            expect(triggerd.config.mongodb.uri).to.exist;
        });

        it("the default log level should error", function () {
            expect(triggerd.config.debug.level).to.be.eql("config_1");
        });
    });
});


describe('When Trigger Daemon is connecting', function () {

    var client = {};
    describe('to an MQTT server', function () {

        describe("with valid login configurations", function() {
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
    });

    describe("to a MongoDB Server", function() {
        before (function () {
            triggerd = new TriggerDaemon(config_fixtures.test_config);
        });

        it("should connect successfully", function() {

        });
    });
});

describe("When a trigger is added", function() {
    beforeEach (function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
//        Trigger.remove({}, function(err) {
//            console.log("Removed all triggers");
//         });
    });

    afterEach(function() {
        triggerd.close();
    });


    it("should be added to a list of triggers", function() {
        var trigger = trigger_fixtures.valid_1;

        triggerd.addTrigger(trigger);
        expect(triggerd.triggers).to.exist;
        triggerd.triggers.length.should.be.equal(1);
    });
});

// describe("When sensor data is received", function() {
//     var temperature_reading;
//     var mqttTestClient;

//     before(function () {
//         temperature_reading = data_fixtures.temperature_greater_than_80;
//         mqttTestClient = mqtt.connect(config_fixtures.test_config.mqtt.uri);
//       });

//     describe("and there is a trigger with a condition that is true", function() {
//         it("the triggers condition should evaluate to true", function() {
//           mqttTestClient.publish('sensors/temperature/data', JSON.stringify(temperature_reading));


//         });
//     });

// });


describe("When a temperature sensor sends data", function() {
    var temperature_reading;
    var fan_on_trigger;
    var triggerd;

    before(function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
    });


    describe("and there is one trigger responding to that sensor", function() {
        before(function () {
            fan_on_trigger = trigger_fixtures.fan_on;
        });

        it("should be the only trigger evaluated", function() {
            triggerd.addTrigger(fan_on_trigger);

            _.filter(
                triggerd.triggers,
                {sensor_id : fan_on_trigger.sensor_id})
                .length.should.equal(1);

            triggerd
                .filter_triggers_by_sensor_id (
                    fan_on_trigger.sensor_id
                ).length.should.equal(1);

        });
    });
});

describe("When temp data > 27", function() {
    var triggerd;
    before(function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
    });

    describe("and trigger on temp > 27", function() {
        var temperature_data;
        var trigger;
        var mqttTestClient;

        beforeEach(function () {
            temperature_data = data_fixtures.temperature_greater_than_27;
            trigger = new Trigger(trigger_fixtures.temperature_greater_than_27);
            mqttTestClient = mqtt.connect(config_fixtures.test_config.mqtt.uri);
        });

        it("the trigger's condition should evaluate to true", function() {
            triggerd.addTrigger(trigger);   // Trigger Happy

            expect(triggerd
                   .filter_triggers_by_sensor_id(
                       trigger.sensor_id
                   )[0].eval_condition(this, temperature_data.value)).to.be.equal(true);
        });

        it("should send a MQTT alert", function(done) {
            mqttTestClient.on('connect', function() {
                mqttTestClient.subscribe('sensors/temperature_g27/alerts');
                triggerd.processSensorData(temperature_data);
            });


            mqttTestClient.on('message', function(topic, message) {
                var json;
                try {
                    json = JSON.parse(message);
                } catch(error) {
                    logger.error("Malformated JSON received: " + message);
                }

                if (topic.match(/sensors\/temperature_g27\/alert/)) {
                    expect(json).to.deep.equal(JSON.parse('{ "alert": "Hot" }'));
                    done();
                };
            });
        });
    });
});


describe("When temp data > 27", function() {
    var triggerd;
    before(function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
    });

    describe("and trigger on temp > 27 and the light is on", function() {
        var temperature_data;
        var trigger;
        var mqttTestClient;

        beforeEach(function () {
            temperature_data = data_fixtures.temperature_greater_than_27;
            light_on = data_fixtures.light_on;
            trigger = new Trigger(trigger_fixtures.temperature_greater_than_27_light_on);
            mqttTestClient = mqtt.connect(config_fixtures.test_config.mqtt.uri);
        });

        it("the trigger's condition should evaluate to true", function() {
            triggerd.addTrigger(trigger);   // Trigger Happy

            expect(triggerd
                   .filter_triggers_by_sensor_id(
                       trigger.sensor_id
                   )[0].eval_condition(this, temperature_data.value)).to.be.equal(true);
        });

        it("should send a MQTT error", function(done) {
            mqttTestClient.on('connect', function() {
                mqttTestClient.subscribe('sensors/temperature_g27_light_on/alerts');
                triggerd.processSensorData(light_on);
                triggerd.processSensorData(temperature_data);
            });


            mqttTestClient.on('message', function(topic, message) {
                var json;
                try {
                    json = JSON.parse(message);
                } catch(error) {
                    logger.error("Malformated JSON received: " + message);
                }

                if (topic.match(/sensors\/temperature_g27_light_on\/alert/)) {
                    expect(json).to.deep.equal(JSON.parse('{ "alert": "HotError" }'));
                    done();
                };
            });
        });

        it("should record an error in the database", function() {

        });

    });
});

describe("When temp data < 20", function() {
    var triggerd;
    before(function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
    });

    describe("and trigger on temp < 20 and the fan is on", function() {
        var temperature_data;
        var trigger;
        var mqttTestClient;

        beforeEach(function () {
            temperature_data = data_fixtures.temperature_less_than_20;
            fan_on = data_fixtures.fan_on;
            trigger = new Trigger(trigger_fixtures.temperature_less_than_20_fan_on);
            mqttTestClient = mqtt.connect(config_fixtures.test_config.mqtt.uri);
        });

        it("the trigger's condition should evaluate to true", function() {
            triggerd.addTrigger(trigger);   // Trigger Happy

            expect(triggerd
                   .filter_triggers_by_sensor_id(
                       trigger.sensor_id
                   )[0].eval_condition(this, temperature_data.value)).to.be.equal(true);
        });

        it("should send a MQTT error", function(done) {
            mqttTestClient.on('connect', function() {
                mqttTestClient.subscribe('sensors/temperature_l20_fan_on/alerts');
                triggerd.processSensorData(fan_on);
                triggerd.processSensorData(temperature_data);
            });


            mqttTestClient.on('message', function(topic, message) {
                var json;
                try {
                    json = JSON.parse(message);
                } catch(error) {
                    logger.error("Malformated JSON received: " + message);
                }

                if (topic.match(/sensors\/temperature_l20_fan_on\/alert/)) {
                    expect(json).to.deep.equal(JSON.parse('{ "alert": "ColdError" }'));
                    done();
                };
            });
        });
    });
});


describe("When temp data < 20", function() {
    var triggerd;
    before(function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
    });

    describe("and trigger on temp < 20", function() {
        var temperature_data;
        var trigger;
        var mqttTestClient;

        beforeEach(function () {
            temperature_data = data_fixtures.temperature_less_than_20;
            trigger = new Trigger(trigger_fixtures.temperature_less_than_20);
            mqttTestClient = mqtt.connect(config_fixtures.test_config.mqtt.uri);
        });

        it("the trigger's condition should evaluate to true", function() {
            triggerd.addTrigger(trigger);   // Trigger Happy

            expect(triggerd
                   .filter_triggers_by_sensor_id(
                       trigger.sensor_id
                   )[0].eval_condition(this, temperature_data.value)).to.be.equal(true);
        });

        it("should send a MQTT alert", function(done) {
            mqttTestClient.on('connect', function() {
                mqttTestClient.subscribe('sensors/temperature_l20/alerts');
//              mqttTestClient.publish('sensors/temperature/alerts','{"alert" : "Hot"}' );
              //  triggerd.addTrigger(trigger);   // Trigger Happy
//                mqttTestClient.publish('sensors/temperature/data', JSON.stringify(temperature_data));
                triggerd.processSensorData(temperature_data);
            });


            mqttTestClient.on('message', function(topic, message) {
                var json;
                try {
                    json = JSON.parse(message);
                } catch(error) {
                    logger.error("Malformated JSON received: " + message);
                }

                if (topic.match(/sensors\/temperature_l20\/alert/)) {
                    expect(json).to.deep.equal(JSON.parse('{ "alert": "Cold" }'));
                    done();
                };
            });
        });
    });
});



describe("When temp data <= 27", function() {
    var triggerd;
    before(function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
    });

    describe("and trigger on temp <= 27", function() {
        var temperature_data;
        var trigger;
        var mqttTestClient;

        beforeEach(function () {
            temperature_data = data_fixtures.temperature_less_than_or_equal_27;
            trigger = new Trigger(trigger_fixtures.temperature_less_than_or_equal_27);
            mqttTestClient = mqtt.connect(config_fixtures.test_config.mqtt.uri);
        });

        it("the trigger's condition should evaluate to true", function() {
            triggerd.addTrigger(trigger);   // Trigger Happy

            expect(triggerd
                   .filter_triggers_by_sensor_id(
                       trigger.sensor_id
                   )[0].eval_condition(this, temperature_data.value)).to.be.equal(true);
        });

        it("should send a MQTT alert", function(done) {
            mqttTestClient.on('connect', function() {
                mqttTestClient.subscribe('sensors/temperature_le27/alerts');
//              mqttTestClient.publish('sensors/temperature/alerts','{"alert" : "Hot"}' );
              //  triggerd.addTrigger(trigger);   // Trigger Happy
//                mqttTestClient.publish('sensors/temperature/data', JSON.stringify(temperature_data));
                triggerd.processSensorData(temperature_data);
            });


            mqttTestClient.on('message', function(topic, message) {
                var json;
                try {
                    json = JSON.parse(message);
                } catch(error) {
                    logger.error("Malformated JSON received: " + message);
                }

                if (topic.match(/sensors\/temperature_le27\/alert/)) {
                    expect(json).to.deep.equal(JSON.parse('{ "alert": "Ok" }'));
                    done();
                };
            });
        });
    });
});


describe("When temp data >= 20", function() {
    var triggerd;
    before(function () {
        triggerd = new TriggerDaemon(config_fixtures.test_config);
    });

    describe("and trigger on temp >= 20", function() {
        var temperature_data;
        var trigger;
        var mqttTestClient;

        beforeEach(function () {
            temperature_data = data_fixtures.temperature_greater_than_or_equal_20;
            trigger = new Trigger(trigger_fixtures.temperature_greater_than_or_equal_20);
            mqttTestClient = mqtt.connect(config_fixtures.test_config.mqtt.uri);
        });

        it("the trigger's condition should evaluate to true", function() {
            triggerd.addTrigger(trigger);   // Trigger Happy

            expect(triggerd
                   .filter_triggers_by_sensor_id(
                       trigger.sensor_id
                   )[0].eval_condition(this, temperature_data.value)).to.be.equal(true);
        });

        it("should send a MQTT alert", function(done) {
            mqttTestClient.on('connect', function() {
                mqttTestClient.subscribe('sensors/temperature_ge20/alerts');
//              mqttTestClient.publish('sensors/temperature/alerts','{"alert" : "Hot"}' );
              //  triggerd.addTrigger(trigger);   // Trigger Happy
//                mqttTestClient.publish('sensors/temperature/data', JSON.stringify(temperature_data));
                triggerd.processSensorData(temperature_data);
            });


            mqttTestClient.on('message', function(topic, message) {
                var json;
                try {
                    json = JSON.parse(message);
                } catch(error) {
                    logger.error("Malformated JSON received: " + message);
                }

                if (topic.match(/sensors\/temperature_ge20\/alert/)) {
                    expect(json).to.deep.equal(JSON.parse('{ "alert": "Ok" }'));
                    done();
                };
            });
        });
    });
});


// it("there should be 1 trigger", function(done) {
//     triggerd.addTrigger(trigger_fixtures.valid_1);
//     Trigger.count({}, function(err, c) {
//         done();
    //     });



 // var trigger = new Trigger(trigger_fixtures.valid_1);

 //        trigger.save(function(err, trigger) {
 //            console.log("HERE 1");
 //            var num = Trigger.count();
 //            expect(num).to.be.equal(1);
 //        });


 //        Trigger.find({}, function(err, triggers) {
 //            console.log("HERE 3");
 //            expect(err).to.be.null;
 //            triggers.length.should.equal(1);
 //            done();
 //        });

  //  });




// describe("When an MQTT trigger/refresh is received", function() {

//     it("should sync with triggers from the db", function() {

//     });
// });
