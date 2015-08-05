var mongoose = require( 'mongoose' );

var dataSchema = new mongoose.Schema({
    sensor_id: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = dataSchema;
