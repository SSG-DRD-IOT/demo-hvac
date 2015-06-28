var config = require("./config.json");
var mqtt = require('mqtt');
var _ = require('lodash');
var client  = mqtt.connect(config.mqtt.url);

var sqlite3 = require('sqlite3').verbose();
var _ = require("lodash");

// Establish a connection to the database
var db = new sqlite3.Database(config.sqlite3.file);

// Import the Database Model Objects
var DataModel = require('intel-commerical-iot-database-models').DataModel;
var SensorModel = require('intel-commerical-iot-database-models').SensorModel;

// Setup a model for the relations between sensors and clouds
var sensorModel = new SensorModel(db);
var dataModel = new DataModel(db);

// Setup a logging system in this daemon
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'edge-device-daemon.log' })
    ]
});

logger.log('info', "Edge Device Daemon is starting");

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
    console.log("Connected to MQTT server");
    mqttClient.subscribe('announcements');
    mqttClient.subscribe('sensors/+/data');
});

// A function that runs when MQTT receives a message
mqttClient.on('message', function (topic, message) {
    logger.log('info', topic + ":" + message.toString());

    json = JSON.parse(message);

    if (topic == "announcements") {
        logger.log("Received an Announcement");

        var sensor = new SensorModel(db, json);
        sensor.save();

        // logger.log('info', sensor);
    };

    if (getType(topic) == "data") {
        logger.log('info', "hello");
        var value = new DataModel(db, json);
        value.save();
    }

});

// Implement a shutdown for the daemon
//mqttClient.end();
