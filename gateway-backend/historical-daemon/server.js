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
var Bluemix = require('intel-commerical-iot-ibm-bluemix-pubsub');

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
var bluemix = new Bluemix(config.ibmBluemix);

// Express helps to provide RESTful API interfaces
var express = require('express');
var cors = require('cors');

// Manipulates time and date strings
var moment = require('moment');

// Setup a logging system in this daemon
var winston = require('winston');

var logger = new (winston.Logger)({
  levels: {
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
  },
  colors: {
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
  },
  transports: [
    new (winston.transports.Console)(
      {
        level: 'trace',
        prettyPrint: true,
        colorize: true,
        silent: false,
        timestamp: false
      }),
      new (winston.transports.File)({
        prettyPrint: false,
        level: 'info',
        silent: false,
        colorize: true,
        timestamp: true,
        filename: './historical-daemon.log',
        maxsize: 400000,
        maxFiles: 10,
        json: false
      })]
    });

    // Create the express application
    var app = express();

    if(config.debug != "true") {
      logger.remove(winston.transports.File);
      logger.remove(winston.transports.Console);
    }

    // For cross-origin requests
    app.use(cors());

    // Listen on port 4000
    app.listen(4000);

    function formatDataForPlot(results){
      sensorData = {"timestamp" : [], "values" : []};
      duplicateValues = [];
      for(i in results) {
        sensorData.timestamp.push(moment(results[i].timestamp).format("YYYY-MM-DD HH:mm:ss"));
        duplicateValues.push(results[i].value);
      }
      sensorData.values.push(duplicateValues);
      sensorData.values.push(duplicateValues);
      //logger.log(this.sensorData);
    }

    function getDataFromCloud(cloud_provider, req, callback) {
      cloud_provider.connect();
      readQuery = {};
      //logger.info(req);
      if(req.query.id) {
        logger.log('sensor_id: ' + req.query.id);
        readQuery.sensor_id = req.query.id;
      } else { // Just for fail proof
        readQuery.sensor_id = 'b506768ce1e2353fe063d344e89e53e5';
      }

      cloud_provider.read(readQuery, function(err, results){
        if(!err) {
          //logger.info(results);
          formatDataForPlot(results);
        }
        callback(err);
      });
    }

    app.get(config.path.azure, function (req, res) {

      getDataFromCloud(azure, req, function(err){
        if(err) {
          logger.error(err);
        } else {
          logger.log("In Historic data daemon - Data received from Azure cloud");
          //logger.info(results);
          res.send(this.sensorData);
        }
      })
    });

    app.get(config.path.bluemix, function (req, res) {

      getDataFromCloud(bluemix, req, function(err){
        if(err) {
          logger.error(err);
        }  else {
          logger.log("In Historic data daemon - Data received from IBM Bluemix");
          res.send(this.sensorData);
        }
      })
    });
