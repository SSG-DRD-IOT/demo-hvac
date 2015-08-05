var config = require("./config.json");
var _ = require("lodash");

// Require the MQTT connections
var mqtt = require('mqtt');
var client  = mqtt.connect(config.mqtt.url);

// Require the MongoDB libraries
var mongoose = require('mongoose');

mongoose.connect(config.mongodb.host);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    //   console.log("Connection to MongoDB successful");
});

// Import the Database Model Objects
var DataModel = require('intel-commerical-iot-database-models').DataModel;
var SensorModel = require('intel-commerical-iot-database-models').SensorModel;

// Setup a model for the relations between sensors and clouds
var sensorModel = new SensorModel(db);
var dataModel = new DataModel(db);

var logger = require('./logger.js');

if(config.debug != "true") {
    logger.remove(winston.transports.File);
    logger.remove(winston.transports.Console);
}

logger.info("Edge Device Daemon is starting");
// Connect to the MQTT server
var mqttClient  = mqtt.connect(config.mqtt.url);

function dataTopic(id) {
    return id + "-data";
}

function errorTopic(id) {
    return id + "-error";
}

function getID(topic) {
    return topic.substr(8, 32);
}

function getType(topic) {
    return topic.substr(41, topic.length);
}

// MQTT connection function
mqttClient.on('connect', function () {
    logger.info("Connected to MQTT server");
    mqttClient.subscribe('announcements');
    mqttClient.subscribe('sensors/+/data');
});

// A function that runs when MQTT receives a message
mqttClient.on('message', function (topic, message) {
    // logger.log('info', topic + ":" + message.toString());

    // Parse the incoming data
    try {
        json = JSON.parse(message);
    } catch(e){
        logger.error(e);
    }

    if (topic == "announcements") {
        logger.info("Received an Announcement");
        logger.debug(topic + ":" + message.toString());

        var sensor = new SensorModel(json);
        sensor.save();
    };

    if (topic.match(/data/)) {
        logger.debug("Writing to db:" + message.toString());
        var value = new DataModel(json);
        value.save();
    }
});
