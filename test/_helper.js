process.env.NODE_ENV = 'test';

require('coffee-script');

chai = require('chai');
chai.should()

assert = require('assert');

exports.assert = assert
exports.chai = chai
exports.expect = chai.expect

ArrayUtils = require('../util/arrayUtils.coffee');