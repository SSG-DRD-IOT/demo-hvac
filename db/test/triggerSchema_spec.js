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
            var trigger = new Trigger(trigger_fixtures.valid_1);
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


describe("When a trigger evaluates its string condition", function() {
    var trigger;

    beforeEach(function() {
        trigger = new Trigger(trigger_fixtures.fan_on_condition_true);
    });

    it("should have a method to evaluate its condition", function() {
        trigger = new Trigger(trigger_fixtures.fan_on_condition_true);
        expect(trigger).to.have.property('eval_condition');
    });

    describe("and the condition is true", function() {
        it("the condition should be true", function() {
            trigger = new Trigger(trigger_fixtures.fan_on_condition_true);
            expect(trigger.eval_condition()).to.be.equal(true);
        });
    });

    describe("and the codition is false", function() {

        it("the condition should be false", function() {
            trigger = new Trigger(trigger_fixtures.fan_on_condition_false);
            expect(trigger.eval_condition()).to.be.equal(false);
        });

    });

    describe("and the condition is arg > 27", function() {
        it("and the temp is 28 then the condition should be true", function() {
            trigger = new Trigger(trigger_fixtures.temperature_greater_than_27);
            expect(trigger.eval_condition(this, 28)).to.be.equal(true);
        });
    });

    describe("and the condition is arg < 20", function() {
        it("and the temp is 19 then the condition should be true", function() {
            trigger = new Trigger(trigger_fixtures.temperature_less_than_20);
            expect(trigger.eval_condition(this, 19)).to.be.equal(true);
        });
    });

    describe("and the condition is arg > 27", function() {
        it("and the temp is 26 then the condition should be true", function() {
            trigger = new Trigger(trigger_fixtures.temperature_greater_than_27);
            expect(trigger.eval_condition(this, 26)).to.be.equal(false);
        });
    });

    describe("and the condition is arg < 20", function() {
        it("and the temp is 21 then the condition should be true", function() {
            trigger = new Trigger(trigger_fixtures.temperature_less_than_20);
            expect(trigger.eval_condition(this, 21)).to.be.equal(false);
        });
    });
});

// describe("When a trigger evaluates its function condition", function() {
//     var trigger;

//     describe("and the condition is true", function() {
//         it("the condition should be true", function() {
//             trigger = new Trigger(trigger_fixtures.temperature_greater_than_27);
// //            console.log(trigger.condition);
//             expect(trigger.eval_condition(this, 28)).to.be.equal(true);
//         });
//     });
// });
