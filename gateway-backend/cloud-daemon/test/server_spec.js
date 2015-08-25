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
////////////////////////////////////////////////////////////////////////////////
// Testing Suite for the Sensor Data DB Model
////////////////////////////////////////////////////////////////////////////////
//var config = require ('./config.json');
var data_fixtures = require('./fixtures/data.js');
var sensor_fixtures = require('./fixtures/sensor.js');
//var cloudprovider_fixtures = require('../fixtures/cloudprovider.js');

// Load the export and should testing styles
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

var server_utils = require('../server.js');
// Connect to the MongoDB
//var mongoose = require('mongoose');
//var sensorSchema = require('../schema/sensorSchema.js');
//var cloudproviderSchema = require('../schema/cloudproviderSchema.js');
//var Sensor = mongoose.model('Sensor', sensorSchema);
//var CloudProvider = mongoose.model('CloudProvider', cloudproviderSchema);

// mongoose.connect(config.mongodb);
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//     //   console.log("Connection to MongoDB successful");
// });

describe("When passing Data Readings to getSensorIDs()", function() {
    it("a list of all sensor ids should be returned", function(done) {
        var sensor_ids = server_utils.getSensorIDs(data_fixtures);
        expect(sensor_ids).to.be.eql(['1','2']);
        done();
    });
});

describe("When calling groupByCloudProvider() with an array of data", function() {
    it("should return a list of data grouped by their cloud provider", function() {
       // var data_by_cloudprovider =

        done();
    });

});
