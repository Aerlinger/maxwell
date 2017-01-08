CircuitComponent = require("../circuitComponent.js")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class AdcElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getName: ->
    "ADC"

  getVoltageSourceCount: ->
    @bits

  getPostCount: ->
    @bits + 2

  getDumpType: ->
    "167"

  needsBits: ->
    true

  setupPins: ->
    @sizeX = 2
    @sizeY = if (@bits > 2) then @bits else 2
    @pins = new Array(@getPostCount())

    for i in [0...@bits]
      @pins[i] = new ChipElm.Pin(@bits - 1 - i, ChipElm.SIDE_E, "D" + i)
      @pins[i].output = true

    @pins[@bits] = new ChipElm.Pin(0, ChipElm.SIDE_W, "In")
    @pins[@bits + 1] = new ChipElm.Pin(@sizeY - 1, ChipElm.SIDE_W, "V+")

  execute: ->
    imax = (1 << @bits) - 1

    val = imax * @volts[@bits] / @volts[@bits + 1]

    ival = Math.floor(val)

    ival = Math.min(imax, Math.max(0, ival))

    for i in [0...@bits]
      @pins[i].value = ((ival & (1 << i)) != 0)

module.exports = AdcElm

