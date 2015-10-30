var ibm = require("../index.js");
var config = require("../config.json");

var ibm = new ibm(config);
ibm.connect();

count = 0;
var result = [];


while (count < 5)
{
  result.push({ sensor_id : 'sensor-4321',
  value : (Math.random() * 30) + 60,
  timestamp : Math.floor(Date.now()/1000)
});
count++;
}

//console.log(result);

ibm.write(result);

var date = new Date();
date.setDate(date.getDate() - 1);

ibm.read({
  "sensor_id" : "sensor-4321",
  "timestamp" : Date.parse(date)/1000
}, function(err, res){
  if(!err) console.log(res);
});