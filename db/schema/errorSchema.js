var mongoose = require('mongoose');

var ErrorSchema = new mongoose.Schema({
    type : {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: true
    }
});

module.exports = ErrorSchema;
