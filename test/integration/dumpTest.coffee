Maxwell = require('../../src/Maxwell')

describe "capturing output of a circuit", ->
  beforeEach ->
    @circuit = Maxwell.loadCircuitFromFile('../../voltdividesimple.json')
    done()

  it "loads the circuit", ->
    expect(@circuit.numElements()).to eq 10
