CircuitComponent = require("../circuitComponent.coffee")
Util = require('../../util/util.coffee')

class TriacElm extends CircuitComponent
  @Fields = {
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
