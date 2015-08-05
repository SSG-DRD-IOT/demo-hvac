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
// var sqlite3 = require('sqlite3').verbose();

var Azure = require('intel-commerical-iot-microsoft-azure-pubsub');
var Bluemix = require('intel-commerical-iot-ibm-bluemix-pubsub');

var logger = require('./logger.js');

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
