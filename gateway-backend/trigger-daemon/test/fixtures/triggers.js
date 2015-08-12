var trigger_fixtures = {

    valid_1: {
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

    fan_on: {
        "id": "fan_on",
        "name": "fan_on",
        "sensor_id": "temperature",
        "actuator_id": "fan",
        "validator_id": "sound",
        "condition": ">80",
        "triggerFunc": [
            {
                "deviceId": "Fan",
                "action": "on"
            }
        ],
        "active": "true"
    },

    temperature_greater_than_27 : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return temperature > 27; } )",
        triggerFunc: "( function() { this.mqttClient.publish('sensors/temperature_g27/alerts','{\"alert\" : \"Hot\"}' ); })",
        active: true
    },

    temperature_greater_than_27_light_on : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return temperature > 27; } )",
        triggerFunc: "( function() { if (this.stash[\"light\"] == \"on\") { this.mqttClient.publish('sensors/temperature_g27_light_on/alerts','{\"alert\" : \"HotError\"}' ); }})",
        active: true
    },
    temperature_less_than_20_fan_on : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return temperature < 20; } )",
        triggerFunc: "( function() { if (this.stash[\"fan\"] == \"on\") { this.mqttClient.publish('sensors/temperature_l20_fan_on/alerts','{\"alert\" : \"ColdError\"}' ); }})",
        active: true
    },

    temperature_less_than_20 : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition : "( function(temperature) { return temperature < 20; } )",
        triggerFunc : "( function() { this.mqttClient.publish('sensors/temperature_l20/alerts','{\"alert\" : \"Cold\"}' ); })",
        active: true
    },

    temperature_less_than_or_equal_27 : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition :  "( function(temperature) { return temperature <= 27; } )",
        triggerFunc: "( function() { this.mqttClient.publish('sensors/temperature_le27/alerts','{\"alert\" : \"Ok\"}' ); })",
        active: true
    },

    temperature_greater_than_or_equal_20 : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition : "( function(temperature) { return temperature >= 20; } )",
        triggerFunc : "( function() { this.mqttClient.publish('sensors/temperature_ge20/alerts','{\"alert\" : \"Ok\"}' ); })",
        active: true
    }

};

module.exports = trigger_fixtures;
