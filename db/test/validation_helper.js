/*
 * Author: Daniel Holmlund <daniel.w.holmlund@Intel.com>
 * Copyright (c) 2014 Intel Corporation.
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
