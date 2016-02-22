glob = require("glob")
path = require("path")
fs = require("fs")
Maxwell = require("../../src/Maxwell.coffee")
jsondiffpatch = require('jsondiffpatch').create({});
CircuitComparator = require("../support/CircuitComparator.coffee")
Renderer = require('../../src/render/renderer.coffee')
_ = require("lodash")

chai = require('chai')

chai.config.showDiff = false

assert = chai.assert
expect = chai.expect

Util = require('../../src/util/util.coffee')

filenames = glob.sync "./circuits/*.txt", {}

@files = filenames.map (file) ->
  path.basename(file, ".txt")

@skip = [
  'transformerup',
  'tdrelax'
  'tesla'
  'transformer'
  'transformerdc'
  'transformerdown'
  'longdist'
  'cciamp'
  'ccvccs'
  'opint-current'
  'opint-invert-amp'
  'opint-slew'
]

@files = _.difference(@files, @skip)
#@files = [
#  'cciamp',   # Numerical error, R? o?
#  'ccvccs'   # Numerical error, R?, o?
#  'dtlnor',   # Permute R?, o?
#  'deltasigma'
#  'dram'      # AND
#  'mux3state',   # AND
#  'phasecompint'  # AND?
#  'opint-current',   # Permute?, R?, o?
#  'opint-invert-amp'  # PERMUTE, R?, o?
#  'opint-slew'      # PERMUTE, R?, o?
#  'relayctr'
#  'relaytff'
#  'ringmod'
#  'traffic'
#
#  'vco'
#  'opamp-regulator'
#]

for circuit_name in @files
  do (circuit_name) ->
    describe "#{circuit_name} test", ->
      it "STATIC #{circuit_name}", =>
        circuit_file = "#{circuit_name}.json"

        circuit = Maxwell.loadCircuitFromFile("./circuits/#{circuit_file}")

        circuit.updateCircuit()

        analysisValidationFileName = "./dump/#{circuit_name}.txt_ANALYSIS.json"
        analysisValidationJson = JSON.parse(fs.readFileSync(analysisValidationFileName))

        fs.writeFileSync("test/fixtures/dump/#{circuit_name}_TEST_ANALYSIS.json", JSON.stringify(circuit.toJson(), null, 2))

        deltas = approx_diff(circuit.toJson(), analysisValidationJson)

        if deltas.length > 0
          assert.deepEqual(circuit.toJson(), analysisValidationJson)
        else
          expect(deltas).to.eql([])

      it "FRAME #{circuit_name}", =>
        circuit_file = "#{circuit_name}.json"

        circuit = Maxwell.loadCircuitFromFile("./circuits/#{circuit_file}")

        circuit.updateCircuit()

        simulationValidationFileName = "./dump/#{circuit_name}.txt_FRAMES.json"
        simulationValidationJson = JSON.parse(fs.readFileSync(simulationValidationFileName))

        fs.writeFileSync("test/fixtures/dump/#{circuit_name}_TEST_FRAME.json", JSON.stringify(circuit.frameJson(), null, 2))

        deltas = approx_diff(circuit.frameJson(), simulationValidationJson)

        if deltas.length > 0
          assert.deepEqual(circuit.frameJson(), simulationValidationJson)
        else
          expect(deltas).to.eql([])

      it "RENDERS #{circuit_name}", =>
        circuit_file = "#{circuit_name}.json"

        circuit = Maxwell.loadCircuitFromFile("./circuits/#{circuit_file}")

#        circuit.updateCircuit()

        Canvas = require('canvas')
        @canvas = new Canvas(800, 600)
        ctx = @canvas.getContext('2d')

        @renderer = new Renderer(circuit, @canvas)
        @renderer.context = ctx

        @renderer.draw()

        fs.writeFileSync("test/fixtures/circuitRenders/#{circuit_name}_init.png", @canvas.toBuffer())

#        simulationValidationFileName = "./dump/#{circuit_name}.txt_FRAMES.json"
#        simulationValidationJson = JSON.parse(fs.readFileSync(simulationValidationFileName))

        #        fs.writeFileSync("#{circuit_name}_test_frame.json", JSON.stringify(circuit.frameJson(), null, 2))

#        deltas = approx_diff(circuit.frameJson(), simulationValidationJson)

#        if deltas.length > 0
#          assert.deepEqual(circuit.frameJson(), simulationValidationJson)
#        else
#          expect(deltas).to.eql([])
