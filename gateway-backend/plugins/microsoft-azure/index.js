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
var azureTable = require('azure-table-node');

// Lodash is a functional library for manipulating data structures
var _ = require("lodash");

// Setup a logging system in this plugin
var logger = require('./logger.js');

var winston = require('winston');

function azure(json) {
  var self = this;
  self.config = json;
  self.client;
  self.dataQuery = {};

  if(self.config.debug != "true") {
    logger.remove(winston.transports.Console);
    logger.remove(winston.transports.File);
  }

  azure.prototype.connect = function(){

    //  logger.info('Azure: Entered connect function');
    azureTable.setDefaultClient({
      accountUrl: 'http://' + self.config.accountName + '.table.core.windows.net/',
      accountName: self.config.accountName,
      accountKey: self.config.accessKey,
      timeout: 10000
    });

    self.client = azureTable.getDefaultClient();


    if(self.client) {
      self.client.createTable(self.config.table, function(err, resp) {
        if(err) {
          if(err.statusCode == 409) {
            logger.info('Azure - Table already exists');
          } else {
            logger.error('Azure - Table creation failed');
            logger.error('Azure - Connection failed');
            logger.error(err);
          }
        } else {
          logger.info('Azure - Connected successfully');
        }
      });
    } else {
      logger.error('Azure - Connection failed');
    }

  };


  azure.prototype.write = function(data) {

    // logger.info('Azure - Write function');
    for(i in data) {
      entity = data[i];
      entity['PartitionKey'] = entity.sensor_id.toString();
      entity['RowKey'] = entity.timestamp.toString();

      self.client.insertOrReplaceEntity(self.config.table, entity, function(err, results){
        if(err){
          logger.error('Azure - Data sending failed');
          logger.error(err);
        } else {
          logger.info('Azure - Data sent successfully');
          //logger.info(results);
        }
      });
    }

  };


  azure.prototype.read = function(readQuery, callback) {

    //  logger.log('Azure - Read function');
    if(readQuery.timestamp) {
      self.dataQuery = azureTable.Query.create('PartitionKey', '==', readQuery.sensor_id).and('timestamp', '>=', readQuery.timestamp);
    } else {
      self.dataQuery = azureTable.Query.create('PartitionKey', '==', readQuery.sensor_id);
    }

    self.client.queryEntities(self.config.table, {
      query: self.dataQuery
      // onlyFields: ['sensor_id', 'timestamp', 'value']
    }, function(err, results, continuation) {
      if(err) {
        logger.error('Azure - Data read failed');
      } else {
        _.map(results, function(d) {delete d.Timestamp; delete d.RowKey; delete d.PartitionKey});
        logger.info("Azure - Data recieved: %d", results.length);
        //logger.info(results);
      }
      callback(err, results);
    });
  };

  azure.prototype.delete = function() {
    self.client.deleteTable(self.config.table, function (err, resp) {
      if(err) logger.error(err);
      else logger.info('Table deleted');
    });
  };

}
module.exports = azure;
