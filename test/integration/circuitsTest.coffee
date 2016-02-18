glob = require("glob")
path = require("path")
fs = require("fs")
Maxwell = require("../../src/Maxwell.coffee")
jsondiffpatch = require('jsondiffpatch').create({});
CircuitComparator = require("../support/CircuitComparator.coffee")
_ = require("lodash")

chai = require('chai')

chai.config.showDiff = false

assert = chai.assert
expect = chai.expect

Util = require('../../src/util/util.coffee')

filenames = glob.sync "./circuits/*.txt", {}

@files = filenames.map (file) ->
  path.basename(file, ".txt")

#@skip = [
#  "counter", "555monostable", "555sequencer", "3-invert", "dram", "fulladd", "fullrect", "3-f220", "3-f221", "3-f211",
#  "cmosnand", "cmosinverterslow", "cmosff", "ccinductor"
#]

@full_working = [
  'allpass2', 'amp-dfdx', 'amp-diff', 'amp-follower','amp-fullrect','amp-invert','amp-noninvert','amp-rect',
  'amp-schmitt','amp-sum','besselbutter','butter10lo','cap','capac','capmult','capmultcaps','capmultfreq','cappar',
  'capseries','classd','coupled2','coupled3','currentsrcelm','dcrestoration','diff','diodeclip','diodecurve',
  'diodelimit','follower','grid','grid2','gyrator','impedance','indpar','indseries','induct','inductac','invertamp',
  'ladder','lrc-critical','lrc','moscurrentramp','moscurrentsrc','mosfetamp','mosfollower','mosmirror',
  'mosswitch','nic-r','nmosfet','norton','ohms','opamp','opampfeedback','phaseseq','phaseshiftosc','pmosfet','pot',
  'potdivide','pushpullxover','rectify','relaxosc','res-par','res-series','resistors','ringing','sine',
  'spark-sawtooth','spikegen','thevenin','triangle','voltdivide','voltdouble','voltdouble2','voltquad','volttriple',
  "inv-osc", "voltinvert", "switchedcap", "switchfilter", "mr", "mr-crossbar", "mr-sine", "mr-sine2", "mr-sine3",
  "mr-square", "mr-triangle", "vco", "jfetcurrentsrc", "jfetamp", "jfetfollower"
]

@opamps = [
  "opamp", "opampfeedback", "amp-invert", "amp-diff", "amp-follower", "amp-fullrect", "amp-integ", "amp-invert",
  "amp-noninvert", "amp-rect", "amp-schmitt", "amp-sum", "relaxosc", "sawtooth", "howland", "logconvert", "nic-r",
  "itov", "capmult", "gyrator", "amp-dfdx", "allpass2", "opamp-regulator"
]

@files = _.difference(@files, @skip)
#@files = [
#  "tdosc"
#  "tdrelax"
#  "tdiode"
#]
#  "pll"
#  "pll2"
#  "pll2a"
#  "freqdouble"
#  "relayctr"
#  "relaymux"
#  "relaytff"
#]

for circuit_name in @files
  do (circuit_name) ->
    describe "All Circuits", ->
      it "STATIC #{circuit_name}", =>
        circuit_file = "#{circuit_name}.json"

        circuit = Maxwell.loadCircuitFromFile("./circuits/#{circuit_file}")

        circuit.updateCircuit()

        analysisValidationFileName = "./dump/#{circuit_name}.txt_ANALYSIS.json"
        analysisValidationJson = JSON.parse(fs.readFileSync(analysisValidationFileName))

#        fs.writeFileSync("#{circuit_name}_test_analysis.json", JSON.stringify(circuit.toJson(), null, 2))

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

#        fs.writeFileSync("#{circuit_name}_test_frame.json", JSON.stringify(circuit.frameJson(), null, 2))

        deltas = approx_diff(circuit.frameJson(), simulationValidationJson)

        if deltas.length > 0
          assert.deepEqual(circuit.frameJson(), simulationValidationJson)
        else
          expect(deltas).to.eql([])
