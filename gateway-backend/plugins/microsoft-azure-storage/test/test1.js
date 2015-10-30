var azure = require("../index.js");
var config = require("../config.json");

var azure = new azure(config);

azure.connect(config);

// azure.delete();
// return;

count = 0;
var result = [];

while (count < 10)
{
  result.push({ sensor_id : 'sensor-4321',
		value : (Math.random() * 30) + 60,
		timestamp : Date.now()
	      });
  count++;
}

// azure.write(result);
// return;
var date = new Date();
date.setDate(date.getDate() - 1);

azure.read({
     sensor_id : "sensor-4321"
}, function(err, res){
  if(err) console.log(err);
  else console.log(res);
});
