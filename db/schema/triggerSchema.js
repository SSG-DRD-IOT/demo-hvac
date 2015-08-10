var mongoose = require('mongoose');

var triggerSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    sensor_id : {
        type: String,
        required: true
    },
    actuator_id : {
        type: String,
        required: true
    },
    validator_id : {
        type: String,
        required: true
    },
    condition : {
        type: String,
        required: true
    },
    triggerFunc : {
        type: String,
        required: true
    },
    active : {
        type: Boolean,
        required: true,
        default: true
    }
});

triggerSchema.eval_condition() {
    return true;
};

module.exports = triggerSchema;
