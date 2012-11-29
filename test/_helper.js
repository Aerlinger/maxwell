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
console.log('Global Definitions:')
require('../src/global/arrays');
require('../src/global/colorPalette');
require('../src/global/console');
require('../src/global/formats');
require('../src/global/math');
require('../src/global/units');