var mongoose = require('mongoose');
var _ = require('lodash');
var config = require('./config.json');

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

var triggers = [
    {
        "id": "1",
        "name": "Fan Off",
        "sensor_id": "b506768ce1e2353fe063d344e89e53e5",
        "actuator_id": "752293f38a3d0e683178cdac2f864468",
        "validator_id": "b506768ce1e2353fe063d344e89e53e5",
        "condition": "<80",
        "triggerFunc": [
            {
                "deviceId": "752293f38a3d0e683178cdac2f864468",
                "action": "off"
            }
        ],
        "active": "true"
    },

    {
        "id": "2",
        "name": "Fan On",
        "sensor_id": "b506768ce1e2353fe063d344e89e53e5",
        "actuator_id": "752293f38a3d0e683178cdac2f864468",
        "validator_id": "b506768ce1e2353fe063d344e89e53e5",
        "condition": ">80",
        "triggerFunc": [
            {
                "deviceId": "752293f38a3d0e683178cdac2f864468",
                "action": "on"
            }
        ],
        "active": "true"
    },

    {
        "id": "3",
        "name": "Lamp Off",
        "sensor_id": "b506768ce1e2353fe063d344e89e53e5",
        "actuator_id": "e7b29b749fa4d940e0d43ab6a4f94f41",
        "validator_id": "b506768ce1e2353fe063d344e89e53e5",
        "condition": ">68",
        "triggerFunc": [
            {
                "deviceId": "e7b29b749fa4d940e0d43ab6a4f94f41",
                "action": "off"
            }
        ],
        "active": "true"
    },

    {
        "id": "4",
        "name": "Lamp On",
        "sensor_id": "b506768ce1e2353fe063d344e89e53e5",
        "actuator_id": "e7b29b749fa4d940e0d43ab6a4f94f41",
        "validator_id": "b506768ce1e2353fe063d344e89e53e5",
        "condition": "<68",
        "triggerFunc": [
            {
                "deviceId": "e7b29b749fa4d940e0d43ab6a4f94f41",
                "action": "on"
            }
        ],
        "active": "true"
    }
];

TriggerModel.remove({}, function() {
    console.log("Removing document");
});

_.forEach(triggers,
          function(triggerJSON) {
              var trigger = new TriggerModel(triggerJSON);
              trigger.save(function(err) {
                  if (err) console.log(err);
                  else console.log("Saved");
              });
          });

//db.close();
