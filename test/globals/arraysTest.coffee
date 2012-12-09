CircuitElement = require('../../src/component/circuitComponent.coffee')

describe "Array Utilities", ->

  it "should build array of zeros of length 5", ->
    zeroArray(5).toString().should.equal [0, 0, 0, 0, 0].toString()

    it "should return an empty array for a length of -1", ->
    zeroArray(-1).toString().should.equal ""
    zeroArray(0).toString().should.equal ""

  it "should build an empty 2d array when numRows or numCols is < 1", ->
    zeroArray2(1, -5).toString().should.equal ""
    zeroArray2(-1, -5).toString().should.equal ""
    zeroArray2(-1, 5).toString().should.equal ""
    zeroArray2(0, 0).toString().should.equal ""

  it "should build a 1x5 array of zeros", ->
    zeroArray2(1, 5).should.eql [[0, 0, 0, 0, 0]]

  it "should build a 2x5 array of zeros", ->
    zeroArray2(2, 5).should.eql [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]

  it "should build a 3x2 array of zeros", ->
    arr = zeroArray2(3, 2)
    arr.should.eql [[0, 0], [0, 0], [0, 0]]
    arr[0][0].should.equal 0
    arr[2][1].should.equal 0
    assert.equal arr[3], undefined

  it "should be able to remove a circuit component from an array", ->
    circuitElm1 = new CircuitElement(1, 2, 3, 4)
    circuitElm2 = new CircuitElement(5, 6, 7, 8)
    circuitElm3 = new CircuitElement(9, 10, 11, 12)

    circuitList = [circuitElm1, circuitElm2, circuitElm3, circuitElm1]
    circuitList.remove(circuitElm1).should.eql [circuitElm2, circuitElm3]
    circuitList.remove(circuitElm2).should.eql [circuitElm3]

  it "should be able to remove an item from an array", ->
    [0, 1, 2, 3].remove(0).should.eql [1, 2, 3]
    ["one", "two", "three", "one"].remove("one").should.eql ["two", "three"]

  describe "ArrayUtils.isClean should reject", ->
    specify "1D arrays with NaN", ->
      arr = [1, NaN, 3, 4, 5]
      isCleanArray(arr).should.equal false

    specify "1D arrays with Inf", ->
      arr = [1, Infinity, 3, 4, 5]
      isCleanArray(arr).should.equal false

    specify "1D arrays with non-numeric values", ->
      arr = ['a', 2, 3, 4, 5]
      #isCleanArray(arr).should.equal false

    specify "Nested arrays containing Infinity", ->
      arr = [[1, 2, 3, 4], [1, 2, 3, 4], [1, Infinity, 3, 4], [1, 2, 3, 4]]
      #isCleanArray(arr).should.equal false

    specify "Nested arrays containing NaN", ->
      arr = [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, NaN, 4], [1, 2, 3, 4]]
      #isCleanArray(arr).should.equal false