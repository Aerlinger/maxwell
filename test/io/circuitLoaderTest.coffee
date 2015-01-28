require('../../src/io/circuitLoader.coffee')

describe "CircuitLoader", ->

  describe "should read voltdividesimple.json and", ->
    before (done) ->
      CircuitLoader.createCircuitFromJsonFile "../../circuits/voltdividesimple.json", (circuit) =>
        @circuit = circuit
        done()

    it "have only 7 elements", ->
      @circuit.numElements().should.equal 7

    describe "should load parameters", ->
      it "has correct completionStatus", ->
        @circuit.Params.completionStatus.should.equal "complete"

      it "has correct currentSpeed", ->
        @circuit.Params.currentSpeed.should.equal 63.0

      it "has correct description", ->
        @circuit.Params.description.should.equal "A simple voltage divider circuit"

      it "has correct flags", ->
        @circuit.Params.flags.should.equal 1

      it "has correct unique name", ->
        console.log @circuit.Params.name
        @circuit.Params.name.should.equal "voltdivide.txt"

      it "has correct power range", ->
        @circuit.Params.powerRange.should.equal 62.0

      it "has correct simSpeed", ->
        @circuit.Params.simSpeed.should.equal 10.0

      it "has correct timeStep", ->
        @circuit.Params.timeStep.should.equal 5.0e-6

      it "has correct title", ->
        @circuit.Params.title.should.equal "Voltage Divider"

      it "has correct topic", ->
        @circuit.Params.topic.should.equal "Basics"

      it "has correct voltage_range", ->
        @circuit.Params.voltageRange.should.equal 10.0
