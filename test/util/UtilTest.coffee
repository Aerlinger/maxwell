Circuit = require('../../src/circuit/circuit.coffee')
GroundElm = require('../../src/circuit/components/GroundElm.coffee')
Util = require('../../src/util/util.coffee')

describe "Utility test", ->

  describe "Units test", ->
    beforeEach ->
      @Circuit = new Circuit()
      @groundElm = new GroundElm(100, 100, 100, 200)


      specify "zero ", ->
        @groundElm.getUnitText(1.99e-18, "Amps").should.equal "0.00 fAmps"
        @groundElm.getUnitText(0, "Amps").should.equal "0 Amps"

      specify "femto amps", ->
        @groundElm.getUnitText(1.99e-15, "Amps").should.equal "1.99 fAmps"
        @groundElm.getUnitText(999.99e-15, "Amps").should.equal "999.99 fAmps"
        @groundElm.getUnitText(1e-17, "Amps").should.equal "0.01 fAmps"

      specify "pico amps", ->
        @groundElm.getUnitText(1.99e-12, "Amps").should.equal "1.99 pAmps"
        @groundElm.getUnitText(999.99e-12, "Amps").should.equal "999.99 pAmps"
        @groundElm.getUnitText(1e-14, "Amps").should.equal "10.00 fAmps"

      specify "nano amps", ->
        @groundElm.getUnitText(1.99e-9, "Amps").should.equal "1.99 nAmps"
        @groundElm.getUnitText(999.99e-9, "Amps").should.equal "999.99 nAmps"
        @groundElm.getUnitText(1e-11, "Amps").should.equal "10.00 pAmps"

      specify "micro amps", ->
        @groundElm.getUnitText(1.99e-6, "Amps").should.equal "1.99 μAmps"
        @groundElm.getUnitText(999.99e-6, "Amps").should.equal "999.99 μAmps"
        @groundElm.getUnitText(1e-8, "Amps").should.equal "10.00 nAmps"

      specify "milli amps", ->
        @groundElm.getUnitText(1.99e-3, "Amps").should.equal "1.99 mAmps"
        @groundElm.getUnitText(999.99e-3, "Amps").should.equal "999.99 mAmps"
        @groundElm.getUnitText(1e-5, "Amps").should.equal "10.00 μAmps"

      specify "amps", ->
        @groundElm.getUnitText(1.99, "Amps").should.equal "1.99 Amps"
        @groundElm.getUnitText(999.99, "Amps").should.equal "999.99 Amps"
        @groundElm.getUnitText(1e-2, "Amps").should.equal "10.00 mAmps"

      specify "kilo Amps", ->
        @groundElm.getUnitText(1.99e3, "Amps").should.equal "1.99 kAmps"
        @groundElm.getUnitText(999.99e3, "Amps").should.equal "999.99 kAmps"
        @groundElm.getUnitText(1e1, "Amps").should.equal "10.00 Amps"

      specify "Mega Amps", ->
        @groundElm.getUnitText(1.99e6, "Amps").should.equal "1.99 MAmps"
        @groundElm.getUnitText(999.99e6, "Amps").should.equal "999.99 MAmps"
        @groundElm.getUnitText(1e4, "Amps").should.equal "10.00 kAmps"

      specify "Giga Amps", ->
        @groundElm.getUnitText(1.99e9, "Amps").should.equal "1.99 GAmps"
        @groundElm.getUnitText(999.99e9, "Amps").should.equal "999.99 GAmps"
        @groundElm.getUnitText(1e7, "Amps").should.equal "10.00 MAmps"


  describe "Format utilities", ->
    #  global.showFormat = (decimalNum) ->
    #  decimalNum.toFixed(2)
    #
    #global.shortFormat = (decimalNum) ->
    #  return decimalNum.toFixed(1);
    #
    ####
    #Removes commas from a number containing a string:
    #e.g. 1,234,567.99 -> 1234567.99
    ####
    #global.noCommaFormat = (numberWithCommas) ->
    #  numberWithCommas.replace(',', '');
    #
    ####
    #Adds commas to a number, and returns the string representation of that number
    #e.g. 1234567.99 -> 1,234,567.99
    ####
    #global.addCommas = (plainNumber) ->
    #  # Simple method of converting a parameter to a string
    #  plainNumber += ""
    #
    #  # Ignore any numbers after a '.'
    #  x = plainNumber.split(".")
    #  x1 = x[0]
    #  x2 = (if x.length > 1 then "." + x[1] else "")
    #  rgx = /(\d+)(\d{3})/
    #  x1 = x1.replace(rgx, "$1" + "," + "$2")  while rgx.test(x1)
    #  x1 + x2

    specify "NoCommaFormat(x)", ->
      Util.noCommaFormat('1,234,567.99').should.equal '1234567.99'

    specify "addCommas(plainNumber)", ->
      Util.commaFormat('1234567.99').should.equal '1,234,567.99'

    specify "commaFormat and noCommaFormat are inverse operations", ->
      num = 123456789


  describe "Array Utilities", ->

    it "should build array of zeros of length 5", ->
      Util.zeroArray(5).toString().should.equal [0, 0, 0, 0, 0].toString()

      it "should return an empty array for a length of -1", ->
      Util.zeroArray(-1).toString().should.equal ""
      Util.zeroArray(0).toString().should.equal ""

    it "should build an empty 2d array when numRows or numCols is < 1", ->
      Util.zeroArray2(1, -5).toString().should.equal ""
      Util.zeroArray2(-1, -5).toString().should.equal ""
      Util.zeroArray2(-1, 5).toString().should.equal ""
      Util.zeroArray2(0, 0).toString().should.equal ""

    it "should build a 1x5 array of zeros", ->
      Util.zeroArray2(1, 5).should.eql [[0, 0, 0, 0, 0]]

    it "should build a 2x5 array of zeros", ->
      Util.zeroArray2(2, 5).should.eql [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]

    it "should build a 3x2 array of zeros", ->
      arr = Util.zeroArray2(3, 2)
      arr.should.eql [[0, 0], [0, 0], [0, 0]]
      arr[0][0].should.equal 0
      arr[2][1].should.equal 0

    it "should be able to remove a circuit component from an array", ->
      circuitElm1 = new CircuitComponent(1, 2, 3, 4)
      circuitElm2 = new CircuitComponent(5, 6, 7, 8)
      circuitElm3 = new CircuitComponent(9, 10, 11, 12)

      circuitList = [circuitElm1, circuitElm2, circuitElm3, circuitElm1]
      console.log(circuitList.remove)

      Util.removeFromArray(circuitList, circuitElm1).should.eql [circuitElm2, circuitElm3]
    #circuitList.remove(circuitElm2).should.eql [circuitElm3]

    it "should be able to remove an item from an array", ->
      Util.removeFromArray([0, 1, 2, 3, 0], 0).should.eql [1, 2, 3]
      Util.removeFromArray(["one", "two", "three", "one"], "one", "two").should.eql ["three"]

    describe "Util.isClean should reject", ->
      specify "1D arrays with NaN", ->
        arr = [1, NaN, 3, 4, 5]
        Util.isCleanArray(arr).should.equal false

      specify "1D arrays with Inf", ->
        arr = [1, Infinity, 3, 4, 5]
        Util.isCleanArray(arr).should.equal false

      specify "1D arrays with non-numeric values", ->
        arr = ['a', 2, 3, 4, 5]
      #isCleanArray(arr).should.equal false

      specify "Nested arrays containing Infinity", ->
        arr = [[1, 2, 3, 4], [1, 2, 3, 4], [1, Infinity, 3, 4], [1, 2, 3, 4]]
      #isCleanArray(arr).should.equal false

      specify "Nested arrays containing NaN", ->
        arr = [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, NaN, 4], [1, 2, 3, 4]]
  #isCleanArray(arr).should.equal false
