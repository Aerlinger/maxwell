CircuitComponent = require("../CircuitComponent.coffee")
Util = require('../../util/util.coffee')

class PhotoResistorElm extends CircuitComponent

  @ParameterDefinitions = {
    maxresistance: {
      name: "Max. Resistance"
      data_type: parseFloat
    }
    minresistance: {
      name: "Min. Resistance"
      data_type: parseFloat
    }
  }


constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)



module.exports = PhotoResistorElm
