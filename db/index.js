

var mongoose = require('mongoose');

var SensorSchema = require('./schema/sensorSchema.js');
var ActuatorSchema = require('./schema/actuatorSchema.js');
var TriggerSchema = require('./schema/triggerSchema.js');
var DataSchema = require('./schema/dataSchema.js');
var SensorCloudSchema = require('./schema/sensorCloudSchema.js');
var ErrorSchema = require('./schema/errorSchema.js');


module.exports = {
    SensorModel: mongoose.model('SensorModel', SensorSchema),
    ActuatorModel: mongoose.model('ActuatorModel', ActuatorSchema),
    DataModel: mongoose.model('DataModel', DataSchema),
    SensorCloudModel: mongoose.model('SensorCloudModel', SensorCloudSchema),
    TriggerModel: mongoose.model('TriggerModel', TriggerSchema),
    ErrorModel:  mongoose.model('ErrorModel', ErrorSchema)
};
