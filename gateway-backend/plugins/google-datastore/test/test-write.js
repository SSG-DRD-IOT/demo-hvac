var config = require("./test-write.json");
var GoogleDataStoreCloud = require("../index.js");
var sleep = require('sleep');

var googleDataStoreCloud = new GoogleDataStoreCloud(config);
/*
// googleDataStoreCloud.delete({sensor_id : 'b506768ce1e2353fe063d344e89e53e5'});
// return;

count = 0;
result = [];
while (count < 5)
{
  sleep.usleep(6453);
  result.push({ 'sensor_id' : 'sensor-4321',
  'value' : (Math.random() * 30) + 60,
  'timestamp' : Date.now()
});
count++;
}

googleDataStoreCloud.write(result);

var date = new Date();
date.setDate(date.getDate() - 1);

*/
googleDataStoreCloud.read({
  sensor_id: 'b506768ce1e2353fe063d344e89e53e5'
}, function(err, res){
  if(err) console.log(err);
  else console.log(res);
});
