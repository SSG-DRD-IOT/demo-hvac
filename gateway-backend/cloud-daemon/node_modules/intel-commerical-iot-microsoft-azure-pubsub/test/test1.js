var azure = require("../index.js");
var config = require("../config.json");
var sleep = require('sleep');

var azure = new azure(config);
azure.connect();

count = 0;
var result = [];


while (count < 50)
{
  sleep.msleep(200);
  result.push({ devId : 'sensor-4321', 
		value : Math.floor((Math.random() * 30) + 60), 
		sensorType : "temp",
		timestamp : Math.floor(Date.now()/1000)
	      });
  count++;
}

//console.log(result);

data = { 
    devId: "5678",
    value : 80,
    sensorType : "temp",
    timestamp : Date.now()
}

azure.write(result);

var date = new Date();
date.setDate(date.getDate() - 1);
 
azure.read({
     devId : "sensor-4321",
     timestamp : Date.parse(date)/1000
});

