var azure = require("../index.js");
var config = require("../config.json");
var util = require('util');

var azure = new azure(config);

azure.emit('connect');
console.log('After connect');

setInterval(function(){
  azure.emit('write', { sensor_id : 'sensor-4321',
  value : Math.floor((Math.random() * 30) + 60),
  timestamp : Math.floor((Math.random() * 542356) + 789876)
});
}, 1000);
// azure.delete();

console.log(util.inspect(azure.listeners('trigger')));

azure.on('trigger', function(data){
  console.log('Trigger : ');
  console.log(data);
});

return;

count = 0;
var result = [];


while (count < 50)
{
  //sleep.msleep(200);
  result.push({ sensor_id : 'sensor-4321',
		value : Math.floor((Math.random() * 30) + 60),
		timestamp : Math.floor((Math.random() * 542356) + 789876)
	      });
  count++;
}

//console.log(result);

data = {
    devId: "sensor-4321",
    value : 80,
    timestamp : Date.now()
}

azure.write(result);
// return;
var date = new Date();
date.setDate(date.getDate() - 1);

azure.read({
     sensor_id : "sensor-4321"
}, function(err, res){
  if(err) console.log(err);
  // else console.log(res);
});
