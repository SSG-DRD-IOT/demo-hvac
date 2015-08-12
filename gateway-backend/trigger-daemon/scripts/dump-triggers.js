var mongoose = require('mongoose');
var config = require("../config.json");//Configuration information

mongoose.connect(config.mongodb.uri);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to MongoDB successful");
});

var TriggerModel = require('intel-commerical-iot-database-models').TriggerModel;

TriggerModel.find({}, function (err, triggers) {
    console.log(triggers);
});
