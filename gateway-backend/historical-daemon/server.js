//------------------------------------------------------------------------------
// cloud-manager-daemon.js
// This daemon is responsible for reading all of the sensor values from the
// Intel Iot Gateway and storing them in the cloud
//
// Currently, this daemon supports four cloud providers:
//     1. Amazon Kinesis
//     2. Microsoft Azure
//     3. Google DataStorage
//     4. IBM BlueMix
//
// The daemon retrieves all new data from the database every 60 seconds
// and retrieves the associations between sensors and cloud providers
// and store the data in blocks on the cloud providers that are configured
// as destinations.

// Load the application specific configurations
var config = require("./config.json");

// Lodash is a functional library for manipulating data structures
var _ = require("lodash");

// Load the I/O and connectivity libraries
var mqtt = require('mqtt');
var sqlite3 = require('sqlite3').verbose();
var Azure = require('intel-commerical-iot-microsoft-azure-pubsub');
var Google = require('intel-commerical-iot-google-datastore-pubsub');

// Create a connection to a SQLITE3 database
var db = new sqlite3.Database(config.sqlite3.file);

// Import the Database Model Objects
var DataModel = require('intel-commerical-iot-database-models').DataModel;
var SensorCloudModel = require('intel-commerical-iot-database-models').SensorCloudModel;

// Setup a model for the relations between sensors and clouds
var sensorCloudModel = new SensorCloudModel(db);
var dataModel = new DataModel(db);

// Setup the Azure and Google objects
var azure = new Azure(config.microsoftAzure);
var google = new Google(config.googleDatastore);

var express = require('express');
var cors = require('cors');
var moment = require('moment');


// Setup a logging system in this daemon
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'cloudd.log' });

// Add the console logger if debug is set to "true" in the config
if (config.debug != "true") {
  winston.remove(winston.transports.Console);
  //  winston.logger.transports.console.level = 'debug';
}

var app = express();

app.use(cors());
app.listen(4000);

function formatDataForPlot(results){
  this.sensorData = {"timestamp" : [], "values" : []};
  this.duplicateValues = [];
  for(i in results) {
    this.sensorData.timestamp.push(moment(results[i].timestamp).format('h:mm:ss a'));
    this.duplicateValues.push(results[i].value);
  }
  this.sensorData.values.push(this.duplicateValues);
  this.sensorData.values.push(this.duplicateValues);
  console.log(this.sensorData);
}

app.get('/api/v0001/historic/data', function (req, res) {
  // TODO: Code to select database here
  azure.connect();
  readQuery = {};
  if(req.query.id) {
    console.log('sensor_id: ' + req.query.id);
    readQuery.sensor_id = req.query.id;
  } else {
    readQuery.sensor_id = 'b506768ce1e2353fe063d344e89e53e5';
  }
  azure.read(readQuery, function(err, results){
    if(err) {
      console.log(err);
    } else {
      console.log('In Historic data daemon - Data received from Azure cloud');
      //console.log(results);
      formatDataForPlot(results);
      res.send(this.sensorData);
    }
  });
});
