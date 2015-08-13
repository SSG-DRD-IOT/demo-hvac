var ibm = require("../index.js");
var config = require("../config.json");

var ibm = new ibm(config);
ibm.connect();

count = 0;
var result = [];


while (count < 50)
{
  result.push({ sensor_id : 'light',
  value : (Math.random() * 30) + 60,
  timestamp : Math.floor((Math.random() * 542356) + 789876)
});
count++;
}

ibm.write(result);

ibm.read({
  "sensor_id" : "light"
}, function(err, res){
  // if(!err) console.log(res);
});
