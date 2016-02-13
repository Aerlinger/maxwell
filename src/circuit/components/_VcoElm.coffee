CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class VcoElm extends ChipElm
  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getDumpType: ->
    "158"

module.exports = VcoElm
