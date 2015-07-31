var mongoose = require('mongoose');
var fixtures = require('../fixtures/data.js');
var dataSchema = require('../schema/dataSchema.js');
var Data = mongoose.model('dataModel', dataSchema);
var config = require ('./config.json');

var chai = require('chai')
, expect = chai.expect
, should = chai.should();

// var dataModel = require('../model/data.js');
mongoose.connect(config.mongodb);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    //   console.log("Connection to MongoDB successful");
});

////////////////////////////////////////////////////////////////////////////////
// Static functions on Data Model
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Validation Helpers
////////////////////////////////////////////////////////////////////////////////
var expect_to_have_property_equal = function (err, field, key, value) {
    expect(err).to.be.not.empty;
    expect(err.errors[field]).to.have.property(key);
    expect(err.errors[field][key]).to.be.equal(value);

};

var expect_required_validation_error_for = function(err, field) {
    expect(err).to.have.property('name');
    expect_to_have_property_equal(err, field, 'kind', 'required');
    expect_to_have_property_equal(err, field, 'name', 'ValidatorError');
};

var expect_casterror_validation_error_for = function(err, field, kind) {
    expect(err).to.have.property('name');
    expect_to_have_property_equal(err, field, 'kind', kind);
    expect_to_have_property_equal(err, field, 'name', 'CastError');
};

var expect_errors_to_exist = function(err) {
    expect(err).to.have.property('errors');
    expect(err.errors).to.be.not.empty;
};

describe("When a sensor value is saved", function() {

    // A helper function to save a data and call a callback
    function save( data, done, f ) {
        var data = new Data(data);
        data.save(function (err, data) {
            try {
                f(err);
                done();    // success: call done with no parameter to indicate that it() is done()
            } catch( err ) {
                done( err ); // failure: call done with an error Object to indicate that it() failed
            }
        });
    }

    // Remove all data documents before testing
    before(function(done) {
        Data.remove({}, function(err) {
            done();
        });
    });

    describe("with valid data", function() {

        it("should be successful", function(done) {
            save(fixtures.valid_data_1, done, function(err) {
                Data.find({}, function(err, docs) {
                    if (err) return done(err);
                    expect(err).to.be.null;
                    docs.length.should.equal(1);
                });
            });
        });

        it("should be found in the database", function(done) {
            save(fixtures.valid_data_1, done, function(err) {
                Data.find({}, function(err, docs) {
                    if (err) return done(err);
                    expect(err).to.be.null;
                    docs.length.should.equal(1);
                });
            });
        });
    });

    describe("with an missing sensor id", function() {
        it("should be unsuccessful", function(done) {
            save(fixtures.empty_sensor_id, done, function(err) {
                expect(err).not.to.be.empty;
                expect(err).to.have.property('name');
            });
        });
        it("should have a cast validation error", function(done) {
            save(fixtures.invalid_sensor_reading, done, function(err) {
                expect(err).to.exist;
                expect_errors_to_exist(err);
                expect_casterror_validation_error_for(err, 'value', 'Number');
            });
        });
    });

    describe("with an missing sensor value", function() {
        it("should be unsuccessful", function(done) {
            save(fixtures.invalid_sensor_reading, done, function(err) {
                expect(err).not.to.be.empty;
                expect(err).to.have.property('name');
            });
        });
        it("should have a cast validation error", function(done) {
            save(fixtures.invalid_sensor_reading, done, function(err) {
                expect(err).to.exist;
                expect_errors_to_exist(err);
                expect_casterror_validation_error_for(err, 'value', 'Number');
            });
        });
    });

    describe("with an invalid sensor value", function() {
        it("should be unsuccessful", function(done) {
            save(fixtures.invalid_timestamp, done, function(err) {
                expect(err).not.to.be.empty;
                expect(err).to.have.property('name');
            });
        });
        it("should have a cast validation error", function(done) {
            save(fixtures.invalid_timestamp, done, function(err) {
                expect(err).to.exist;
                expect_errors_to_exist(err);
                expect_casterror_validation_error_for(err, 'timestamp', 'Date');
            });
        });
    });

    describe("with an empty timestamp", function() {
        it("should be unsuccessful", function(done) {
            save(fixtures.empty_timestamp, done, function(err) {
                expect(err).not.to.be.null;
                expect(err).to.have.property('name');
            });
        });
        it("should have a required validation error", function(done) {
            save(fixtures.empty_timestamp, done, function(err) {
                expect(err).to.exist;
                expect_errors_to_exist(err);
                expect_required_validation_error_for(err, 'timestamp', 'Number');
            });
        });

    });


    describe("with an invalid timestamp", function() {
        it("should be unsuccessful", function(done) {
            save(fixtures.invalid_timestamp, done, function(err) {
                expect(err).not.to.be.empty;
                expect(err).to.have.property('name');
            });
        });
        it("should have a cast validation error", function(done) {
            save(fixtures.invalid_timestamp, done, function(err) {
                expect(err).to.exist;
                expect_errors_to_exist(err);
                expect_casterror_validation_error_for(err, 'timestamp', 'Date');
            });
        });
    });
});
