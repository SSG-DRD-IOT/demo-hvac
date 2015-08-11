var mongoose = require('mongoose');
var _ = require('lodash');
var config = require('../config.json');

mongoose.connect(config.mongodb.host);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to MongoDB successful");
});

// Import the Database Model Objects
//var DataModel = require('intel-commerical-iot-database-models').DataModel;
//var SensorCloudModel = require('intel-commerical-iot-database-models').SensorCloudModel;
var TriggerModel = require('intel-commerical-iot-database-models').TriggerModel;
var SensorModel = require('intel-commerical-iot-database-models').SensorModel;

var sensors = [
    {
        "id":"1",
        "name":"Temperature",
        "description":"read the temp",
        "maxfrequency":200,
        "frequency":1000,
        "active":"true",
        "ioType":"Analog"
    },
    {
        "id":"2",
        "name":"Light Sensor",
        "description":"read the ambient light",
        "maxfrequency":200,
        "frequency":1000,
        "active":"true",
        "ioType":"Analog"
    },
    {
        "id":"3",
        "name":"Sound Sensor",
        "description":"read the ambient noise har har har",
        "maxfrequency":200,
        "frequency":1000,
        "active":"true",
        "ioType":"Analog"
    },
    {
        "id":"aa2177fdd5dd740c9ad7915182aa8850",
        "name":"sound",
        "description":"A sound sensor - tells user when fan is not working.",
        "maxfrequency":1,
        "frequency":1,
        "active":1,
        "ioType":"aio"
    },
    {
        "id":"b506768ce1e2353fe063d344e89e53e5",
        "name":"temperature",
        "description":"A temperature sensor.",
        "maxfrequency":1,
        "frequency":1,
        "active":1,
        "ioType":"analog"
    }
];

var triggers = [
    {
        id : "temperature_greater_than_27",
        name : "temperature_greater_than_27",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return temperature > 27; } )",
        triggerFunc: "( function() { this.mqttClient.publish('sensors/temperature_g27/alerts','{\"alert\" : \"Hot\"}' ); })",
        active: true
    },

    {
        id : "temperature_greater_than_27_light_on",
        name : "temperature_greater_than_27_light_on",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return temperature > 27; } )",
        triggerFunc: "( function() { if (this.stash[\"light\"] == \"on\") { this.mqttClient.publish('sensors/temperature_g27_light_on/alerts','{\"alert\" : \"HotError\"}' ); }})",
        active: true
    },
    {
        id : "temperature_less_than_20_fan_on",
        name : "temperature_less_than_20_fan_on",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return temperature < 20; } )",
        triggerFunc: "( function() { if (this.stash[\"fan\"] == \"on\") { this.mqttClient.publish('sensors/temperature_l20_fan_on/alerts','{\"alert\" : \"ColdError\"}' ); }})",
        active: true
    },

    {
        id : "temperature_less_than_20",
        name : "temperature_less_than_20",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition : "( function(temperature) { return temperature < 20; } )",
        triggerFunc : "( function() { this.mqttClient.publish('sensors/temperature_l20/alerts','{\"alert\" : \"Cold\"}' ); })",
        active: true
    },

    {
        id : "temperature_less_than_or_equal_27",
        name : "temperature_less_than_or_equal_27",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return temperature <= 27; } )",
        triggerFunc: "( function() { this.stash = \"It worked!\"; this.mqttClient.publish('sensors/temperature_le27/alerts','{\"alert\" : \"Ok\"}' ); })",
        active: true
    },

    {
        id : "temperature_greater_than_or_equal_20",
        name : "temperature_greater_than_or_equal_20",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition : "( function(temperature) { return temperature >= 20; } )",
        triggerFunc : "( function() { this.mqttClient.publish('sensors/temperature_ge20/alerts','{\"alert\" : \"Ok\"}' ); })",
        active: true
    }
];

TriggerModel.remove({}, function() {
    //    console.log("Removing document");
});

SensorModel.remove({},  function() {
    //    console.log("Removing document");
});

_.forEach(triggers,
          function(triggerJSON) {
              var trigger = new TriggerModel(triggerJSON);
              trigger.save(function(err) {
                  if (err) console.log(err);
              });
          });


_.forEach(sensors,
          function(sensorJSON) {
              var sensor = new SensorModel(sensorJSON);
              sensor.save(function(err) {
                  if (err) console.log(err);
              });
          });


//db.close();
