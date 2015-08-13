//This daemon listens to all data streams, and checks for particular trigger
//conditions as needed.
var mqtt = require('mqtt');
var mongoose = require('mongoose');
var http = require('http-request');
var _ = require("lodash"); //Library needed for data paring work.
var config = require("./config.json"); //Configuration information

// Import the Database Model Objects
//var DataModel = require('intel-commerical-iot-database-models').DataModel;
//var SensorCloudModel = require('intel-commerical-iot-database-models').SensorCloudModel;
var TriggerModel = require('intel-commerical-iot-database-models').TriggerModel;
var ErrorModel = require('intel-commerical-iot-database-models').ErrorModel;

var logger = require('./logger.js');

logger.info("Trigger Daemon is starting...");

//if(config.debug.level != "true") {
logger.transports.file.level = 'trace';
logger.transports.console.level = 'trace';
//}

// Import the Utilities functions
var utils = require("./utils.js");

var TriggerDaemon = function (config) {
    var self = this;
    logger = logger;

    var default_config = {
        "mqtt" : {
            "uri" : "mqtt://localhost"
        },

        "mongodb" : {
            "uri" : "mongodb://localhost/iotdemo"
        },

        "debug" : {
            "level" : "false"
        }
    };

    // Set default properties of the Trigger Daemon
    self.config = config || default_config;

    self.start = function () {};

    self.triggers = [];
    self.stash = [];

    // Connect to the MQTT server
    self.mqttClient  = mqtt.connect(self.config.mqtt.uri);

    // Connect to the MongoDB server
    var db = mongoose.connect(config.mongodb.uri);
    logger.info("Getting Triggers from the database");

    TriggerModel.find({}, function (err, triggers) {
        if (err) {
            logger.error("Error in fetching triggers from the database");
        } else {
            logger.info("Publishing new triggers from db");
            _.forEach(triggers,
                      function(triggerJSON) {
                          self.addTrigger(triggerJSON);
                      });
       	    console.log(self.triggers);
	}
    });


    // Save the MongoDB client instance to a property in
    // the Trigger Daemon object
    self.mongodb_client = db;

    //var mongodb_connected;
    //    db.on('error', console.error.bind(console, 'connection error:'));
    // db.on('error', function(err) {
    //     throw(err);
    // });

    self.close = function() {
        self.closeMQTT();
        self.closeMongoDB();
    };

    self.closeMQTT = function() {
        //  self.mqttClient.end();
    };

    self.closeMongoDB = function () {
        //  console.log("Mongoose Disconnecting");
        mongoose.disconnect();
    };

    //    db.once('open', function () {
    //console.log("Connection to MongoDB opened");
    //    });

    self.addTrigger = function (triggerJSON) {
        var trigger = new TriggerModel(triggerJSON);
        self.triggers.push(trigger);
    };

    self.processTriggers = function(json) {

    };

    self.refreshTriggers = function() {
        logger.info("Received a message on the Refresh MQTT topic");

        TriggerModel.find({}, function (err, results) {
            console.log("In find");
            if (err) {
                logger.error("Error in fetching triggers from the database");
            } else {
                logger.info("Publishing new triggers from db");
                self.mqttClient.publish('trigger/data', JSON.stringify(results));
            }
        });
    };

    // On the start of a connection, do the following...
    self.mqttClient.on('connect', function () {
        logger.info("Connected to MQTT server");
        self.mqttClient.subscribe('trigger/refresh');
        self.mqttClient.subscribe('trigger/data');
        self.mqttClient.subscribe('sensors/+/data');
        //        self.mqttClient.publish('trigger/refresh', '{"refresh" : "true"}');
    });


    // Every time a new message is received, do the following
    self.mqttClient.on('message', function (topic, message) {
        logger.info(topic + ":" + message.toString());
        var json;

        // Parse incoming JSON and print an error if JSON is bad
        try {
            json = JSON.parse(message);
        } catch(error) {
            logger.error("Malformated JSON received: " + message);
        }

        // Determine which topic Command Dispatcher
        if (utils.isSensorTopic(topic)) {
            // Received a message on a Sensor MQTT topic
            self.processSensorData(json);
        } else if (utils.isRefreshTopic(topic)) {
            // Received a message on the Refresh MQTT topic
            self.refreshTriggers();
        } else if (utils.isTriggerTopic(topic)) {
            // Received a message on the Trigger MQTT topic
            self.processTriggers(json);
        }
    });

    self.filter_triggers_by_sensor_id = function(id) {
        return _.filter(self.triggers, {sensor_id : id});
    };

    self.processSensorData = function(json) {
        var sensor_id = json.sensor_id;
        var value = json.value;

        // Loop through all of the triggers for the sensor which
        // is sending this incoming sensor data.
        //   logger.info("Stash: " + sensor_id + ":" + value);
        //   console.log(self.stash);
        self.stash[sensor_id] = value;
        // console.log(self.stash);

        _.forEach(
            self.filter_triggers_by_sensor_id(
                sensor_id
            ),

            // Check if the triggers predicate evaluates to true
            function(trigger) {
                if (trigger.eval_condition(self, value)) {
                    logger.info("Trigger Fired: " + trigger.name);
                    trigger.eval_triggerFunc(self);
                }
            });
    };



    self.temperature_ok = function() {
        self.mqttClient.publish('sensors/temperature/alerts','{\"alert\" : \"Ok\"}' );

        // http.get('http://fanandsound/...', function (err, res) {
	//     if (err) {
	// 	logger.error(err);
	//     }

	//     //console.log(res.code, res.headers, res.buffer.toString());
        // });


        // http.get('http://lightandlamp/...', function (err, res) {
	//     if (err) {
	// 	logger.error(err);
	//     }

	//     //console.log(res.code, res.headers, res.buffer.toString());
        // });
    };

    self.temperature_too_cold = function() {
        self.mqttClient.publish('sensors/temperature/alerts','{\"alert\" : \"Cold\"}' );

        // http.get('http://lightandlamp/...', function (err, res) {
	//     if (err) {
	// 	logger.error(err);
	//     }

	//     //console.log(res.code, res.headers, res.buffer.toString());
        // });
    };

    self.temperature_too_hot = function() {
        self.mqttClient.publish('sensors/temperature/alerts','{\"alert\" : \"Hot\"}' );

        // http.get('http://fanandsound/...', function (err, res) {
	//     if (err) {
	// 	logger.error(err);
	//     }

	//     //console.log(res.code, res.headers, res.buffer.toString());
        // });
    };


    self.temperature_cooling_error = function() {
        // The LCD screen status will changed based on this MQTT alert
        logger.error("Cooling Error");
        self.mqttClient.publish('sensors/temperature/errors','{\"alert\" : \"ColdError\"}' );

        var error = new ErrorModel({ type: "ColdError", message: "The lamp has failed to run, and the temperature is too cold"});

        error.save(function(err, sensor) {
            if (err) { throw(err); }
        });
    };

    self.temperature_heating_error = function() {
        // The LCD screen status will changed based on this MQTT alert
        logger.error("Heating Error");
        self.mqttClient.publish('sensors/temperature/errors','{\"alert\" : \"HotError\"}' );
        var error = new ErrorModel({ type: "HotError", message: "The fan has failed to run, and the temperature is too hot"});

        error.save(function(err, sensor) {
            if (err) { throw(err); }
        });
    };

};

