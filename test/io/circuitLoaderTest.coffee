# <DEFINE>
define [
  'cs!CircuitNode',
  'cs!CircuitLoader'
], (
  CircuitNode,
  CircuitLoader
) ->
# </DEFINE>

  describe "CircuitLoader", ->

    describe "should read voltdividesimple.json and", ->
      before (done) ->
        CircuitLoader.createCircuitFromJSON "../../circuits/voltdividesimple.json", (circuit) =>
          @circuit = circuit
          done()

      it "have only 7 elements", ->
        @circuit.numElements().should.equal 7

      describe "should load parameters", ->
        it "should have correct completionStatus", ->
          @circuit.Params.completionStatus.should.equal "complete"

        it "should have correct currentSpeed", ->
          @circuit.Params.currentSpeed.should.equal 63.0

        it "should have correct description", ->
          @circuit.Params.description.should.equal "A simple voltage divider circuit"

        it "should have correct flags", ->
          @circuit.Params.flags.should.equal 1

        it "should have correct unique name", ->
          console.log @circuit.Params.name
          @circuit.Params.name.should.equal "voltdivide.txt"

        it "should have correct power range", ->
          @circuit.Params.powerRange.should.equal 62.0

        it "should have correct simSpeed", ->
          @circuit.Params.simSpeed.should.equal 10.0

        it "should have correct timeStep", ->
          @circuit.Params.timeStep.should.equal 5.0e-6

        it "should have correct title", ->
          @circuit.Params.title.should.equal "Voltage Divider"

        it "should have correct topic", ->
          @circuit.Params.topic.should.equal "Basics"

        it "should have correct voltage_range", ->
          @circuit.Params.voltageRange.should.equal 10.0
