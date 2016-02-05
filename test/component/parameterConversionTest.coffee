VoltageElm = require('../../src/circuit/components/VoltageElm.coffee')

describe "CircuitLoader", ->
  it "converts params from deprecated array syntax to hash-like syntax", ->
    convert = {
      "float": parseFloat,
      "integer": parseInt,
      "sign": Math.sign
    }

    param_list = [
      "0",
      "40.0",
      "5.0",
      "0.0"
    ]

    result = {}

    ParameterDefinitions = VoltageElm.ParameterDefinitions

    for i in [0...param_list.length]
      param_name = Object.keys(ParameterDefinitions)[i]
      definition = ParameterDefinitions[param_name]
      data_type = definition.data_type

      param_value = param_list[i]
      result[param_name] = data_type(param_value)

    expect(result).to.deep.equal({
        "bias": 0
        "frequency": 40
        "maxVoltage": 5
        "waveform": 0
    })


