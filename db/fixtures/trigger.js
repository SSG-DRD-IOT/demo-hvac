var trigger_fixtures = {

    valid_1 : {
        id : "FanOn",
        name : "FanOn",
        sensor_id : "Temperature",
        actuator_id : "Fan",
        validator_id : "Sound",
        condition : ">80",
        triggerFunc: "on",
        active: true
    }

};

module.exports = trigger_fixtures;
