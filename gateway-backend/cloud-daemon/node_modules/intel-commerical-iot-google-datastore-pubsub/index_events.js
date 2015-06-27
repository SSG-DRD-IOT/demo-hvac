var gcloud = require('gcloud');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var GoogleDataStoreCloud = function(config) {
    var self = this;
    console.log(config);

    this.dataset = gcloud.datastore.dataset(config.cloud);
    this.key = this.dataset.key(config.dataset);

    this.on('connect', function() {});
    this.on('read', function() {
	this.dataset.get(key, function(err, entity, apiResponse) {
	    console.log(err || entity);
	});
    });

    // The GoogleDataStoreCloud is receiving data and
    // sending it on to the Google DataStore
    this.on('data', function(data) {
        this.dataset.save({
            key: this.key,
            data: data
        }, function(err) {
            if (!err) {
                console.log("Test data saved");
            }
        });
    });

    this.on('disconnect', function() {});

};

// extend the EventEmitter class using our GoogleDataStoreCloud class
util.inherits(GoogleDataStoreCloud, EventEmitter);

module.exports = GoogleDataStoreCloud;
