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
var trigger_fixtures = {

    valid_1 : {
        id : "FanOn",
        name : "FanOn",
        sensor_id : "Temperature",
        actuator_id : "Fan",
        validator_id : "Sound",
        condition : ">80",
        triggerFunc: "on",
        active: true
    },


    fan_on_condition_true : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "Temperature",
        actuator_id : "Fan",
        validator_id : "Sound",
        condition : "( function() { return true; } )",
        triggerFunc: "on",
        active: true
    },


    fan_on_condition_false : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "Temperature",
        actuator_id : "Fan",
        validator_id : "Sound",
        condition : "( function() { return false; } )",
        triggerFunc: "on",
        active: true
    },

    fan_on_condition_passes_argument : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition : "( function(arg) { return arg; } )",
        triggerFunc: "on",
        active: true
    },

    temperature_greater_than_27 : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition : "( function(temperature) { return temperature > 27; } )",
        triggerFunc: "on",
        active: true
    },

    temperature_less_than_20 : {
        id : "FanOnTrue",
        name : "FanOn",
        sensor_id : "temperature",
        actuator_id : "fan",
        validator_id : "sound",
        condition : "( function(temperature) { return temperature < 20; } )",
        triggerFunc: "on",
        active: true
    }

};

module.exports = trigger_fixtures;
