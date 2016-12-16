(function(test){
  if (
    typeof require === "function"
    && typeof exports === "object"
    && typeof module === "object"
  ) {
    // NodeJS
    (function(){
      var chai = require('chai');
      chai.Assertion.includeStack = true;
      test(chai, true);
    }());
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    test(chai, false);
  }
}(function(chai, testingServer){

  var should = chai.should();
  var assert = chai.assert;

  describe("chai-fuzzy", function() {
    if (testingServer) {
      var fuzz = require('../index');
      it("exports a function that takes two arguments", function() {
        should.exist(fuzz);
        fuzz.should.be.a('function');
        fuzz.length.should.equal(2);
      });

      chai.use(fuzz);
    }

    chai.use(function (chai, utils) {
      inspect = utils.objDisplay;

      chai.Assertion.addMethod('fail', function (message) {
        var obj = this._obj;

        new chai.Assertion(obj).is.a('function');

        try {
          obj();
        } catch (err) {
          this.assert(
              err instanceof chai.AssertionError
            , 'expected #{this} to fail, but it threw ' + inspect(err));
          this.assert(
              err.message === message
            , 'expected #{this} to fail with ' + inspect(message) + ', but got ' + inspect(err.message));
          return;
        }

        this.assert(false, 'expected #{this} to fail');
      });
    });

    describe("matchers", function() {
      describe(".jsonOf", function() {
        beforeEach(function() {
          var writtenMS = 1349631491728;
          this.apple = {
            isFruit: true
            , skin: 'thin'
            , colors: ['red', 'green', 'yellow']
            , picked: new Date(writtenMS)
          };
          this.pear = {
            isFruit: true
            , skin: 'thin'
            , colors: ['red', 'green', 'yellow']
            , picked: new Date(writtenMS)
          };
          this.orange = {
            isFruit: true
            , skin: 'thick'
            , colors: ['orange']
            , picked: new Date(writtenMS)
          };

          this.appleJSON  = JSON.parse(JSON.stringify(this.apple));
          this.pearJSON   = JSON.parse(JSON.stringify(this.pear));
          this.orangeJSON = JSON.parse(JSON.stringify(this.orange));
        });

        describe("when given two objects that JSON stringify to similiar results", function() {
          it("passes", function() {
            this.appleJSON.should.be.jsonOf(this.pear);
            this.pearJSON.should.be.jsonOf(this.apple);
          });

          describe("when negated", function() {
            it("fails", function() {
              var self = this;

              (function(){
                self.appleJSON.should.not.be.jsonOf(self.pear);
              }).should.fail(
                "expected " + inspect(self.appleJSON) + " not to be like JSON " + inspect(self.pearJSON)
              );
              (function(){
                self.pearJSON.should.not.be.jsonOf(self.apple);
              }).should.fail(
                "expected " + inspect(self.pearJSON) + " not to be like JSON " + inspect(self.appleJSON)
              );
            });
          });
        });

        describe("when given two objects that JSON stringify to dissimilar results", function() {
          it("should fail", function() {
              var self = this;

              (function(){
                self.appleJSON.should.be.jsonOf(self.orange);
              }).should.fail(
                "expected " + inspect(self.appleJSON) + " to be like JSON " + inspect(self.orangeJSON)
              );
              (function(){
                self.orangeJSON.should.be.jsonOf(self.apple);
              }).should.fail(
                "expected " + inspect(self.orangeJSON) + " to be like JSON " + inspect(self.appleJSON)
              );
          });

          describe("when negated", function() {
            it("passes", function() {
              this.orange.should.not.be.jsonOf(this.apple);
              this.apple.should.not.be.jsonOf(this.orange);
            });
          });
        });
      });

      describe(".like", function() {
        describe("when given mixed types", function() {
          var subjectObj, subjectArr;

          beforeEach(function() {
            subjectObj    = { a: 'alpha' };
            subjectArr    = ['a', 'alpha'];
          });

          it("fails", function() {
            (function(){
              subjectObj.should.be.like(subjectArr);
            }).should.fail("expected " + inspect(subjectObj) + " to be like " + inspect(subjectArr));
            (function(){
              subjectArr.should.be.like(subjectObj);
            }).should.fail("expected " + inspect(subjectArr) + " to be like " + inspect(subjectObj));
          });

          describe("negated", function() {
            it("passes", function() {
              subjectObj.should.not.be.like(subjectArr);
              subjectArr.should.not.be.like(subjectObj);
            });
          });
        });

        describe("when given arrays", function() {
          beforeEach(function() {
            this.subject = ['alpha'];
            this.similar = ['alpha'];
            this.dissimilar = ['avocado'];
          });

          it("fails if either subject or expected has more values", function() {
            var more = ['a', 'b'];
            var less = ['a'];

            (function(){
              more.should.be.like(less);
            }).should.fail("expected " + inspect(more) + " to be like " + inspect(less));

            (function(){
              less.should.be.like(more);
            }).should.fail("expected " + inspect(less) + " to be like " + inspect(more));
          });

          makeAssertions();
        });

        describe("when given objects", function() {
          beforeEach(function() {
            this.subject = {a: 'alpha'};
            this.similar = {a: 'alpha'};
            this.dissimilar = {a: 'avocado'};
          });

          it("fails if either subject or expected has more values", function() {
            var more = {
                a: 'a'
              , b: 'b'
            };
            var less = {
              a: 'a'
            };

            (function(){
              more.should.be.like(less);
            }).should.fail("expected " + inspect(more) + " to be like " + inspect(less));

            (function(){
              less.should.be.like(more);
            }).should.fail("expected " + inspect(less) + " to be like " + inspect(more));
          });

          makeAssertions();
        });

        describe("when given strings", function() {
          beforeEach(function() {
            this.subject = 'a is for alpha';
            this.similar = 'a is for alpha';
            this.dissimilar = 'a is for avocado';
          });

          makeAssertions();
        });

        describe("when given numbers", function() {
          beforeEach(function() {
            this.subject = 3.14159;
            this.similar = 3.1415900000;
            this.dissimilar = 6.283;
          });

          makeAssertions();
        });

        function makeAssertions(){
          it("passes when they are the same", function() {
            this.subject.should.be.like(this.subject);
          });

          it("passes when they are similar", function() {
            this.subject.should.be.like(this.similar);
          });

          it("fails when they are not similar", function() {
            var subject    = this.subject;
            var dissimilar = this.dissimilar;
            (function(){
              subject.should.be.like(dissimilar);
            }).should.fail("expected " + inspect(subject) + " to be like " + inspect(dissimilar));
          });

          it("passes negated when they are not similar", function() {
            this.subject.should.not.be.like(this.dissimilar);
          });

          it("fails negated when they are similar", function() {
            var subject    = this.subject;
            var similar    = this.similar;
            (function(){
              subject.should.not.be.like(similar);
            }).should.fail("expected " + inspect(subject) + " not to be like " + inspect(similar));
          });
        }
      });

      describe(".containOneLike", function() {
        // FIXME: support more needles/haystacks
        //   should be able to look for strings in strings

        // FIXME: have tests for finding more types (bool, etc)

        var arrContainer , objContainer
          , arrNeedle    , objNeedle    , strNeedle,  numNeedle
          , arrMissing   , objMissing   , strMissing, numMissing
          , arrDupe      , objDupe      , strDupe,    numDupe
          , subject
        ;

        beforeEach(function() {
          arrNeedle = ['waffles'];
          objNeedle = {w: 'waffles'};
          strNeedle = 'waffles';
          numNeedle = 3.14159

          arrDupe = JSON.parse(JSON.stringify(arrNeedle));
          objDupe = JSON.parse(JSON.stringify(objNeedle));
          strDupe = JSON.parse(JSON.stringify(strNeedle));
          numDupe = JSON.parse(JSON.stringify(numNeedle));

          arrContainer = [arrDupe, objDupe, strDupe, numDupe];
          objContainer = {
            arr: arrDupe
            , obj: objDupe
            , str: strDupe
            , num: numDupe
          };

          arrMissing = ['chan'];
          objMissing = {missing: 'chan'}
          strMissing = 'chan';

        });

        describe("when given unsupported containers", function() {
          beforeEach(function() {
            subject = 5;
          });

          it("fails", function() {
            (function(){
              subject.should.containOneLike(5);
            }).should.fail("expected " + inspect(subject) + " to be an array, object, or string");
          });
        });

        describe("looking in arrays", function() {
          beforeEach(function() {
            this.subject = subject = arrContainer;
          });

          containmentAssertions(subject);
        });

        describe("looking in objects", function() {
          beforeEach(function() {
            this.subject = subject = objContainer;
          });

          containmentAssertions(subject);
        });

        function containmentAssertions(){
          var subject;

          describe("for numbers", function() {
            it("passes when items are there", function() {
              this.subject.should.containOneLike(numNeedle);
            });

            it("fails when items are not there", function() {
              subject = this.subject;
              (function(){
                subject.should.containOneLike(arrMissing);
              }).should.fail(
                "expected " + inspect(subject) + " to contain one thing like " + inspect(arrMissing)
              );
            });

            it("negated passes when items are not there", function() {
              this.subject.should.not.containOneLike(arrMissing);
            });

            it("negated fails when items are there", function() {
              subject = this.subject;
              (function(){
                subject.should.not.containOneLike(numNeedle);
              }).should.fail(
                "expected " + inspect(subject) + " not to contain one thing like " + inspect(numNeedle)
              );
            });
          });

          describe("for strings", function() {
            it("passes when items are there", function() {
              this.subject.should.containOneLike(strNeedle);
            });

            it("fails when items are not there", function() {
              subject = this.subject;
              (function(){
                subject.should.containOneLike(arrMissing);
              }).should.fail(
                "expected " + inspect(subject) + " to contain one thing like " + inspect(arrMissing)
              );
            });

            it("negated passes when items are not there", function() {
              this.subject.should.not.containOneLike(arrMissing);
            });

            it("negated fails when items are there", function() {
              subject = this.subject;
              (function(){
                subject.should.not.containOneLike(strNeedle);
              }).should.fail(
                "expected " + inspect(subject) + " not to contain one thing like " + inspect(strNeedle)
              );
            });
          });

          describe("for arrays", function() {
            it("passes when items are there", function() {
              this.subject.should.containOneLike(arrNeedle);
            });

            it("fails when items are not there", function() {
              subject = this.subject;
              (function(){
                subject.should.containOneLike(arrMissing);
              }).should.fail(
                "expected " + inspect(subject) + " to contain one thing like " + inspect(arrMissing)
              );
            });

            it("negated passes when items are not there", function() {
              this.subject.should.not.containOneLike(arrMissing);
            });

            it("negated fails when items are there", function() {
              subject = this.subject;
              (function(){
                subject.should.not.containOneLike(arrNeedle);
              }).should.fail(
                "expected " + inspect(subject) + " not to contain one thing like " + inspect(arrNeedle)
              );
            });
          });

          describe("for objects", function() {
            it("passes when items are there", function() {
              this.subject.should.containOneLike(objNeedle);
            });

            it("fails when items are not there", function() {
              subject = this.subject;
              (function(){
                subject.should.containOneLike(arrMissing);
              }).should.fail(
                "expected " + inspect(subject) + " to contain one thing like " + inspect(arrMissing)
              );
            });

            it("negated passes when items are not there", function() {
              this.subject.should.not.containOneLike(arrMissing);
            });

            it("negated fails when items are there", function() {
              var subject = this.subject;
              (function(){
                subject.should.not.containOneLike(objNeedle);
              }).should.fail(
                "expected " + inspect(subject) + " not to contain one thing like " + inspect(objNeedle)
              );
            });
          });
        }
      });
    });

    describe("tdd alias", function() {
      var objValue, objLike, objNotLike, objSub, objNotSub;

      before(function(){
        objValue = {a:1, b:2, c:[1,2,3]};
        objLike = {c:[1,2,3], b:2, a:1};
        objNotLike = {a:11, b:22, c:33};
        objSub = [1,2,3];
        objNotSub = [4,3,1];
      });

      //basic integrity checks

      it(".like", function() {
        assert.like(objValue, objLike ,'tdd');
        objValue.should.be.like(objLike, 'bdd');
      });
      it(".notLike", function() {
        assert.notLike(objValue, objNotLike ,'tdd');
        objValue.should.not.be.like(objNotLike, 'bdd');
      });

      it(".jsonOf", function() {
        assert.jsonOf(objValue, objLike ,'tdd');
        objValue.should.be.jsonOf(objLike, 'bdd');
      });
      it(".notJsonOf", function() {
        assert.notJsonOf(objValue, objNotLike ,'tdd');
        objValue.should.not.be.jsonOf(objNotLike, 'bdd');
      });

      it(".containOneLike", function() {
        assert.containOneLike(objValue, objSub ,'tdd');
        objValue.should.containOneLike(objSub, 'bdd');
      });
      it(".notContainOneLike", function() {
        assert.notContainOneLike(objValue, objNotLike ,'tdd');
        objValue.should.not.containOneLike(objNotLike, 'bdd');
      });
    });
  });
}));
