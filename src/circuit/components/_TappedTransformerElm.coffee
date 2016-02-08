CircuitComponent = require("../CircuitComponent.coffee")
DrawUtil = require('../../util/drawUtil.coffee')

class TappedTransformerElm extends CircuitComponent

  @ParameterDefinitions = {
    inductance: {
      name: "Inductance"
      data_type: parseFloat
    }
    ratio: {
      name: "Ratio"
      data_type: parseInt
    }
    current: {
      name: "Current"
      data_type: parseFloat
    }
  }


  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)



module.exports = TappedTransformerElm
