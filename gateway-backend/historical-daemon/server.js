//------------------------------------------------------------------------------
// cloud-manager-daemon.js
// This daemon is responsible for reading historical data from the cloud and
// sending it over REST APIs for plotting graph
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

var express = require('express');
var cors = require('cors');
var moment = require('moment');


// Setup a logging system in this daemon
var winston = require('winston');
//winston.add(winston.transports.File, { filename: 'cloudd.log' });

var app = express();

// For cross-origin requests
app.use(cors());
app.listen(4000);

// Add the console logger if debug is set to "true" in the config
if (config.debug != "true") {
  winston.remove(winston.transports.Console);
  //  winston.logger.transports.console.level = 'debug';
}

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

function getDataFromCloud(cloud_provider, req, callback) {
  cloud_provider.connect();
  readQuery = {};
  if(req.query.id) {
    console.log('sensor_id: ' + req.query.id);
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
      console.log(err);
    }  else {
      console.log('In Historic data daemon - Data received from Azure cloud');
      res.send(this.sensorData);
    }
  })
});

app.get(config.path.datastore, function (req, res) {
  // TODO: Code to select database here
  getDataFromCloud(google, req, function(err){
    if(err) {
      console.log(err);
    }  else {
      console.log('In Historic data daemon - Data received from Google cloud');
      res.send(this.sensorData);
    }
  })
});
