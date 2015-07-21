var azureTable = require('azure-table-node');

// Lodash is a functional library for manipulating data structures
var _ = require("lodash");

// Setup a logging system in this daemon
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'microsoft-azure-plugin.log' })
  ]
});

function azure(json) {
  var self = this;
  self.config = json;
  self.client;
  self.dataQuery = {};

  if(self.config.debug != "true") {
    logger.remove(winston.transports.Console);
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
