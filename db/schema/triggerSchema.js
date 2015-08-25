/*
 * Author: Daniel Holmlund <daniel.w.holmlund@Intel.com>
 * Copyright (c) 2015 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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

triggerSchema.methods.eval_condition = function (scope, args) {
    var result;

    try {
        result = eval(this.condition).call(scope, args);
    } catch(e) {
        throw(e);
    }
    return result;
};

triggerSchema.methods.eval_triggerFunc = function (scope, args) {
    var result;
    try {
        result = eval(this.triggerFunc).call(scope, args);
    } catch(e) {
        throw(e);
    }
    return result;
};

module.exports = triggerSchema;
