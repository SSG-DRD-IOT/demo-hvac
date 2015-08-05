var mongoose = require('mongoose');

var CloudProviderSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    }
});

module.exports = CloudProviderSchema;
