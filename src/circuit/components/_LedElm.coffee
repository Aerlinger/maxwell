CircuitComponent = require("../CircuitComponent.coffee")
DiodeElm = require("./DiodeElm.coffee")
DrawUtil = require('../../util/drawUtil.coffee')

class LedElm extends DiodeElm

  @ParameterDefinitions = {
    colorR: {
      name: "Red Intensity"
      data_type: parseFloat
    }
    colorG: {
      name: "Green Intensity"
      data_type: parseFloat
    }
    colorB: {
      name: "Blue Intensity"
      data_type: parseFloat
    }
  }


  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    if ((f & DiodeElm.FLAG_FWDROP) == 0)
      @fwdrop = 2.1024259

    @setup()




module.exports = LedElm
