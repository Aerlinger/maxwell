# <DEFINE>
define ['cs!MathUtils'], (MathUtils) ->
# </DEFINE>

  describe "Math utilities", ->

    describe "MathUtils.sign(x)", ->
      it "should return 1 for a positive number", ->
        MathUtils.sign(1).should.equal 1
        MathUtils.sign(5e6).should.equal 1
        MathUtils.sign(.001).should.equal 1

      it "should return 0 for an argument of 0", ->
        MathUtils.sign(0).should.equal 0

      it "should return -1 for an argument of 0", ->
        MathUtils.sign(-0.0001).should.equal -1
        MathUtils.sign(-1).should.equal -1
        MathUtils.sign(-1e9).should.equal -1

    describe "MathUtils.isInfinite(x)", ->
      it "should return true for Infinity", ->
        MathUtils.isInfinite(Infinity).should.equal true

      it "should return true for a value larger than 1e18", ->
        MathUtils.isInfinite(1.01e18).should.equal true

      it "should not be infinite", ->
        MathUtils.isInfinite(1.99e17).should.equal false
