process.env.NODE_ENV = 'test';

require('coffee-script');

// Global definitions:
require('../src/global/arrays');
require('../src/global/colorPalette');
require('../src/global/console');
require('../src/global/formats');
require('../src/global/math');
require('../src/global/units');

chai = require('chai');
chai.should()

assert = require('assert');

exports.assert = assert
exports.chai = chai
exports.expect = chai.expect

ArrayUtils = require('./arrays.coffee');