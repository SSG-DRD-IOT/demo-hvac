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


var triggers;
var triggers_by_sensor_id;
var lock = true;

// var triggers = [ { id: '1',
//     name: 'FanON',
//     sensor_id: 'virtualTempSensor',
//     actuator_id: 'Fan',
//     condition: '>80',
//     triggerFunc: 'on',
//     active: 'true' },
// { id: '2',
//     name: 'LampON',
//     sensor_id: 'virtualTempSensor',
//     actuator_id: 'Lamp',
//     condition: '<79',
//     triggerFunc: 'on',
//     active: 'true' },
// { id: '3',
//     name: 'FanError',
//     sensor_id: 'soundSensor',
//     actuator_id: 'Fan',
//     condition: '>85',
//     triggerFunc: 'on',
//     active: 'true' },
// { id: '4',
//     name: 'LampError',
//     sensor_id: 'lightSensor',
//     actuator_id: 'Lamp',
//     condition: '<65',
//     triggerFunc: 'on',
//     active: 'true' } ];

// var sensorValue = 90;
// var op = "==";
// var triggerValue = 80;

// var fcond = compareFuncBuilder(op, triggerValue);
// console.log(sensorValue + op + triggerValue);
// console.log(fcond(sensorValue));




// var triggersInDatabase = new Array();
// var newTriggers = new Array();
// var suscribedTopics = new Array();

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

logger.log('info', "Trigger Daemon is starting...");
var topicHelper = require("./topicHelper.js");

// Connect to the MQTT server
var mqttClient  = mqtt.connect(config.mqtt.url);

// On the start of a connection, do the following...
mqttClient.on('connect', function () {
    logger.log('info', "Connected to MQTT server");
    mqttClient.subscribe('trigger-daemon/refresh');
    mqttClient.subscribe('trigger');
    mqttClient.subscribe('sensors/+/data');
    mqttClient.publish('trigger-daemon/refresh', '{"refresh" : "true"}');
});

// Every time a new message is received, do the following
mqttClient.on('message', function (topic, message) {
    json = JSON.parse(message);

    console.log("lock: " + lock);
    console.log(json);
    console.log(triggers_by_sensor_id);
    // console.log(topic + ":" + message.toString());
    if (topic.match(/sensors\/[A-Za-z0-9]{0,32}\/data/) && lock == false) {

        var sensor_id = json.sensor_id;
        var value = json.value;

        _.forEach(
            triggers_by_sensor_id[sensor_id],
            function(trigger) {
                if (trigger.condfunc(value)) {
                    //    console.log("Trigger has fired!  " + trigger.name);
                    mqttClient.publish('actuator/' + trigger.actuator_id + '/trigger', trigger.triggerFunc);
                }
            });
    } else if (topic.match(/trigger-daemon\/refresh/)) {
        // Message recieved on the refresh topic
        console.log("Received a refresh trigger!!!!!!!!!!!!!!!!!!!!");
        getDBtriggers();
    } else if (topic.match(/trigger/)) {
        console.log("Yes! New Triggers");
        triggers = json;
        console.log(triggers);
        newTriggers(triggers);
    }

});


function getDBtriggers() {
    console.log("Entering getDBtriggers");

    db.all("SELECT * FROM triggers",
           function(err, results) {
               console.log("Entering getDBtriggers callback");
               if (err) {
                   console.log("Error in getDBtriggers callback");
               } else {
                   console.log("publishing new triggers from db");
                   console.log(results);
                   mqttClient.publish('trigger', results);
               }
           });

}


function compareFuncBuilder(operator, triggerValue) {
    return function (sensorValue) {
        var functionStr = sensorValue + operator + triggerValue;
        return eval(functionStr);
    };

}

function newTriggers(triggers) {
    console.log(triggers);
    var triggerFuncs = _.map(triggers, function(element) {

        console.log("element.condition: " + element.condition);
        var op = element.condition.match(/[<>=]+/);
        var triggerValue = element.condition.match(/\d+/);

        if (op == "" || triggerValue == "") {
            console.log("SyntaxError: with op or triggerValue");
            return;
        }
        var fcond = compareFuncBuilder(op, triggerValue);
        return _.extend({}, element, {condfunc: fcond});
    });

    triggers_by_sensor_id = _.groupBy(triggerFuncs, "sensor_id");

    lock = false;
    console.log("lock: " + lock);
    console.log(triggers_by_sensor_id);
}

// setTimeout(function(mqttCient) {
//     console.log("Fetching triggers from database");
//     console.log(triggers);
// Fetch the initial set of Triggers

// triggerModel.find(mqttClient, function(mqttClient, results) {
//     console.log("Printing the mqttClient");
//     console.log("----------------------");
//     console.log("Database triggers are fetched");
//     console.log(results);
//     mqttClient.publish('trigger', results);

// });
//}, 1000);
