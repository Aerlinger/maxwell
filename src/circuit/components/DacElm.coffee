CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class DacElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getDumpType: ->
    "166"

  needsBits: ->
    true

  getName: ->
    "DAC"

  getVoltageSourceCount: ->
    1

  getPostCount: ->
    @bits + 2

  setupPins: ->
    sizeY = if @bits > 2 then @bits else 2
    @pins = new Array(@getPostCount())

    for i in [0...@bits]
      @pins[i] = new ChipElm.Pin(@bits - 1 - i, ChipElm.SIDE_W, "D" + i)
      @pins[@bits] = new ChipElm.Pin(0, ChipElm.SIDE_E, "O")
      @pins[@bits].output = true
      @pins[@bits + 1] = new ChipElm.Pin(sizeY - 1, ChipElm.SIDE_E, "V+")

    @allocNodes()

  doStep: (stamper) ->
    ival = 0

    for i in [0...@bits]
      if @volts[i] > 2.5
        ival |= 1 << i

    ivalmax = (1 << @bits) - 1
    v = ival * @volts[@bits + 1] / ivalmax

    stamper.updateVoltageSource(0, @nodes[@bits], @pins[@bits].voltSource, v)

module.exports = DacElm
