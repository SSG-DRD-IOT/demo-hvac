/*
 * Author: Daniel Holmlund <daniel.w.holmlund@Intel.com>
 * Copyright (c) 2015 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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

var winston = require('winston');

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
    for(i=0;i<50 && i<results.length;i++) {
      entity = {};
        entity.x = parseInt(i);
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
