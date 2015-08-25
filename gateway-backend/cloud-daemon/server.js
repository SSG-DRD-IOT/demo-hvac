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
// cloud-manager-daemon.js
// This daemon is responsible for reading all of the sensor values from the
// Intel Iot Gateway and storing them in the cloud
//
// Currently, this daemon supports four cloud providers:
//     1. Microsoft Azure
//     2. IBM BlueMix
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

var Azure = require('intel-commerical-iot-microsoft-azure-pubsub');
var Bluemix = require('intel-commerical-iot-ibm-bluemix-pubsub');

// Import the Database Model Objects
var DataModel = require('intel-commerical-iot-database-models').DataModel;
var SensorCloudModel = require('intel-commerical-iot-database-models').SensorCloudModel;

var logger = require('./logger.js');

// Setup the Azure and Google objects
var azure = new Azure(config.microsoftAzure);
var bluemix = new Bluemix(config.ibmBluemix);

// Establish connection to cloud providers
azure.connect();
bluemix.connect();

var utils = {
    getSensorIDs: function (data) {
        return _.uniq(_.pluck(data, "sensor_id"));
    }
};

module.exports = utils;

// Steps
// 1. Set Interval to 60 seconds
// 2. Get the values for each sensor
// 4. Get the cloud providers for each sensor
// 5. Group data by cloudprovider_id
// 6. Write the data to the cloud

// This server retrieves data from the cloud on configurable interval
setInterval(function() {
    var data = DataModel.find({}, function (err, data) {

        // Find all the unique sensor_id in the
        // data just pulled from the database
        var sensor_ids = getSensorIDs(data);

        // Retrieve all relations between sensors and clouds
        sensorCloudModel
            .find_sensor_cloud_data_relations(
                function(err, results) {

                    logger.info("Database returned " + results.length + " sensorReadings");

                    // Group all the data by sensor_id
                    var data_by_cloudprovider = _.groupBy(
                        results,
                        function(k) {
                            return  k.cloudprovider_id;
                        });



                    _.forEach(
                        data_by_cloudprovider,
                        function(data, cloudprovider_id) {
                            logger.info("Cloudprovider_id:", cloudprovider_id);
                            // logger.info(JSON.stringify(data, null, ' '));
                            logger.info("----------------------------------------");

                            if (cloudprovider_id == 1) {
                                logger.info("Writing to Microsoft Azure");
                                azure.write(data);
                            } else if (cloudprovider_id == 2) {
                                bluemix.write(data);
                                logger.info("Writing to IBM BlueMix");
                            } else if (cloudprovider_id == 3) {
                                logger.info("Writing to Google DataStorage");
                                // google.write(data);
                            } else if (cloudprovider_id == 4) {
                                logger.info("Writing to Amazon Kinesis");
                            }
                        });
                    logger.info("Deleting all sensor readings from the Database");

                    DataModel.remove({}, function(err) {
                        if (err) {
                            logger.error(err);
                        } else {
                            logger.info('Removed all Data from MongoDB');
                        }
                    });
                });
    }, config.interval);
});
