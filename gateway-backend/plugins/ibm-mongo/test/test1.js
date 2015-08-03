var ibm = require("../index.js");
var config = require("../config.json");

var ibm = new ibm(config);
ibm.connect();

count = 0;
var result = [];


while (count < 5)
{
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

ibm.write(result);

var date = new Date();
date.setDate(date.getDate() - 1);


ibm.read({
     "devId" : "sensor-4321",
     "timestamp" : Date.parse(date)/1000
});
