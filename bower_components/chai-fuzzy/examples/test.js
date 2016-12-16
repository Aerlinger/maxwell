// to run:
// 1. cd to project directory
// 2. npm install
// 3. ./node_modules/.bin/mocha examples/test.js

var chai = require('chai');
chai.use(require('../index'));
chai.Assertion.includeStack = true;
var should = chai.should();
var expect = chai.expect;

describe("examples from the readme", function() {
  describe("like", function() {
    it("works with objects", function() {

      var subject = {a: 'a'};
      subject.should.be.like({a: 'a'});
      subject.should.not.be.like({x: 'x'});
      subject.should.not.be.like({a: 'a', b: 'b'});
      expect(subject).to.be.like({a: 'a'});
      expect(subject).not.to.be.like({x: 'x'});
      expect(subject).not.to.be.like({a: 'a', b: 'b'});
    });

    it("works with arrays", function() {
      var subject = ['a'];
      subject.should.be.like(['a']);
      subject.should.not.be.like(['x']);
      subject.should.not.be.like(['a', 'b']);
      expect(subject).to.be.like(['a']);
      expect(subject).not.to.be.like(['x']);
      expect(subject).not.to.be.like(['a', 'b']);
    });
  });

  describe("containOneLike", function() {
    it("works with objects", function() {
      var subject = {
        a:   'alphabet'
        , b: 'butternut'
        , c: {
          name:       'chowder'
          , attributes: [
            'scales'
            , 'fins'
          ]
        }
        , x: 'xylophone'
        , z: 'xylophone'
      };
      subject.should.containOneLike({
        name:         'chowder'
        , attributes: [
          'scales', 'fins'
        ]
      });
      subject.should.not.containOneLike({
        name:         'chowder'
        , attributes: [
          'scales', 'fins', 'cream'
        ]
      });
      subject.should.containOneLike('xylophone');
      subject.should.not.containOneLike('cow patties');
    });
  });
});
