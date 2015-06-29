var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// Lodash is a functional library for manipulating data structures
var _ = require("lodash");

// Setup a logging system in this daemon
var winston = require('winston');

function ibm(json){
  var self = this;
  self.config = json;
  self.db;
  self.dataQuery = {};

  self.logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'ibm-bluemix-plugin.log' })
    ]
  });

  if(self.config.debug != "true") {
    self.logger.remove(winston.transports.Console);
  }


  ibm.prototype.connect = function() {
    // self.logger.info("Entered connect function! DB : " + self.config.db);
    self.db = MongoClient.connect(self.config.url, function(err, db) {
      if(err) {
        self.logger.error("IBM - Connection failed");
        self.logger.error(err);
      } else {
        self.logger.info("IBM - Connected successfully");
      }
    } );
  };

  ibm.prototype.write = function(data) {
    // logger.log('Entered write function!');
    self.db = MongoClient.connect(self.config.url, function(err, db) {
      if(err) {
        self.logger.error("IBM - Connection failed");
        self.logger.error(err);
      } else {
        self.logger.info("IBM - Connected successfully");
        self.collection = db.collection(self.config.db);
        self.collection.insert(data, function(err, result) {
          if(err) {
            self.logger.error("IBM - Data sending failed");
            self.logger.error(err);
          } else {
            self.logger.info("IBM - Data sent successfully");
            // self.logger.info(result);
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
        self.logger.error("IBM - Connection failed");
        self.logger.error(err);
      } else {
        self.logger.info("IBM - Connected successfully");
        self.collection = db.collection(self.config.db);
        self.collection.find(self.dataQuery).toArray(
          function(err, items) {
            if(err) {
              self.logger.error("IBM - Data receive failed");
              self.logger.error(err);
            } else {
              _.map(items, function(d) {delete d._id;});
              self.logger.info("IBM - Data received: %d", items.length);
              // self.logger.info(JSON.stringify(items, null, '  '));
            }
            callback(err, items);
          });
        }
      });
    };
  }

  module.exports = ibm;
