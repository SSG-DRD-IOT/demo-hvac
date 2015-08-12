var mongoose = require('mongoose');
var _ = require('lodash');
var config = require('../config.json');

mongoose.connect(config.mongodb.uri);
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
var ActuatorModel = require('intel-commerical-iot-database-models').ActuatorModel;

var actuators = [
    {
        "id": "fan",
        "ipaddress": "http://10.246.15.223:10010",
        "name": "fan",
        "description": "Decreases the temperature",
        "active": "true",
        "ioType": "digital"
    },
    {
        "id": "light",
        "ipaddress": "http://10.246.11.73:10010",
        "name": "light",
        "description": "Increases the temperature",
        "active": "true",
        "ioType": "digital"
    }

];

var sensors = [
    {
        "id":"temperature",
        "name":"temperature",
        "description":"read the temp",
        "maxfrequency":"200",
        "frequency":"1000",
        "active":"true",
        "ioType":"Analog"
    },
    {
        "id":"light",
        "name":"light",
        "description":"read the ambient light",
        "maxfrequency":"200",
        "frequency":"1000",
        "active":"true",
        "ioType":"Analog"
    },
    {
        "id":"sound",
        "name":"sound",
        "description":"read the ambient noise har har har",
        "maxfrequency":"200",
        "frequency":"1000",
        "active":"true",
        "ioType":"Analog"
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
        condition :  "( function(temperature) { return this.stash[\"light\"] == \"on\" && temperature > 27; } )",
        triggerFunc: "( function() { this.mqttClient.publish('sensors/temperature_g27_light_on/alerts','{\"alert\" : \"HotError\"}' ); })",
        active: true
    },
    {
        id : "temperature_less_than_20_fan_on",
        name : "temperature_less_than_20_fan_on",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return this.stash[\"fan\"] == \"on\" && temperature < 20; } )",
        triggerFunc: "( function() { this.mqttClient.publish('sensors/temperature_l20_fan_on/alerts','{\"alert\" : \"ColdError\"}' ); })",
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
        id : "temperature_is_ok",
        name : "temperature_is_ok",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return temperature > 20 && temperature <= 27; } )",
        triggerFunc: "( function() { this.mqttClient.publish('sensors/temperature_le27/alerts','{\"alert\" : \"Ok\"}' ); })",
        active: true
    }];



console.log(sensors);
TriggerModel.remove({}, function() {
    //    console.log("Removing document");
});

SensorModel.remove({},  function() {
    //    console.log("Removing document");
});

ActuatorModel.remove({},  function() {
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

_.forEach(actuators,
          function(JSON) {
              var rec = new ActuatorModel(JSON);
              rec.save(function(err) {
                  if (err) console.log(err);
              });
          });


// //db.close();
