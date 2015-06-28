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

// Establish a connection to Microsoft Azure
azure.connect();

// Setup a logging system in this daemon
var winston = require('winston');

// Steps
// 1. Set Interval to 60 seconds
// 2. Get all Active Sensor IDs from sensors table
// 3. Get the values for each sensor
// 4. Get the cloud providers for each sensor
// 5. Send data to each cloud

// Add the console logger if debug is set to "true" in the config

 var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'cloud-manager-daemon.log' })
    ]
  });


var data = dataModel.find( function (err, data) {

    // Find all the unique sensor_id in the
    // data just pulled from the database
    var sensor_ids = _.uniq(_.pluck(data, "sensor_id"));

    // console.log("Sensor_ids in the retrieved data");
    // console.log(sensor_ids);
    // console.log("----------------------------------------");

    // Retrieve all relations between sensors and clouds
    var sensor_clouds = sensorCloudModel
            .find_sensor_cloud_data_relations(
                function(err, results) {

                    console.log("Sensor/Cloud relations");
                    console.log(results);

                    // Group all the data by sensor_id
                    var data_by_cloudprovider = _.groupBy(
                        results,
                        function(k) {
                            return  k.cloudprovider_id;
                        });

                    console.log("Grouped");
                    console.log(data_by_cloudprovider);

                    console.log("Data");
                    _.forEach(
                        data_by_cloudprovider,
                        function(data, cloudprovider_id) {
                            console.log("Cloudprovider_id:", cloudprovider_id);
                            console.log(data);
                            console.log("----------------------------------------");

                            if (cloudprovider_id == 1) {
                                console.log("Writing to Azure");
                                azure.write(data);
                            } else if ( cloudprovider_id == 3) {
                                // console.log("Writing to Google");
                                // google.write(data);
                            }
                        });
                });


});


// google.read({sensor_id: 'b506768ce1e2353fe063d344e89e53e5'}, function(err, results){
//      if(err) {
//  	console.log(err);
//      } else {
//  	console.log('In cloudd - Data received from Google cloud');
//  	console.log(results);
//      }
//  });

// azure.read({sensor_id: 'b506768ce1e2353fe063d344e89e53e5'}, function(err, results){
//     if(err) {
// 	console.log(err);
//     } else {
// 	console.log('In cloudd - Data received from Azure cloud');
// 	console.log(results);
//     }
// });
