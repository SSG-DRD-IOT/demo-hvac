var mqtt    = require('mqtt');
var config  = require('./config.json');
var client  = mqtt.connect(config.mqtt.uri);

client.on('connect', function () {
  client.publish('trigger/refresh', '{"refresh": "true"}');
  client.end();
});
