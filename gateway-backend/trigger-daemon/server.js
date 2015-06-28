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

// Setup a model for the relations between sensors and clouds
var sensorCloudModel = new SensorCloudModel(db);
var dataModel = new DataModel(db);

var fan = { //Setting up the fan
    id: 'fan'
};

var lamp = { //Setting up the lamp
    id: 'lamp'
};

var triggersInDatabase = new Array();
var newTriggers = new Array();
var suscribedTopics = new Array();

var triggerNames = _.pluck(triggers, 'name');
var newSubscriptions = _.filter(new_triggers, _.contains(triggers) == false);

// Setup a logging system in this daemon
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'trigger-daemon.log' })
    ]
});

// Connect to the MQTT server
var mqttClient  = mqtt.connect(config.mqtt.url);

//Retrieve the topic for listening to a device's data given a specific device ID.
function dataTopic(id) {
    return "sensors/" + id + "/data";
}

//Retrieve the topic for sending control messages to a device given a specific
//device id.
function controlTopic(id) {
    return "actuators/" + id + "/control";
}

//Retrieve the topic for sending error messages to a device given a specific
//device id.
function errorTopic(id) {
    return "other/" + id + "/errors";
}

//Get a device id from a topic.
function getID(topic) {
    return topic.substr(8, 32);
}

//Get the type of data being parsed from an announcement.
function getType(topic) {
    return topic.substr(42, topic.length);
}

// using the `_.property` callback shorthand
_.map(triggers, '');


// On the start of a connection, do the following...
mqttClient.on('connect', function () {
    winston.log('info', "Connected to MQTT server");
    mqttClient.subscribe('trigger-daemon/refresh');
    mqttClient.subscribe('sensors/+/data');
});

// Every time a new message is received, do the following
mqttClient.on('message', function (topic, message) {
    winston.log('info', topic + ":" + message.toString());

    json = JSON.parse(message);



        console.log(json.value);
        if (json.value > 80) {
            winston.log("Greater than 80");
            mqttClient.publish("actuator/" + fan.id + "/triggers", "");
        } else {
            winston.log("Less than 80");
            mqttClient.publish("actuator/" + lamp.id + "/triggers", "on");
        }


});
