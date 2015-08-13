var ibm = require("../index.js");
var config = require("../config.json");
var sleep = require('sleep');

var ibm = new ibm(config);
ibm.connect();

count = 0;
var result = [];


while (count < 50)
{
  sleep.sleep(1);
  result.push({ sensor_id : 'light',
  value : (Math.random() * 30) + 60,
  timestamp : Date.now()
});
count++;
}

ibm.write(result);

ibm.read({
  "sensor_id" : "light"
}, function(err, res){
  // if(!err) console.log(res);
});
