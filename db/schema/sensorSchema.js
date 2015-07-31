var mongoose = require('mongoose');

var sensorSchema = new mongoose.schema({
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
        type: String,
        required: true
    },
    active : {
        type: String,
        required: true
    },
    ioType : {
        type: String,
        required: true
    }
});

module.exports = sensorSchema;
