var mongoose = require('mongoose');

var sensorCloudSchema = new mongoose.Schema({
    sensor_id : {
        type: String,
        required: true
    },
    cloudprovider_id : {
        type: String,
        required: true
    }
});

module.exports = sensorCloudSchema;
