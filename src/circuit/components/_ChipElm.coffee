CircuitComponent = require("../CircuitComponent.coffee")
Util = require('../../util/util.coffee')

class ChipElm extends CircuitComponent
  @Fields = {
    bits: {
      name: "Bits"
      data_type: parseInt
    }
    volts: {
      name: "Volts"
      data_type: parseFloat
    }
  }

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)




module.exports = ChipElm
