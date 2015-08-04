var azureStorage = require('azure-storage');

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
  self.tableService = azureStorage.createTableService(
    self.config.accountName, self.config.accessKey);

    if(self.config.debug != "true") {
      logger.remove(winston.transports.Console);
    }

    azure.prototype.connect = function(callback){

      logger.info('Azure: Entered connect function');

      self.tableService.createTableIfNotExists(self.config.table,
        function(error, result, response) {
          if (!error) {
            // result contains true if created; false if already exists
            if(result) {
              logger.info('Azure - Table created successfully');
            } else {
              logger.info('Azure - Table already exists');
            }
          } else {
            logger.error('Azure - Connection failed');
            logger.error(err);
          }
        });

      };


      azure.prototype.write = function(data) {

        logger.info('Azure - Write function');

        var batch = new azureStorage.TableBatch();

        var entGen = azureStorage.TableUtilities.entityGenerator;

        for(i in data) {
          entity = data[i];
          var azureEntity = {
            PartitionKey : entGen.String(entity.sensor_id),
            RowKey : entGen.String(entity.timestamp.toString())
          }

          for (var propertyName in entity) {
            azureEntity[propertyName] = entGen.String(entity[propertyName]);
          }

          // Logging entities to be sent
          // logger.info(data);
          // Add {echoContent: true} to get the inserted data in results
          console.log(azureEntity);
          batch.insertOrReplaceEntity(azureEntity);
        }
        self.tableService.executeBatch(self.config.table, batch,
          {echoContent: true}, function (error, result, response) {
            if(!error) {
              // Batch completed
              logger.info('Azure - Data sent successfully');
            } else {
              logger.error('Azure - Data sending failed');
              logger.error(error);
            }
          });
          // }

        };


        azure.prototype.read = function(readQuery, callback) {

          //  logger.log('Azure - Read function');
          //  Use select clause to retrieve just a few fields
          // .select['sensor_id', 'value']

          if(readQuery.timestamp) {
            self.dataQuery = new azureStorage.TableQuery()
            .top(50)
            .where('PartitionKey eq ?', readQuery.sensor_id)
            .and('timestamp ge ?', readQuery.timestamp);
          } else {
            self.dataQuery = new azureStorage.TableQuery()
            .top(50)
            .where('PartitionKey eq ?', readQuery.sensor_id);
          }

          var nextContinuationToken = null;
          var resp = null;

          self.tableService.queryEntities(self.config.table, self.dataQuery,
            nextContinuationToken, function(error, results) {
              if(error) {
                logger.error('Azure - Data read failed');
              } else {
                if (results.continuationToken) {
                  nextContinuationToken = results.continuationToken;
                }
                // console.log(JSON.stringify(results, null, '  '));
                logger.info("Azure - Data received: %d", results.entries.length);
                resp = results.entries;
                _.map(resp, function (entity)
                {
                  delete entity["PartitionKey"];
                  delete entity["RowKey"];
                  delete entity["Timestamp"];
                  delete entity[".metadata"];
                  for (var propertyName in entity) {
                      entity[propertyName] = entity[propertyName]["_"];
                  }
                });
                console.log('-----------------------------');
                // console.log(resp);
                //logger.info(results);
              }
              callback(error, resp);
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
