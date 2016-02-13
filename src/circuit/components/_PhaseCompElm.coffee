CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class PhaseCompElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getDumpType: ->
    "161"

module.exports = PhaseCompElm
