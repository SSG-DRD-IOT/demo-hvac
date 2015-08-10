////////////////////////////////////////////////////////////////////////////////
// Testing Suite for the Sensor Data DB Model
////////////////////////////////////////////////////////////////////////////////

var config = require ('./config.json');
var trigger_fixtures = require('../fixtures/trigger.js');

// Load the export and should testing styles
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

// Connect to the MongoDB
var mongoose = require('mongoose');
var triggerSchema = require('../schema/triggerSchema.js');
var Trigger = mongoose.model('Trigger', triggerSchema);

mongoose.connect(config.mongodb);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    //   console.log("Connection to MongoDB successful");
});


describe("When a trigger is saved", function() {
    describe("with valid data", function() {

        before (function() {
            Trigger.remove({}, function() {
//                console.log("Triggers cleared");
            });
        });

        it("should be successful", function(done) {
            var trigger = new Trigger(trigger_fixtures.valid_trigger_1);
            trigger.save(function(err, trigger) {
                try {
                    Trigger.find({}, function(err, triggers) {
                        expect(err).to.be.null;
                        triggers.length.should.equal(1);
                    });
                    done();
                } catch( err ) {
                    done( err );
                }
            });
        });

        it("there should be 1 trigger", function(done) {
            var trigger = new Trigger(trigger_fixtures.valid_trigger_1);
            trigger.save(function(err, trigger) {
                try {
                    Trigger.find({}, function(err, triggers) {
                        expect(err).to.be.null;
                        triggers.length.should.equal(1);
                    });
                    done();
                } catch( err ) {
                    done( err );
                }
                 var num = Trigger.count();
                expect(num).to.be.equal(1);
            });
        });

    });
});
