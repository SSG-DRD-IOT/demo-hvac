var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// Lodash is a functional library for manipulating data structures
var _ = require("lodash");

// Setup a logging system in this plugin
var logger = require('./logger.js');
var winston = require('winston');

function ibm(json){
  var self = this;
  self.config = json;
  self.db;
  self.dataQuery = {};

  if(self.config.debug != "true") {
    logger.remove(winston.transports.Console);
    logger.remove(winston.transports.File);
  }


  ibm.prototype.connect = function() {
    // logger.info("Entered connect function! DB : " + self.config.db);
    self.db = MongoClient.connect(self.config.url, function(err, db) {
      if(err) {
        logger.error("IBM - Connection failed");
        logger.error(err);
      } else {
        logger.info("IBM - Connected successfully");
      }
    } );
  };

  ibm.prototype.write = function(data) {
    // logger.log('Entered write function!');
    self.db = MongoClient.connect(self.config.url, function(err, db) {
      if(err) {
        logger.error("IBM - Connection failed");
        logger.error(err);
      } else {
        logger.info("IBM - Connected successfully");
        self.collection = db.collection(self.config.db);
        self.collection.insert(data, function(err, result) {
          if(err) {
            logger.error("IBM - Data sending failed");
            logger.error(err);
          } else {
            logger.info("IBM - Data sent successfully");
            // logger.info(result);
          }
        });
      }
    });
  };

  ibm.prototype.read = function(readQuery, callback) {
    // logger.log("Entered read :" + query.timestamp);
    if(readQuery.timestamp) {
      self.dataQuery = { "timestamp": { $gt: readQuery.timestamp } };
    } else if(readQuery.sensor_id) {
      self.dataQuery = { "sensor_id": { $eq: readQuery.sensor_id } };
    }
    self.db = MongoClient.connect(self.config.url, function(err, db) {
      if(err) {
        logger.error("IBM - Connection failed");
        logger.error(err);
      } else {
        logger.info("IBM - Connected successfully");
        self.collection = db.collection(self.config.db);
        self.collection.find(self.dataQuery).toArray(
          function(err, items) {
            if(err) {
              logger.error("IBM - Data receive failed");
              logger.error(err);
            } else {
              _.map(items, function(d) {delete d._id;});
              logger.info("IBM - Data received: %d", items.length);
              // logger.info(JSON.stringify(items, null, '  '));
            }
            callback(err, items);
          });
        }
      });
    };
  }

  module.exports = ibm;
