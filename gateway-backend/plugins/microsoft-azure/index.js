var azureTable = require('azure-table-node');

// Setup a logging system in this daemon
var winston = require('winston');

function azure(json) {
  this.config = json;
  this.accountName = this.config.accountName;
  this.table = this.config.table;
  this.partitionKey = this.config.partitionKey;
  this.client;
  this.dataQuery = "";

  winston.add(winston.transports.File, { filename: 'microsoft-azure.log' });

  // Add the console logger if debug is set to "true" in the config
  if (this.config.debug != "true") {
    winston.remove(winston.transports.Console);
    //  winston.logger.transports.console.level = 'debug';
  }

  azure.prototype.connect = function(callback){

    //  console.log('Azure: Entered connect function');
    azureTable.setDefaultClient({
      accountUrl: 'https://' + this.accountName + '.table.core.windows.net/',
      accountName: this.accountName,
      accountKey: this.config.accessKey,
      timeout: 10000
    });

    this.client = azureTable.getDefaultClient();

    // Test code delete table before creating


    if(this.client) {
      this.client.createTable(this.table, function(err, resp) {
        if(err) {
          if(err.statusCode == 409) {
            console.log('Azure - Table already exists');
          } else {
            console.log('Azure - Table creation failed'); }
          } else {
            console.log('Azure - Table created successfully');
          }
        });
      } else {
        console.log('Azure - Connection failed');
      }

    };


    azure.prototype.write = function(data) {

      console.log('Azure - Write function');

      // Batch write does n't seem to work
      //  var batchClient = this.client.startBatch();


      for(i in data) {
        entity = data[i];
        entity['PartitionKey'] = entity.sensor_id.toString();
        entity['RowKey'] = entity.timestamp.toString();

        // Logging entities to be sent
        console.log(entity);
        this.client.insertOrReplaceEntity(this.table, entity, function(err, results){
          if(err){
            console.log('Azure - Data Failed');
            console.log(err);
            //callback(err, results);
          } else {
            console.log('Azure - Data stored');
            //console.log(results);
            //callback(err, results);
          }
        });
      }

    };


    azure.prototype.read = function(readQuery, callback) {

      //  console.log('Azure - Read function');
      if(readQuery.timestamp) {
        this.dataQuery = azureTable.Query.create('PartitionKey', '==', readQuery.sensor_id).and('timestamp', '>=', readQuery.timestamp);
      } else {
        this.dataQuery = azureTable.Query.create('PartitionKey', '==', readQuery.sensor_id);
      }

      this.client.queryEntities(this.table, {
        query: this.dataQuery,
        onlyFields: ['sensor_id', 'timestamp', 'value']
      }, function(err, results, continuation) {
        if(err) {
          console.log('Azure - Data read failed!');
        } else {
          console.log('Azure - Data Recieved!');
          //console.log(results);
        }
        callback(err, results);
      });
    };

    azure.prototype.delete = function() {
      this.client.deleteTable(this.table, function (err, resp) {
        if(err) console.log(err);
        else console.log('Table deleted');
      });
    };

  }
  module.exports = azure;
