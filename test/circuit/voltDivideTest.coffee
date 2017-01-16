describe "Voltage Divider", ->
  before (done) ->
    voltdivide = JSON.parse(fs.readFileSync("./circuits/v3/ohms.json"))
    @circuit = CircuitLoader.createCircuitFromJsonData(voltdivide)

    done()

    @circuit.updateCircuit()

  it "has correct values", ->
    expect(@circuit.inspect()).to.deep.equal(
      [
        {
          "current": 0.05
          "name": "Resistor"
          "params": [
            100
          ]
          "pos": [
            256
            176
            256
            304
          ]
          "voltage": 5
        }
        {
          "current": 0.055
          "name": "Variable Voltage Rail"
          "params": [
            6
            5
            5
            0
            0
            0.5
            "Voltage"
          ]
          "pos": [
            304
            176
            304
            128
          ]
          "voltage": 5
        }
        {
          "current": 0.05
          "name": "Ground"
          "params": []
          "pos": [
            256
            336
            256
            352
          ]
          "voltage": 0
        }
        {
          "current": 0.05
          "name": "Wire"
          "params": []
          "pos": [
            256
            304
            256
            336
          ]
          "voltage": -0
        }
        {
          "current": 0.005
          "name": "Resistor"
          "params": [
            1000
          ]
          "pos": [
            352
            176
            352
            304
          ]
          "voltage": 5
        }
        {
          "current": 0.005
          "name": "Wire"
          "params": []
          "pos": [
            352
            304
            352
            336
          ]
          "voltage": 0
        }
        {
          "current": 0.005
          "name": "Ground"
          "params": []
          "pos": [
            352
            336
            352
            352
          ]
          "voltage": 0
        }
        {
          "current": 0.005
          "name": "Wire"
          "params": []
          "pos": [
            304
            176
            352
            176
          ]
          "voltage": 5
        }
        {
          "current": -0.05
          "name": "Wire"
          "params": []
          "pos": [
            256
            176
            304
            176
          ]
          "voltage": 5
        }
      ]
    )

  describe "Running updateCircuit", ->
    before ->
      @circuit.updateCircuit()

