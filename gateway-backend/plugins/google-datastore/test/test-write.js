var config = require("./config.json");
var GoogleDataStoreCloud = require("../index.js");
var sleep = require('sleep');

var googleDataStoreCloud = new GoogleDataStoreCloud(config);

count = 0;
result = [];
while (count < 5)
{
  sleep.sleep(1);
  result.push({ 'devId' : 'sensor-4321', 
		'value' : (Math.random() * 30) + 60, 
		'sensorType' : 'temp',
		'timestamp' : Date.now()
	      });
  count++;
}

googleDataStoreCloud.write(result);

var date = new Date();
date.setDate(date.getDate() - 1);


googleDataStoreCloud.read({
		devId: 'sensor-4321',
		timestamp: Date.parse(date)	
		});


