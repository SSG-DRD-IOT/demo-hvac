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

triggerSchema.methods.eval_condition = function (self) {
    var result;
    var scope = self || this;
    try {
        result = eval(this.condition).call(scope, true);
    } catch(e) {
        throw(e);
    }
    return result;
};

triggerSchema.methods.eval_triggerFunc = function (self) {
    var result;
    var scope = self || this;
    try {
        result = eval(this.condition).call(scope, true);
    } catch(e) {
        throw(e);
    }
    return result;
};

module.exports = triggerSchema;
