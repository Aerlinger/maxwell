CircuitLoader = require "../../src/io/circuitLoader"
Circuit = require "../../src/core/circuit"
CircuitNode = require("../../src/core/nodeGraph/circuitNode").CircuitNode

describe "CircuitLoader", ->
  before () ->
    @circuit = new Circuit()


  describe "should read voltdividesimple.json and have", ->
    before (done) ->
      CircuitLoader.readCircuitFromFile @circuit, "./circuits/voltdividesimple.json", () =>
        done()

    it "7 elements", ->
      @circuit.numElements().should.equal 7