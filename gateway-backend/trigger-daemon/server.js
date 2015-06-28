//This daemon listens to all data streams, and checks for particular trigger
//conditions as needed.
var mqtt = require('mqtt'); //This works over MQTT currently, will need to become extensible in future.
var sqlite3 = require('sqlite3').verbose(); //We're using sqlite for our database
var _ = require("lodash"); //Library needed for data paring work.
var config = require("./config.json");//Configuration information

// Create a connection to a SQLITE3 database
var db = new sqlite3.Database(config.sqlite3.file);

// Import the Database Model Objects
var DataModel = require('intel-commerical-iot-database-models').DataModel;
var SensorCloudModel = require('intel-commerical-iot-database-models').SensorCloudModel;
var TriggerModel = require('intel-commerical-iot-database-models').TriggerModel;

// Setup the models which can interact with the database
var sensorCloudModel = new SensorCloudModel(db);
var dataModel = new DataModel(db);
var triggerModel = new TriggerModel(db);

var triggersInDatabase = new Array();
var newTriggers = new Array();
var suscribedTopics = new Array();

//var triggerNames = _.pluck(triggers, 'name');
//var newSubscriptions = _.filter(new_triggers, _.contains(triggers) == false);

// Setup a logging system in this daemon
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'trigger-daemon.log' })
    ]
});

var topicHelper = require("./topicHelper.js");

// Connect to the MQTT server
var mqttClient  = mqtt.connect(config.mqtt.url);

function getDBtriggers() {
    triggerModel.find(function(err, results) {
        mqttClient.publish('trigger-daemon/data', results);
    });
}

// On the start of a connection, do the following...
mqttClient.on('connect', function () {
    logger.log('info', "Connected to MQTT server");
    mqttClient.subscribe('trigger-daemon/refresh');
    mqttClient.subscribe('trigger-daemon/data');
    mqttClient.subscribe('sensors/+/data');
});

// Every time a new message is received, do the following
mqttClient.on('message', function (topic, message) {
    logger.log('info', topic + ":" + message.toString());

    json = JSON.parse(message);

    if (topic.match(/sensors\/[A-za-z0-9]{32}\/data/)) {
        console.log("asdf");
    } else if (topic.match(/trigger-daemon\/refresh/)) {
        // Message recieved on the refresh topic
        getDBtriggers();
    } else if (topic.match(/trigger-daemon\/data/)) {
        triggers = message;
    }

    if (json.value > 80) {
        logger.log("Greater than 80");
        mqttClient.publish("actuator/" + fan.id + "/triggers", "");
    } else {
        logger.log("Less than 80");
        mqttClient.publish("actuator/" + lamp.id + "/triggers", "on");
    }
});
