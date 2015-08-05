var mongoose = require('mongoose');

var SensorSchema = require('./schema/sensorSchema.js');
var TriggerSchema = require('./schema/triggerSchema.js');
var DataSchema = require('./schema/dataSchema.js');
var SensorCloudSchema = require('./schema/sensorCloudSchema.js');

module.exports = {
    SensorModel: mongoose.model('SensorModel', SensorSchema),
    DataModel: mongoose.model('DataModel', DataSchema),
    SensorCloudModel: mongoose.model('SensorCloudModel', SensorCloudSchema),
    TriggerModel: mongoose.model('TriggerModel', TriggerSchema)
};
