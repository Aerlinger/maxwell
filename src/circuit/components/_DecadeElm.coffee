CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("../ChipElm.coffee")
Util = require('../../util/util.coffee')

class DiacElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getDumpType: ->
    "163"

module.exports = DiacElm
