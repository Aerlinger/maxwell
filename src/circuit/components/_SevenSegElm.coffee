CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("../ChipElm.coffee")
Util = require('../../util/util.coffee')

class SevenSegElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)



module.exports = SevenSegElm
