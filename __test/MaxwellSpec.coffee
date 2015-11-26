Circuit = require '../src/circuit/circuit.coffee'
CircuitLoader = require('../src/io/circuitLoader.coffee')
fs = require 'fs'
should = require 'should'

describe 'Writing Node with CoffeeScript', ->
  it 'is easy to get started testing... or is it?', -> true
  it 'can access exported functions in other modules', ->
#    @circuit = new Circuit()
    voltdividesimple = JSON.parse(fs.readFileSync("./circuits/voltdividesimple.json"))
    @circuit = CircuitLoader.createCircuitFromJsonData(voltdividesimple)
