glob = require("glob")
path = require("path")
fs = require("fs")
Maxwell = require("../../src/Maxwell.coffee")
jsondiffpatch = require('jsondiffpatch').create({});
CircuitComparator = require("../support/CircuitComparator.coffee")

chai = require('chai');
assert = chai.assert

chai.config.showDiff = false;

Util = require('../../src/util/util.coffee')

filenames = glob.sync "./circuits/*.txt", {}

@files = filenames.map (file) ->
  path.basename(file, ".txt")

@skip = ["counter"]

@full_working = [
  'allpass2', 'amp-dfdx', 'amp-diff', 'amp-follower','amp-fullrect','amp-invert','amp-noninvert','amp-rect',
  'amp-schmitt','amp-sum','besselbutter','butter10lo','cap','capac','capmult','capmultcaps','capmultfreq','cappar',
  'capseries','classd','coupled2','coupled3','currentsrcelm','dcrestoration','diff','diodeclip','diodecurve',
  'diodelimit','follower','grid','grid2','gyrator','impedance','indpar','indseries','induct','inductac','invertamp',
  'ladder','lrc-critical','lrc','moscurrentramp','moscurrentsrc','mosfetamp','mosfollower','mosmirror',
  'mosswitch','nic-r','nmosfet','norton','ohms','opamp','opampfeedback','phaseseq','phaseshiftosc','pmosfet','pot',
  'potdivide','pushpullxover','rectify','relaxosc','res-par','res-series','resistors','ringing','sine',
  'spark-sawtooth','spikegen','thevenin','triangle','voltdivide','voltdouble','voltdouble2','voltquad','volttriple' ]

@static_working = [ 'cc2imp',
  'cc2impn',
  'currentsrc',
  'diodevar',
  'eclosc',
  'hartley',
  'npn',
  'phasesplit',
  'sinediode',
  'spark-marx',
  'vco' ]

@frame_working = [ 'amp-integ',
  'coupled1',
  'fullrect',
  'fullrectf',
  'howland',
  'inductkick-block',
  'inductkick-snub',
  'inductkick',
  'peak-detect' ]

@epsilon_error = ["diodeclip", "diodecurve", "impedance", "lrc", "diodevar", "opint", "mosfetamp", "inductac"]
@inaccurate = ["induct", "inductac"]

@opamps = [
  "opamp", "opampfeedback", "amp-invert", "amp-diff", "amp-follower", "amp-fullrect", "amp-integ", "amp-invert",
  "amp-noninvert", "amp-rect", "amp-schmitt", "amp-sum", "relaxosc", "sawtooth", "howland", "logconvert", "nic-r",
  "itov", "capmult", "gyrator", "amp-dfdx", "allpass2", "opamp-regulator"
]

@notWorking = ["inductac"]
@key_error = ["res-series"]

#Util.removeFromArray(@files, @skip)

for circuit_name in @files
  do (circuit_name) ->
    describe "All Circuits", ->
      it "STATIC #{circuit_name}", =>
        this.simulation_type = "static"

        circuit_file = "#{circuit_name}.json"

        circuit = Maxwell.loadCircuitFromFile("./circuits/#{circuit_file}")

        circuit.updateCircuit()

        analysisValidationFileName = "./dump/#{circuit_name}.txt_ANALYSIS.json"
        analysisValidationJson = JSON.parse(fs.readFileSync(analysisValidationFileName))

        assert.deepEqual(circuit.toJson(), analysisValidationJson)
#        jsondiffpatch.diff(circuit.toJson(), analysisValidationJson)


      it "FRAME #{circuit_name}", =>
        this.simulation_type = "frame"

        circuit_file = "#{circuit_name}.json"

        circuit = Maxwell.loadCircuitFromFile("./circuits/#{circuit_file}")

        circuit.updateCircuit()

        simulationValidationFileName = "./dump/#{circuit_name}.txt_FRAMES.json"
        simulationValidationJson = JSON.parse(fs.readFileSync(simulationValidationFileName))

        assert.deepEqual(circuit.frameJson(), simulationValidationJson)
#        simulationDelta = jsondiffpatch.diff(circuit.frameJson(), simulationValidationJson)