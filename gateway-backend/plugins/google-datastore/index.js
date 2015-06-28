var gcloud = require('gcloud');

function google(config) {
  var self = this;
  //console.log(config);
  this.db = gcloud.datastore.dataset(config.cloud);
  self.response = [];
  this.namespace = config.namespace;
  this.dataQuery = '';

google.prototype.connect = function() {
  //dataset = gcloud.datastore.dataset();
};


google.prototype.write = function(data) {

  for(i in data) {
    this.key = {
        "namespace": this.namespace,
        "path": [data[i].sensor_id, data[i].timestamp]
           }
    this.db.save({
            key: this.key,
            data: data[i]
        }, function(err) {
            if (!err) {
              //console.log("Test data saved");
            }
    });
  }
};


google.prototype.read = function(readQuery, callback) {

if(readQuery.timestamp) {
    this.dataQuery = this.db.createQuery(this.namespace, readQuery.sensor_id)
  			.filter('timestamp >=', readQuery.timestamp);
} else {
    this.dataQuery = this.db.createQuery(this.namespace, readQuery.sensor_id);
}

this.db.runQuery(this.dataQuery, function(err, result) {
  if(err) {
    console.log(JSON.stringify(err, null, ' '));
    callback(err, result);
  } else {
    for(i in result) {
      self.response.push(result[i].data);
    }
   // console.log(JSON.stringify(self.response, null, '  '));
     callback(err, self.response);
  }
});

};


google.prototype.disconnect = function() {

};

}

module.exports = google;
