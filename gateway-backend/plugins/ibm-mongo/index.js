var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var sleep = require('sleep');

function ibm(json){
  var self = this;
  self.dbName = json.db;
  self.url = json.url;
  self.dbClient;

  ibm.prototype.connect = function() {
    console.log('Entered connect function! DB : ' + this.dbName);
    this.db = MongoClient.connect(self.url, {
    db: {
      native_parser: false
    },
    server: {
      socketOptions: {
        connectTimeoutMS: 5000
      }
    },
    replSet: {},
    mongos: {}
  }, function(err, db) {
      if(err) {
        console.log("failed to connect to the database");
      } else {
	console.log("Connect - connected to database");
	self.dbClient = db;
      }
    } );
  };

  ibm.prototype.write = function(data) {
    console.log('Entered write function!');
    this.db = MongoClient.connect(self.url, function(err, db) {
      if(err) {
        console.log("failed to connect to the database");
      } else {
	console.log("Write - connected to database");
        this.collection = self.dbClient.collection(self.dbName);
        this.collection.insert(data, function(err, result) {
          if(err) {
	    console.log("Data sending failed");
          } else {
	    console.log("Data sent successfully")
          }
        });
      }
    });
  };

  ibm.prototype.read = function(query) {
    console.log("Entered read :" + query.timestamp);
    this.db = MongoClient.connect(self.url, function(err, db) {
      if(err) {
      	console.log("Read - failed to connect to the database");
      } else {
	console.log("Read - connected to database");
      	this.collection = db.collection(self.dbName);
        this.collection.find(
	  { "timestamp": { $gt: query.timestamp } } ).toArray(function(err, items) {
	    if(err) {
	      console.log("Data Receive Failed");
	    } else {
	       console.log("Data received");
	       console.log(items);
	    }
	  });
      }
    });
  };
}

module.exports = ibm;
