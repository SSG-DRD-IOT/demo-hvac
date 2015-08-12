var mqtt = require('mqtt');
var https = require('https');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var logger = require('./logger.js');
var winston = require('winston');

function bluemix(json){

  var self = this;
  self.config = json;
  self.organization = self.config.org;
  self.type = self.config.type;
  self.id = self.config.id;
  self.port = self.config.port;
  self.username = self.config.username;
  self.password = self.config['auth-token'];
  self.route = self.config.route;
  self.broker = self.organization + self.route;
  self.options = {};

  if(self.config.debug != "true") {
    logger.remove(winston.transports.Console);
    logger.remove(winston.transports.File);
  }

  this.on('connect', function() {
    logger.info("Entered the connection function");

    self.options.username = self.username;
    self.options.password = self.password;
    self.options.clientId = "d:" + self.organization + ":" + self.type + ":" + self.id;
    self.client = mqtt.createClient(self.port, self.broker, self.options);
    // self.client = mqtt.connect(
    //   {
    //     host: self.broker,
    //     port: self.port,
    //     username: self.username,
    //     password : self.password,
    //     clientId : "d:" + self.organization + ":" + self.type + ":" + self.id
    //   });

    logger.info('Broker: ' + self.broker);
    logger.info('Port: ' + self.port);
    logger.info('User: ' + self.username);
    logger.info('Password: ' + self.password);
    logger.info('Client ID: ' + "d:" + self.organization + ":" + self.type + ":" + self.id);

    self.client.on('connect', function () {
      self.topic_sub = 'iot-2/cmd/trigger/fmt/json';
      self.client.subscribe(self.topic_sub);
      logger.info('Connected and subscribed to ' + self.topic_sub);
    });

    self.client.on('message', function(topic, message) {
      logger.info('Received command on topic: ' + topic);
      logger.info(message);
      try {
        self.msg = JSON.parse(message);
        self.emit('trigger', message);
      }
      catch (e) {
        logger.error("Couldn't parse recieved command. Please ensure it is valid JSON.");
      }
    });

  });

  // Store the data record with the evt_type equal to the devID
  // This allows us to retrieve the records based on devID

  this.on('write', function(value) {
    self.topic_pub = "iot-2/evt/" + self.id + "/fmt/json";
    self.message = {
      "d" : {
        "value" : value,
      }
    };
    logger.info(self.message);
    self.client.publish(self.topic_pub, JSON.stringify(self.message));
  });


  this.on('read', function() {

    logger.info("Bluemix - In read");
    var start = Date.now() - 10;

    var options = {
      hostname: "internetofthings.bluemixcloud.com"
      ,port: 443
      ,path: '/api/v0001/historian/ndag4d?start=78787676&end=' + Date.now()
      ,method: 'GET'
      ,headers: {
        'Authorization': 'Basic ' + new Buffer("a-ndag4d-3p2uynctid" + ":" + "0+ab38e2gGOjiI9m(V").toString('base64')
      }
    };

    var req = https.get(options, function(res) {
      // logger.info('STATUS: ' + res.statusCode);
      // logger.info('HEADERS: ' + JSON.stringify(res.headers));

      // Buffer the body entirely for processing as a whole.
      var body = "";
      res.on('data', function(data) {
        // You can process streamed parts here...
        body += data;
      }).on('end', function() {
        logger.info('BODY: ' + body);
        // ...and/or process the entire body here.
      });
    });

    req.on('error', function(e) {
      logger.info('ERROR: ' + e.message);
    });

    logger.info("here 6");
    req.end();
    logger.info("here 7");
  });

}

util.inherits(bluemix, EventEmitter);
module.exports = bluemix;
