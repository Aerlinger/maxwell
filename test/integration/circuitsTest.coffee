glob = require("glob")
path = require("path")
fs = require("fs")

CircuitComparator = require("../support/CircuitComparator.coffee")

Maxwell = require("../../src/Maxwell.coffee")
jsondiffpatch = require('jsondiffpatch').create({});

@epsilon_error = ["diodeclip", "diodecurve", "impedance", "lrc", "diodevar", "opint", "mosfetamp", "inductac"]
@inaccurate = ["induct", "inductac"]

@transistors = ["npn", "pnp"]
@mosfets = ["pmosfet", "nmosfet"]
@opamps = [
  "opamp"
  "opampfeedback"
  "amp-invert"

  "amp-diff" # need p,
  "amp-follower"
  "amp-fullrect"
  "amp-integ"
  "amp-invert"
  "amp-noninvert"
  "amp-rect"
  "amp-schmitt"
  "amp-sum"
  "relaxosc"
  "sawtooth"
  "howland"
  "logconvert"
  "nic-r"
  "itov"
  "capmult"
  "gyrator"

  "amp-dfdx"
  "allpass2"

  "opamp-regulator"  # need 174
  "allpass1"  # need 170
]

@circuitNames = [
  "ohms",
  "resistors",
  "voltdivide",
  "thevenin",
  "norton",
  "diodelimit",
  "diodelimit",
  "pot",
  "mosfetamp",
  "cap",
  "capac",
  "capmult",
  "lrc"
  "indpar"
  "inductac"
  "induct"
  "allpass2"

  "opamp"
  "opampfeedback"
  "amp-invert"

  "amp-diff"
  "amp-follower"
  "amp-fullrect"
  # "amp-integ"  # Failure
  "amp-invert"
  "amp-noninvert"
  "amp-rect"
  "amp-schmitt"
  "amp-sum"
#  "opamp-regulator"  # Failure (Zener?, PotElm?)
]

@notWorking = ["inductac"]
@key_error = ["res-series"]

for circuit_name in @circuitNames
  do (circuit_name) ->
    describe "#{circuit_name} circuit", ->
      it "STATIC results are correct", ->
        circuit_file = "#{circuit_name}.json"

        circuit = Maxwell.loadCircuitFromFile("./circuits/#{circuit_file}")

        circuit.updateCircuit()

        analysisValidationFileName = "./dump/#{circuit_name}.txt_ANALYSIS.json"
        analysisValidationJson = JSON.parse(fs.readFileSync(analysisValidationFileName))

        assert.deepEqual(circuit.toJson(), analysisValidationJson)
        jsondiffpatch.diff(circuit.toJson(), analysisValidationJson)

      it "FRAME calculations are correct", ->
        circuit_file = "#{circuit_name}.json"

        circuit = Maxwell.loadCircuitFromFile("./circuits/#{circuit_file}")

        circuit.updateCircuit()

        simulationValidationFileName = "./dump/#{circuit_name}.txt_FRAMES.json"
        simulationValidationJson = JSON.parse(fs.readFileSync(simulationValidationFileName))

        assert.deepEqual(circuit.frameJson(), simulationValidationJson)
        simulationDelta = jsondiffpatch.diff(circuit.frameJson(), simulationValidationJson)

