CircuitComponent = require("../circuitComponent.js")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class DecadeElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getName: ->
    "Decade counter"

  getDumpType: ->
    "163"

  needsBits: ->
    true

  getPostCount: ->
    @bits + 2

  getVoltageSourceCount: ->
    @bits

  setupPins: ->
    @sizeX = if @bits > 2 then @bits else 2
    @sizeY = 2

    @pins = new Array(@getPostCount())

    @pins[0] = new ChipElm.Pin(1, ChipElm.SIDE_W, "")
    @pins[0].clock = true
    @pins[1] = new ChipElm.Pin(@sizeX - 1, ChipElm.SIDE_S, "R")
    @pins[1].bubble = true

    for i in [0...@bits]
      ii = i + 2
      @pins[ii] = new ChipElm.Pin(i, ChipElm.SIDE_N, "Q" + i)
      @pins[ii].output = @pins[ii].state = true

    @allocNodes()

  execute: ->
    if @pins[0].value && !@lastClock
      for i in [0...@bits]
        if @pins[i + 2].value
          break

      if (i < @bits)
        @pins[i++ + 2].value = false

      i %= @bits

      @pins[i + 2].value = true

    if !@pins[1].value
      for i in [1...@bits]
        @pins[i + 2].value = false

      @pins[2].value = true

    @lastClock = @pins[0].value

module.exports = DecadeElm
