var azure = require("../index.js");
var config = require("../config.json");

var azure = new azure(config);

azure.connect(function(status)
{
  if(status) {
    console.log('Connected successfully');
  } else {
    console.log('Connection failed');
  }
});

// azure.delete();
// return;

count = 0;
result = [];


while (count < 50)
{
  result.push({ sensor_id : 'temperature',
		value : Math.floor((Math.random() * 30) + 60),
		timestamp : Math.floor((Math.random() * 542356) + 789876)
	      });
  count++;
}

//console.log(result);

// azure.write(result);
// return;

azure.read({
     sensor_id : "temperature"
}, function(err, res){
  if(err) console.log(err);
  // else console.log(res);
});
