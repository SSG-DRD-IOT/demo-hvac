var gcloud = require('gcloud');

// Lodash is a functional library for manipulating data structures
var _ = require("lodash");

// Setup a logging system in this daemon
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'google-datastore-plugin.log' })
  ]
});

function google(json) {
  var self = this;
  //logger.log(config);
  self.config = json;
  self.db = gcloud.datastore.dataset(self.config.cloud);
  self.response = [];
  self.dataQuery = '';

  if(self.config.debug != "true") {
    logger.remove(winston.transports.Console);
  }

  google.prototype.connect = function() {
    //dataset = gcloud.datastore.dataset();
  };


  google.prototype.write = function(data) {

    for(i in data) {
      // Create a complete key with namespace, kind and id for each data item
      self.key = {
        "namespace": self.config.namespace,
        "path": [data[i].sensor_id, data[i].timestamp]
      }
      //logger.log(self.key);
      self.db.save({
        key: self.key,
        data: data[i]
      }, function(err) {
        if (err) {
          logger.error("Google - Data sending failed")
          logger.error(err);
        } else {
          logger.info("Google - Data sent successfully")
        }
      });
    }
  };


  google.prototype.read = function(readQuery, callback) {

    if(readQuery.timestamp) {
      self.dataQuery = self.db.createQuery(self.config.namespace, readQuery.sensor_id)
      .filter('timestamp >=', readQuery.timestamp);
    } else {
      self.dataQuery = self.db.createQuery(self.config.namespace, readQuery.sensor_id).limit(100);
    }

    self.db.runQuery(self.dataQuery, function(err, result) {
      self.resp = [];
      if(err) {
        logger.error('Google - Data receive failed');
        logger.error(JSON.stringify(err, null, ' '));
      } else {
        logger.info('Google - Data received: %d', result.length);
        self.resp = _.map(result, function(d) {delete d.key; return d.data;});
      }
      // logger.info(JSON.stringify(self.response, null, '  '));
      callback(err, self.resp);
    });

};


google.prototype.delete = function(deleteQuery) {
  self.dataQuery = self.db.createQuery(self.config.namespace, deleteQuery.sensor_id);
  self.db.runQuery(self.dataQuery, function(err, result) {
    if(err) {
      logger.error(JSON.stringify(err, null, ' '));
      callback(err, result);
    } else {
      for(i in result) {
        // logger.info(result[i].key.path);
        self.db.delete(result[i].key, function(err, res) {
          if(err) {
            logger.error('Google - delete failed');
            logger.error(err);
          }
          else {
            logger.info('Google - delete success');
            logger.info(res);
          }
        });
      }
      logger.info(JSON.stringify(result, null, '  '));
      //callback(err, self.response);
    }
  });

};

}

module.exports = google;
