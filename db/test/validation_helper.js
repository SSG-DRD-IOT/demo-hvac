var ValidationHelper = function () {

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

};

module.exports = ValidationHelper;
