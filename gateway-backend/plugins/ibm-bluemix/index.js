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
