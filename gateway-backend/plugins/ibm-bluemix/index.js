var mqtt = require('mqtt');
var https = require('https');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

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


  this.on('connect', function() {
    console.log("Entered the connection function");

    client = mqtt.connect(
      {
        host: self.broker,
        port: self.port,
        username: self.username,
        password : self.password,
        clientId : "d:" + self.organization + ":" + self.type + ":" + self.id
      });

      client.on('connect', function () {
        self.topic_sub = 'iot-2/cmd/trigger/fmt/json';
        client.subscribe(topic_sub);
      });

      client.on('message', function(topic, message) {
        console.log('Received command on topic: ' + topic);
        console.log(message);
        try {
          self.msg = JSON.parse(message);
          self.emit('trigger', message);
        }
        catch (e) {
          console.log("Couldn't parse recieved command. Please ensure it is valid JSON.");
        }
      });
      //      console.log(client);
      // setInterval( function() {
      //   self.emit('trigger', 'LightON');
      // }, 1000 );
    });

    // Store the data record with the evt_type equal to the devID
    // This allows us to retrieve the records based on devID

    this.on('write', function(data) {
      self.topic_pub = "iot-2/evt/" + self.id + "/fmt/json";
      self.message = {
        "d" : {
          "value" : data.value,
          "timestamp" : data.timestamp
        }
      };

      //	console.log(self.message);
      client.publish(topic_pub, JSON.stringify(self.message));
    });


    this.on('read', function() {

      console.log("Bluemix - In read");
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
      console.log("here 2");

      var req = https.get(options, function(res) {
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var body = "";
        res.on('data', function(data) {
          // You can process streamed parts here...
          body += data;
        }).on('end', function() {
          console.log('BODY: ' + body);
          // ...and/or process the entire body here.
        });
      });

      req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
      });

      console.log("here 6");
      req.end();
      console.log("here 7");
    });

  }

  util.inherits(bluemix, EventEmitter);
  module.exports = bluemix;
