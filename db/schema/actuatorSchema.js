var mongoose = require('mongoose');

var actuatorSchema = new mongoose.Schema({
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
    api : {
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
    }
});

module.exports = actuatorSchema;
