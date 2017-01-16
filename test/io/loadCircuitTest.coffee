CircuitLoader = require("../../src/io/circuitLoader.js")
fs = require 'fs'

describe "CircuitLoader", ->
  describe "reads voltdividesimple.json and", ->
    before (done) ->
      voltdividesimple = JSON.parse(fs.readFileSync("./circuits/v3/voltdividesimple.json"))

      @circuit = CircuitLoader.createCircuitFromJsonData(voltdividesimple)
      done()

    it "have only 7 elements", ->
      @circuit.numElements().should.equal 7

    describe "should load parameters", ->
      it "has correct completionStatus", ->
        expect(@circuit.Params.completionStatus).to.equal "in development"

      it "has correct currentSpeed", ->
        @circuit.Params.currentSpeed.should.equal 63

      it "has correct flags", ->
        @circuit.Params.flags.should.equal 1

      it "has correct unique name", ->
        console.log @circuit.Params.name
        @circuit.Params.name.should.equal "default"

      it "has correct power range", ->
        @circuit.Params.powerRange.should.equal 62.0

      it "has correct simSpeed", ->
        expect(@circuit.Params.simSpeed).to.equal 172

      it "has correct timeStep", ->
        @circuit.Params.timeStep.should.equal 5.0e-6

      it "has correct title", ->
        @circuit.Params.title.should.equal "Default"

      it "has correct voltage_range", ->
        @circuit.Params.voltageRange.should.equal 10.0
