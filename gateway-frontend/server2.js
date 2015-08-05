var mongoose = require('mongoose');
var config = require("./config.json");//Configuration information

mongoose.connect(config.mongodb.host);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to MongoDB successful");
});

var SensorModel = require('intel-commerical-iot-database-models').SensorModel;

SensorModel.find({}, function (err, triggers) {
    console.log(triggers);
});
