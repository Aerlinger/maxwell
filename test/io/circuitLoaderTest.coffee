CircuitLoader = require('../../src/io/circuitLoader.coffee')
fs = require('fs')

describe "CircuitLoader", ->
  in_callback = "before"
  circuit = null

  beforeEach (done) ->
    fs.readFile "./circuits/voltdividesimple.json", (err, data) ->
      if(err)
        console.log(err)

      voltdivide_json = JSON.parse(data)
      in_callback = "done"
      circuit = CircuitLoader.createCircuitFromJsonData(voltdivide_json)
      done()

  it "has only 7 elements", (done) ->
    circuit.numElements().should.equal 7
    done()

  it "has correct completionStatus", (done) ->
    circuit.Params.completionStatus.should.equal "complete"
    done()

  it "has correct currentSpeed", (done) ->
    circuit.Params.currentSpeed.should.equal 103
    done()

  it "has correct description", (done) ->
    circuit.Params.description.should.equal "A simple voltage divider circuit"
    done()

  it "has correct flags", (done) ->
    circuit.Params.flags.should.equal 1
    done()

  it "has correct unique name", (done)->
    console.log circuit.Params.name
    circuit.Params.name.should.equal "voltdivide.txt"
    done()

  it "has correct power range", (done)->
    circuit.Params.powerRange.should.equal 62.0
    done()

  it "has correct simSpeed", (done)->
    circuit.Params.simSpeed.should.equal 116
    done()

  it "has correct timeStep", (done)->
    circuit.Params.timeStep.should.equal 5.0e-6
    done()

  it "has correct title", (done)->
    circuit.Params.title.should.equal "Voltage Divider"
    done()

  it "has correct topic", (done)->
    circuit.Params.topic.should.equal "Basics"
    done()

  it "has correct voltage_range", (done)->
    circuit.Params.voltageRange.should.equal 10.0
    done()
