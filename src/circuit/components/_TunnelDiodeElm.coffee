CircuitComponent = require("../CircuitComponent.coffee")
Util = require('../../util/util.coffee')

class TunnelDiodeElm extends CircuitElm
  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @setup()



module.exports = TunnelDiodeElm