// // Every time a new message is received, do the following
// mqttClient.on('message', function (topic, message) {
//     logger.trace(topic + ":" + message);
//     var json;

//     // Parse incoming JSON and print an error if JSON is bad
//     try {
//         json = JSON.parse(message);
//     } catch(error) {
//         logger.error("Malformated JSON received: " + message);
//     }

//     // Determine which topic Command Dispatcher
//     if (utils.isSensorTopic(topic)) {
//         // Received a message on a Sensor MQTT topic
//         processSensorData(json);
//     } else if (utils.isRefreshTopic(topic)) {
//         // Received a message on the Refresh MQTT topic
//         processRefresh(json);
//     } else if (utils.isTriggerTopic(topic)) {
//         // Received a message on the Trigger MQTT topic
//         processTriggers(json);
//     }

// });

// function processTriggers(triggers) {
//     logger.info("Received a message on the Trigger MQTT topic");
//     logger.info(triggers);
//     var triggerFuncs = _.map(triggers, function(element) {

//         logger.info("element.condition: " + element.condition);
//         var op = element.condition.match(/[<>=]+/);
//         var triggerValue = element.condition.match(/\d+/);

//         if (op == "" || triggerValue == "") {
//             logger.error("SyntaxError: with op or triggerValue");
//             return;
//         }
//         var fcond = compareFuncBuilder(op, triggerValue);
//         return _.extend({}, element, {condfunc: fcond});
//     });

//     triggers_by_sensor_id = _.groupBy(triggerFuncs, "sensor_id");
//     logger.debug(triggers_by_sensor_id);
// }


module.exports = TriggerDaemon;

var triggerd = new TriggerDaemon(config);
