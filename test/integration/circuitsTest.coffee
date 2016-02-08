glob = require("glob")
path = require("path")
fs = require("fs")

CircuitComparator = require("../support/CircuitComparator.coffee")

Maxwell = require("../../src/Maxwell.coffee")
jsondiffpatch = require('jsondiffpatch').create({});

describe "Testing all circuits", ->
  @timeout(30000)

  before ->
    filenames = glob.sync "./circuits/*.txt", {}

    @files = filenames.map (file) ->
      path.basename(file, ".txt")

  it "detects a close object", ->
    expect({})

  it "tests each circuit", ->
    @files = ["ohms", "resistors", "inductac", "voltdivide", "thevenin", "norton", "diodelimit", "diodelimit", "pot"]
    @epsilon_error = ["diodeclip", "diodecurve", "impedance", "lrc", "diodevar", "opint", "mosfetamp"]
    @key_error = ["res-series"]

#    @files = ["ohms", "voltdivide", "cap", "capac", "diodecurve", "diodevar", "opamp", "diodeclip", "induct"]
#    @files = ["capseries"]
    @transistors = ["npn", "pnp"]
    @mosfets = ["pmosfet", "nmosfet"]
    @jfets = ["opampint"]

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

#    @files = @jfets
    @files = ["mosfetamp"]
#
    for circuit_name in @files
      circuit_file = "#{circuit_name}.json"

      circuit = Maxwell.loadCircuitFromFile("./circuits/#{circuit_file}")

      circuit.updateCircuit()

      analysisValidationFileName = "./dump/#{circuit_name}.txt_ANALYSIS.json"
      analysisValidationJson = JSON.parse(fs.readFileSync(analysisValidationFileName))

      assert.deepEqual(circuit.toJson(), analysisValidationJson)
      jsondiffpatch.diff(circuit.toJson(), analysisValidationJson)

      simulationValidationFileName = "./dump/#{circuit_name}.txt_FRAMES.json"
      simulationValidationJson = JSON.parse(fs.readFileSync(simulationValidationFileName))

      assert.deepEqual(circuit.frameJson(), simulationValidationJson)
      simulationDelta = jsondiffpatch.diff(circuit.frameJson(), simulationValidationJson)

#      simulationFlatDelta = flatdiff.diff(circuit.frameJson(), simulationValidationJson)

#      { '0': { x: [ 50, 176 ], y: [ 25, 80 ], y2: [ 25, 80 ] },
#      '1': { y: [ 25, 80 ], y2: [ 25, 80 ] },
#      '2':
#      { x: [ 50, 176 ],
#        y: [ 25, 80 ],
#        x2: [ 50, 176 ],
#        y2: [ 230, 352 ] },
#      '3':
#      { x: [ 50, 176 ],
#        y: [ 230, 352 ],
#        y2: [ 230, 352 ],
#        params: { capacitance: [Object], voltDiff: [Object], voltdiff: [Object] } },
#      '4': { y: [ 25, 80 ], y2: [ 230, 352 ] },
#      '5': { y: [ 230, 352 ], y2: [ 25, 80 ] },
#      '6': { y: [ 230, 352 ], y2: [ 230, 352 ] },