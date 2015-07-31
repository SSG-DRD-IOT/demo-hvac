var azureTable = require('azure-table-node');

// Lodash is a functional library for manipulating data structures
var _ = require("lodash");

// Setup a logging system in this daemon
var winston = require('winston');

function azure(json) {
  var self = this;
  self.config = json;
  self.client;
  self.dataQuery = {};

  self.logger = new (winston.Logger)({
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
      new (winston.transports.File)({
        prettyPrint: false,
        level: 'info',
        silent: false,
        colorize: true,
        timestamp: true,
        filename: './microsoft-azure-plugin.log',
        maxsize: 400000,
        maxFiles: 10,
        json: false
      }),
      new (winston.transports.Console)(
        {
          level: 'trace',
          prettyPrint: true,
          colorize: true,
          silent: false,
          timestamp: false
        })
      ]
    });

    if(self.config.debug != "true") {
      self.logger.remove(winston.transports.Console);
      self.logger.remove(winston.transports.File);
    }

    azure.prototype.connect = function(callback){

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
              result = true;
              self.logger.info('Azure - Table already exists');
            } else {
              self.logger.error('Azure - Table creation failed');
              self.logger.error('Azure - Connection failed');
              self.logger.error(err);
              result = false;
            }
          } else {
            result = true;
            self.logger.info('Azure - Connected successfully');
          }
          callback(result);
        });
      } else {
        self.logger.error('Azure - Connection failed');
      }

    };


    azure.prototype.write = function(data) {

      // logger.info('Azure - Write function');

      // Batch write does n't seem to work
      //  var batchClient = self.client.startBatch();


      for(i in data) {
        entity = data[i];
        entity['PartitionKey'] = entity.sensor_id.toString();
        entity['RowKey'] = entity.timestamp.toString();

        // Logging entities to be sent
        // logger.info(data);

        self.client.insertOrReplaceEntity(self.config.table, entity, function(err, results){
          if(err){
            self.logger.error('Azure - Data sending failed');
            self.logger.error(err);
          } else {
            self.logger.info('Azure - Data sent successfully');
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
          self.logger.error('Azure - Data read failed');
        } else {
          _.map(results, function(d) {delete d.Timestamp; delete d.RowKey; delete d.PartitionKey});
          self.logger.info("Azure - Data recieved: %d", results.length);
          //logger.info(results);
        }
        callback(err, results);
      });
    };

    azure.prototype.delete = function() {
      self.client.deleteTable(self.config.table, function (err, resp) {
        if(err) self.logger.error(err);
        else self.logger.info('Table deleted');
      });
    };

  }
  module.exports = azure;
