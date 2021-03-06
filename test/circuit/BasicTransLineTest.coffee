describe "Basic TL", ->
  before (done) ->
    @tlCircuit = {
      params: {
        "type": "tl.txt",
        "timeStep": 5e-12,
        "simSpeed": 172,
        "currentSpeed": 50,
        "voltageRange": 5,
        "powerRange": 50,
        "flags": 1
      },
      components: [
        {
          "name": "TransLineElm",
          "pos": [176, 240, 496, 240],
          "flags": 0,
          "params": {
            "delay": 3e-8,
            "imped": 75,
            "channelWidth": 80,
            "resistance": 0
          }
        },
        {
          "name": "WireElm",
          "pos": [176, 240, 128, 240],
          "flags": 0,
          "params": {}
        },
        {
          "name": "WireElm",
          "pos": [128, 320, 176, 320],
          "flags": 0,
          "params": {}
        },
        {
          "name": "WireElm",
          "pos": [496, 240, 544, 240],
          "flags": 0,
          "params": {}
        },
        {
          "name": "WireElm",
          "pos": [496, 320, 544, 320],
          "flags": 0,
          "params": {}
        },
        {
          "name": "ResistorElm",
          "pos": [544, 240, 544, 320],
          "flags": 0,
          "params": {
            "resistance": 75
          }
        },
        {
          "name": "VoltageElm",
          "pos": [128, 320, 128, 240],
          "flags": 0,
          "params": {
            "waveform": 1,
            "frequency": 40000000,
            "maxVoltage": 5,
            "bias": 0,
            "phaseShift": 0,
            "dutyCycle": 0.5
          }
        }
      ]
    }

    @circuit = CircuitLoader.createCircuitFromJsonData("Transline", @tlCircuit)
    @circuit.updateCircuit()

    done()

  it "has correct value", ->
    


