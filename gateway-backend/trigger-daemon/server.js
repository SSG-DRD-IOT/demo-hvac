//This daemon listens to all data streams, and checks for particular trigger
//conditions as needed.
var mqtt = require('mqtt'); //This works over MQTT currently, will need to become extensible in future.
var _ = require("lodash"); //Library needed for data paring work.
var config = require("./config.json");//Configuration information

var mongoose = require('mongoose');

mongoose.connect(config.mongodb.host);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    logger.info("Connection to MongoDB successful");
});

// Import the Database Model Objects
//var DataModel = require('intel-commerical-iot-database-models').DataModel;
//var SensorCloudModel = require('intel-commerical-iot-database-models').SensorCloudModel;
var TriggerModel = require('intel-commerical-iot-database-models').TriggerModel;

// Setup the models which can interact with the database
//var sensorCloudModel = new SensorCloudModel(db);
//var dataModel = new DataModel(db);
var triggerModel = new TriggerModel(db);

var triggers = [];
var triggers_by_sensor_id = [];

var logger = require('./logger.js');

logger.info("Trigger Daemon is starting...");

if(config.debug != "true") {
    logger.remove(winston.transports.File);
    logger.remove(winston.transports.Console);
}

// Import the Utilities functions
var utils = require("./utils.js");

// Connect to the MQTT server
var mqttClient  = mqtt.connect(config.mqtt.url);

// On the start of a connection, do the following...
mqttClient.on('connect', function () {
    logger.info("Connected to MQTT server");
    mqttClient.subscribe('trigger/refresh');
    mqttClient.subscribe('trigger/data');
    mqttClient.subscribe('sensors/+/data');
    mqttClient.publish('trigger/refresh', '{"refresh" : "true"}');
});

// Every time a new message is received, do the following
mqttClient.on('message', function (topic, message) {
    logger.trace(topic + ":" + message);
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
        processSensorData(json);
    } else if (utils.isRefreshTopic(topic)) {
        // Received a message on the Refresh MQTT topic
        processRefresh(json);
    } else if (utils.isTriggerTopic(topic)) {
        // Received a message on the Trigger MQTT topic
        processTriggers(json);
    }

});

function processTriggers(triggers) {
    logger.info("Received a message on the Trigger MQTT topic");
    logger.info(triggers);
    var triggerFuncs = _.map(triggers, function(element) {

        logger.info("element.condition: " + element.condition);
        var op = element.condition.match(/[<>=]+/);
        var triggerValue = element.condition.match(/\d+/);

        if (op == "" || triggerValue == "") {
            logger.error("SyntaxError: with op or triggerValue");
            return;
        }
        var fcond = compareFuncBuilder(op, triggerValue);
        return _.extend({}, element, {condfunc: fcond});
    });

    triggers_by_sensor_id = _.groupBy(triggerFuncs, "sensor_id");
    logger.debug(triggers_by_sensor_id);
}

function processRefresh(json) {
    // Message recieved on the refresh topic
    logger.info("Received a message on the Refresh MQTT topic");


    TriggerModel.find({}, function (err, results) {
        if (err) {
            logger.error("Error in fetching triggers from the database");
        } else {
            logger.info("Publishing new triggers from db");
            mqttClient.publish('trigger/data', JSON.stringify(results));
        }
    });
}

function processSensorData(json) {
    var sensor_id = json.sensor_id;
    var value = json.value;

    // Loop through all of the triggers for the sensor which
    // is sending this incoming sensor data.
    _.forEach(
        triggers_by_sensor_id[sensor_id],

        // Check if the triggers predicate evaluates to true
        function(trigger) {
            if (trigger.condfunc(value)) {
                logger.info("Trigger has fired!  " + trigger.name);

                // Build the topic string for the actuator that is notified
                var actuatorTopic = 'actuator/' + trigger.actuator_id + '/trigger';

                // Send a response to the actuator
                mqttClient.publish(actuatorTopic, trigger.triggerFunc);

                //DATA CHECKS GO HERE!
            }
        });
}

function compareFuncBuilder(operator, triggerValue) {
    return function (sensorValue) {
        var functionStr = sensorValue + operator + triggerValue;
        return eval(functionStr);
    };

}
