{ArrayUtils} = require '.././arrays.coffee'

describe "Array Utilities", ->

  it "should build array of zeros from an empty array", ->
    zeroArray(Array(5)).toString().should.equal [0, 0, 0, 0, 0].toString()

  it "should convert nonzero array to a zero array", ->
    zeroArray([1, 2, 3, 4, 5]).toString().should.equal [0, 0, 0, 0, 0].toString()

  it "should build a 1x5 array of zeros", ->
    zeroArray2(1, 5).toString().should.equal [0, 0, 0, 0, 0].toString()

  it "should build a 2x5 array of zeros", ->
    zeroArray2(2, 5).toString().should.equal [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]].toString()

  it "should build a 3x2 array of zeros", ->
    arr = zeroArray2(3, 2)
    arr.toString().should.equal [[0, 0], [0, 0], [0, 0]].toString()
    arr[0][0].should.equal 0
    arr[2][1].should.equal 0
    assert.equal arr[3], undefined


  describe "ArrayUtils.isClean should reject", ->
    specify "1D arrays with NaN", ->
      arr = [1, NaN, 3, 4, 5]
      isClean(arr).should.equal false

    specify "1D arrays with Inf", ->
      arr = [1, Infinity, 3, 4, 5]
      isClean(arr).should.equal false

    specify "1D arrays with non-numeric values", ->
      arr = ['a', 2, 3, 4, 5]
      isClean(arr).should.equal false

    specify "Nested arrays containing Infinity", ->
      arr = [[1, 2, 3, 4], [1, 2, 3, 4], [1, Infinity, 3, 4], [1, 2, 3, 4]]
      isClean(arr).should.equal false

    specify "Nested arrays containing NaN", ->
      arr = [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, NaN, 4], [1, 2, 3, 4]]
      isClean(arr).should.equal false