VoltageElm = require('../../src/circuit/components/VoltageElm.js')

describe "CircuitLoader", ->
  it "converts params from deprecated array syntax to hash-like syntax", ->
    param_list = [
      "0",
      "40.0",
      "5.0",
      "0.0"
    ]

    result = {}

    Fields = VoltageElm.Fields

    for i in [0...param_list.length]
      param_name = Object.keys(Fields)[i]
      definition = Fields[param_name]
      data_type = definition.data_type

      param_value = param_list[i]
      result[param_name] = data_type(param_value)

    expect(result).to.deep.equal({
        "bias": 0
        "frequency": 40
        "maxVoltage": 5
        "waveform": 0
    })
