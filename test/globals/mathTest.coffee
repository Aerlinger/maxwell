describe "Math utilities", ->

  describe "sign(x)", ->
    it "should return 1 for a positive number", ->
      sign(1).should.equal 1
      sign(5e6).should.equal 1
      sign(.001).should.equal 1

    it "should return 0 for an argument of 0", ->
      sign(0).should.equal 0

    it "should return -1 for an argument of 0", ->
      sign(-0.0001).should.equal -1
      sign(-1).should.equal -1
      sign(-1e9).should.equal -1

  describe "isInfinite(x)", ->
    it "should return true for Infinity", ->
      isInfinite(Infinity).should.equal true

    it "should return true for a value larger than 1e18", ->
      isInfinite(1.01e18).should.equal true

    it "should not be infinite", ->
      isInfinite(1.99e17).should.equal false