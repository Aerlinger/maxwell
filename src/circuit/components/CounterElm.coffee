CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class CounterElm extends ChipElm
  @FLAG_ENABLE = 2

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getDumpType: ->
    "164"

  needsBits: ->
    true

  getName: ->
    "Counter"

  getPostCount: ->
    if @hasEnable()
      return @bits + 3
    else
      return @bits + 2

  hasEnable: ->
    (@flags & CounterElm.FLAG_ENABLE) != 0

  getVoltageSourceCount: ->
    @bits

  setupPins: ->
    @sizeX = 2
    @sizeY = if (@bits > 2) then @bits else 2

    @pins = new Array(@getPostCount())

    @pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "")
    @pins[0].clock = true
    @pins[1] = new ChipElm.Pin(@sizeY - 1, ChipElm.SIDE_W, "R")
    @pins[1].bubble = true

    for i in [0...@bits]
      ii = i + 2
      @pins[ii] = new ChipElm.Pin(i, ChipElm.SIDE_E, "Q" + (@bits - i - 1))
      @pins[ii].output = @pins[ii].state = true

    if (@hasEnable())
      @pins[@bits + 2] = new ChipElm.Pin(@sizeY - 2, ChipElm.SIDE_W, "En")

    @allocNodes()

  execute: ->
    en = true

    if @hasEnable()
      en = @pins[@bits + 2].value

    if @pins[0].value && !@lastClock && en
      for i in [(@bits - 1)..0]
        ii = i + 2

        if !@pins[ii].value
          @pins[ii].value = true
          break

        @pins[ii].value = false

    if !@pins[1].value
      for i in [0...@bits]
        @pins[i + 2].value = false

    @lastClock = @pins[0].value

module.exports = CounterElm
