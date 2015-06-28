//------------------------------------------------------------------------------
// historical-daemon.js
// This daemon is responsible for reading historical data from the cloud
// and making it available over a RESTful API to the administration console

//
// Currently, this daemon supports four cloud providers:
//     1. Amazon Kinesis
//     2. Microsoft Azure
//     3. Google DataStorage
//     4. IBM BlueMix
//
// The daemon starts a server using express and provides REST APIs to retrieve
// stored data from requested cloud providers.


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

// Express helps to provide RESTful API interfaces
var express = require('express');
var cors = require('cors');

// Manipulates time and date strings
var moment = require('moment');

// Setup a logging system in this daemon
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'cloud-manager-daemon.log' })
    ]
});

// Create the express application
var app = express();

// For cross-origin requests
app.use(cors());

// Listen on port 4000
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
  logger.log(this.sensorData);
}

function getDataFromCloud(cloud_provider, req, callback) {
  cloud_provider.connect();
  readQuery = {};
  if(req.query.id) {
    logger.log('sensor_id: ' + req.query.id);
    readQuery.sensor_id = req.query.id;
  } else {
    readQuery.sensor_id = 'b506768ce1e2353fe063d344e89e53e5';
  }

  cloud_provider.read(readQuery, function(err, results){
    if(!err) {
      //console.log(results);
      formatDataForPlot(results);
    }
    callback(err);
  });
}

app.get(config.path.azure, function (req, res) {
  // TODO: Code to select database here
  getDataFromCloud(azure, req, function(err){
    if(err) {
      logger.log(err);
    } else {
      logger.log('In Historic data daemon - Data received from Azure cloud');
      //logger.log(results);
      res.send(this.sensorData);
    }
  })
});

app.get(config.path.datastore, function (req, res) {
  // TODO: Code to select database here
  getDataFromCloud(google, req, function(err){
    if(err) {
      logger.log(err);
    }  else {
      logger.log('In Historic data daemon - Data received from Google cloud');
      res.send(this.sensorData);
    }
  })
});
