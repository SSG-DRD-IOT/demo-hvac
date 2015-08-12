var config = require("./config.json");
var mqtt = require('mqtt');
var _ = require('lodash');
var client  = mqtt.connect(config.mqtt.url);

var tempSensorName = "temperature";
var tempSensorTopic = "sensors/" + tempSensorName + "/data";

var lightSensorName = "light";
var lightSensorTopic = "sensors/" + lightSensorName + "/data";

client.on('connect', function () {
    console.log("Connected to the MQTT server on " + config.mqtt.url);
});

function getRandomTemp(min, max) {
    // Returns a random number between min (inclusive) and max (exclusive)
  return Math.round(Math.random() * (max - min) + min);
}

setInterval(function() {
    var temp = getRandomTemp(17, 30);

    var lightTemp = "off"; 
    var current_time = (new Date).getTime();

    var str = '{"sensor_id": "'
            + tempSensorName
            + '", "value": "'
            + temp
            + '", "timestamp":"'
            + current_time +'"}';

    console.log(str);


    client.publish(tempSensorTopic, str);

    var str = '{"sensor_id": "'
            + lightSensorName
            + '", "value": "'
            + lightTemp
            + '", "timestamp":"'
            + current_time +'"}';

    console.log(str);
    client.publish(lightSensorTopic, str);


}, config.interval);
