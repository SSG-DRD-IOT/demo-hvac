//------------------------------------------------------------------------------
// historical-daemon.js
// This daemon is responsible for reading historical data from the cloud
// and making it available over a RESTful API to the administration console

//
// Currently, this daemon supports four cloud providers:
//     1. Microsoft Azure
//     2. IBM BlueMix
//
// The daemon starts a server using express and provides REST APIs to retrieve
// stored data from requested cloud providers.


// Load the application specific configurations
var config = require("./config.json");

// Lodash is a functional library for manipulating data structures
var _ = require("lodash");


var Azure = require('intel-commerical-iot-microsoft-azure-pubsub');
var Bluemix = require('intel-commerical-iot-ibm-bluemix-pubsub');

// Import the Database Model Objects
var DataModel = require('intel-commerical-iot-database-models').DataModel;
var SensorCloudModel = require('intel-commerical-iot-database-models').SensorCloudModel;

// Setup the Azure and Google objects
var azure = new Azure(config.microsoftAzure);
var bluemix = new Bluemix(config.ibmBluemix);

// Express helps to provide RESTful API interfaces
var express = require('express');
var cors = require('cors');

// Manipulates time and date strings
var moment = require('moment');

var logger = require('./logger.js');

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

function formatDataForPlot(results, name){
    values = [];
    for(i in results) {
      entity = {};
        entity.x = results[i].timestamp;
        entity.y = results[i].value;
        values.push(entity);
    }
    graphData = [{
      "name" : name,
      "color" : config.color,
      "data" : values
    }];
    sensorData = {"values": values};
    //logger.log(sensorData);
}

function getDataFromCloud(cloud_provider, req, callback) {
    cloud_provider.connect();
    readQuery = {};
    name = req.query.id;
    //logger.info(req);
    if(name) {
        logger.log('sensor_id: ' + name);
        readQuery.sensor_id = name;
    } else { // Just for fail proof
        readQuery.sensor_id = 'b506768ce1e2353fe063d344e89e53e5';
    }

    cloud_provider.read(readQuery, function(err, results){
        if(!err) {
            //logger.info(results);
            formatDataForPlot(results, name);
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
            res.send(graphData);
        }
    });
});

app.get(config.path.bluemix, function (req, res) {

    getDataFromCloud(bluemix, req, function(err){
        if(err) {
            logger.error(err);
        }  else {
            logger.log("In Historic data daemon - Data received from IBM Bluemix");
            res.send(graphData);
        }
    });
});
