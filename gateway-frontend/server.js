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
var config = require('./config.json');

var cors = require('cors');
var bodyParse = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect(config.mongodb.host);
var mdb = mongoose.connection;

mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {
    console.log("Connection to MongoDB successful");
});

// Import the Database Model Objects
var Data = require('intel-commerical-iot-database-models').DataModel;
var Sensor = require('intel-commerical-iot-database-models').SensorModel;
var Actuator = require('intel-commerical-iot-database-models').ActuatorModel;
var Trigger = require('intel-commerical-iot-database-models').TriggerModel;
var Error = require('intel-commerical-iot-database-models').ErrorModel;

var express = require('express');
var restapi = express();
restapi.use(cors());
restapi.use(bodyParse());
restapi.use(express.static(__dirname + '/app'));



// API to get list from Error table
restapi.get('/listerror', function(req, res){
    Error.find({}, function(err, errors) {
        res.json(errors);
    });
});




// API to get list from actuator table
restapi.get('/listActuator', function(req, res){
    Actuator.find({}, function(err, actuators) {
        res.json(actuators);
    });
});


// API to get data from Sensors table
restapi.get('/listSensor', function(req, res){
    Sensor.find({}, function(err, sensors) {
        res.json(sensors);
    });
});


// API to get data from Triggers table
restapi.get('/listTrigger', function(req, res){
    Trigger.find({}, function(err, triggers) {
        res.json(triggers);
    });
});


// API to get Number of Sensors which are active
restapi.get('/noOfSensor', function(req, res){
    Sensor.count({}, function(err, n) {
        res.json(n);
    });
});

// API to get Number of Sensors which are active
restapi.get('/noOfError', function(req, res){
    Error.count({}, function(err, n) {
        res.json(n);
    });
});


// API to get Number of Actuators which are active
restapi.get('/noOfActuator', function(req, res){
    Actuator.count({}, function(err, n) {
        res.json(n);
    });
});


// API to get Number of Triggers which are active
restapi.get('/noOfTrigger', function(req, res){
    Trigger.count({}, function(err, n) {
        res.json(n);
    });
});


// To remove a trigger from database
restapi.post('/removeTrigger',function(req,res){
    Trigger.remove({id:  req.param('id')}, function(err) {
        if (err){
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});

// To add a new trigger to database
restapi.post('/addTrigger',function(req,res){
    var trigger = new Trigger({
        id: req.param("id"),
        name: req.param("name"),
        sensor_id: req.param("sensor"),
        actuator_id: req.param("actuator"),
        validator_id: req.param("validator"),
        condition: req.param("conditions"),
        triggerFunc: req.param("control")
    });

    trigger.save(function(err, row){
        if (err){
            res.json(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});

// To get api according to actuator Id
//restapi.post('/getApi',function(req,res){
   // db.all("SELECT api FROM actuators WHERE id =\'" + req.param('id') +"\'" , function(err, row){
  //      if (err){
    //        console.err(err);
     //       res.status(500);
      //  }
       // else {
        //    res.json(eval(row));
        //}
        //res.end();
    //});
//});

// API to send sensor data for charts
// restapi.get('/getSensorData',function(req,res){
//     db.all("SELECT data,timestamp FROM data WHERE sensor_id =\'" + req.param('sensorId') +"\'" , function(err, rows){
//         if (err){
//             console.err(err);
//             res.status(500);
//         }
//         else {
//             //      console.log(JSON.stringify(rows));
//             //  var data = _.pluck(rows,'data');
//             // var timestamp = _.pluck(rows,'timestamp');
//             var dt = {
//                 timestamp: ["2015-06-24 23:42:12","2015-06-24 23:42:14","2015-06-24 23:42:15","2015-06-24 23:42:16","2015-06-24 23:42:17","2015-06-24 23:42:18","2015-06-24 23:42:19","2015-06-24 23:42:20","2015-06-24 23:42:21","2015-06-24 23:42:22"],
//                 values: [[75.2,74.57,75.04,74.88,74.26,74.57,73.95,74.73,74.1,74.26],
//                          [75.2,74.57,75.04,74.88,74.26,74.57,73.95,74.73,74.1,74.26]]}
//             // var dt = ('{labels:[" + data + "], data:[" +timestamp+ "]}')

//             res.json(dt);
//         }
//         res.end();
//     });
// });

// Api to customize cloud data
//restapi.get('/getCustomizeCloud', function(req, res){
 //   var sql = "SELECT sensors.name AS sensorName, cloudproviders.name AS cloudName, sensors.id AS sensorId, cloudproviders.id AS cloudId FROM cloudproviders, sensors, sensors_clouds WHERE sensors_clouds.sensor_id = sensors.id AND cloudproviders.id = sensors_clouds.cloudprovider_id "
    //  console.log(sql);
   // db.all(sql, function(err,rows){
    //    res.json(rows);
    //});
//});


// Api to redirect to Angular.JS website
restapi.get('*', function(req, res) {
    res.sendFile('./app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

restapi.listen(8080);


console.log("Submit GET or POST Request. e.g http://localhost:8080");
