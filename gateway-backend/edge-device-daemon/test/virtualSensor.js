var config = require("./config.json");
var mqtt = require('mqtt');
var _ = require('lodash');
var client  = mqtt.connect(config.mqtt.url);

client.on('connect', function () {
    console.log("Connected to the MQTT server on " + config.mqtt.url);
});

function getRandomTemp(min, max) {
    // Returns a random number between min (inclusive) and max (exclusive)
  return Math.random() * (max - min) + min;
}

setInterval(function() {
    var temp = getRandomTemp(70, 90);

    var lightTemp = getRandomTemp(63, 67);
    var current_time = (new Date).getTime();

    var str = '{"sensor_id": "virtualTempSensor", "value": "'
            + temp
            + '", "timestamp":"'
            + current_time +'"}';

    console.log(str);

    client.publish('sensors/virutalTempSensor/data', str);

    var str = '{"sensor_id": "lightSensor", "value": "'
            + lightTemp
            + '", "timestamp":"'
            + current_time +'"}';

    console.log(str);
    client.publish('sensors/virutalTempSensor/data', str);


}, config.interval);
