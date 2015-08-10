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
    }

};

module.exports = trigger_fixtures;
