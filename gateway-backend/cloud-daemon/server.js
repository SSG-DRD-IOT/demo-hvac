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
var Bluemix = require('intel-commerical-iot-ibm-bluemix-pubsub');

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
            filename: './trigger-daemon.log',
            maxsize: 40000,
            maxFiles: 10,
            json: false
        })]
    });

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


if(config.debug != "true") {
  logger.remove(winston.transports.Console);
}

// Establish a connection to Microsoft Azure
azure.connect(function(status)
{
  if(status) {
    console.log('Connected successfully');
  } else {
    console.log('Connection failed');
  }
});
// Steps
// 1. Set Interval to 60 seconds
// 2. Get the values for each sensor
// 4. Get the cloud providers for each sensor
// 5. Group data by cloudprovider_id
// 6. Write the data to the cloud

// This server retrieves data from the cloud on configurable interval
setInterval(function() {
  var data = dataModel.find( function (err, data) {

    // Find all the unique sensor_id in the
    // data just pulled from the database
    var sensor_ids = _.uniq(_.pluck(data, "sensor_id"));

    // logger.info("Sensor_ids in the retrieved data");
    // logger.info(sensor_ids);
    // logger.info("----------------------------------------");

    // Retrieve all relations between sensors and clouds
    sensorCloudModel
    .find_sensor_cloud_data_relations(
      function(err, results) {

          logger.info("Database returned " + results.length + " sensorReadings");
        // logger.info("Sensor/Cloud relations");
        // logger.info(results);

        // Group all the data by sensor_id
        var data_by_cloudprovider = _.groupBy(
          results,
          function(k) {
            return  k.cloudprovider_id;
          });

          // logger.info("Grouped");
          // logger.info(data_by_cloudprovider);

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
            dataModel.delete_all_data();
          });


        });
      }, config.interval);
