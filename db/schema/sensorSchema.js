var mongoose = require('mongoose');
var cloudproviderSchema = require('./cloudproviderSchema.js');

var sensorSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    },
    name  : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    maxfrequency : {
        type: Number,
        required: true
    },
    frequency : {
        type: Number,
        required: true
    },
    active : {
        type: Boolean,
        required: true
    },
    ioType : {
        type: String,
        required: true
    },
    cloudproviders : [ cloudproviderSchema ]
});

module.exports = sensorSchema;
