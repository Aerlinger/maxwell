CircuitComponent = require("../CircuitComponent.coffee")
DrawUtil = require('../../util/drawUtil.coffee')

class TriacElm extends CircuitComponent

  @ParameterDefinitions = {
    volts: {
      name: "Volts"
      data_type: parseFloat
    }
    triggerI: {
      name: "Trigger current"
      data_type: parseFloat
    }
    holdingI: {
      name: "Holding current"
      data_type: parseFloat
    }
    cresistance: {
      name: "Collector resistance"
      data_type: parseFloat
    }
  }


  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)



module.exports = TriacElm
