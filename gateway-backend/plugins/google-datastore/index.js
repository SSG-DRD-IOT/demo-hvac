var gcloud = require('gcloud');

function google(config) {
  var self = this;
  //console.log(config);
  self.db = gcloud.datastore.dataset(config.cloud);
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
    //console.log(this.key);
    self.db.save({
            key: this.key,
            data: data[i]
        }, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Google - Data stored")
            }
    });
  }
};


google.prototype.read = function(readQuery, callback) {

if(readQuery.timestamp) {
    this.dataQuery = self.db.createQuery(this.namespace, readQuery.sensor_id)
  			.filter('timestamp >=', readQuery.timestamp);
} else {
    this.dataQuery = self.db.createQuery(this.namespace, readQuery.sensor_id);
}

self.db.runQuery(this.dataQuery, function(err, result) {
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


google.prototype.delete = function(deleteQuery) {
  this.dataQuery = self.db.createQuery(this.namespace, deleteQuery.sensor_id);
  self.db.runQuery(this.dataQuery, function(err, result) {
    if(err) {
      console.log(JSON.stringify(err, null, ' '));
      callback(err, result);
    } else {
      for(i in result) {
        console.log(result[i].key.path);
        self.db.delete(result[i].key, function(err, res) {
        if(err) {
          console.log('Google - delete failed');
          console.log(err);
        }
        else {
          console.log('Google - delete success');
          console.log(res);
        }
      });
      }
      console.log(JSON.stringify(result, null, '  '));
       //callback(err, self.response);
    }
  });

};

}

module.exports = google;
