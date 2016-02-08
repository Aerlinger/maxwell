CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("../ChipElm.coffee")
DrawUtil = require('../../util/drawUtil.coffee')

class SevenSegElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)



module.exports = SevenSegElm
