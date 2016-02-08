CircuitComponent = require("../CircuitComponent.coffee")
DrawUtil = require('../../util/drawUtil.coffee')

class TunnelDiodeElm extends CircuitElm
  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @setup()



module.exports = TunnelDiodeElm
