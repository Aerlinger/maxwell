process.env.NODE_ENV = 'test';

require('coffee-script');

chai = require('chai');
chai.should()
chai.expect()

assert = require('assert');

exports.assert = assert
exports.chai = chai
exports.expect = chai.expect

// Global definitions:
require('../src/global/arrays');
require('../src/global/colorPalette');
require('../src/global/console');
require('../src/global/formats');
require('../src/global/math');
require('../src/global/units');
require('../src/global/mixin');
require('../src/global/typeChecking');

// Simple check to make sure mocha is loaded and working
describe("Sanity check", function () {
  it("should satisfy true equals true", function (done) {
    "true".should.equal("true");
    done();
  });
});