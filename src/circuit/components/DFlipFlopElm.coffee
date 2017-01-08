CircuitComponent = require("../circuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class DFlipFlopElm extends ChipElm
  @FLAG_RESET = 2

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @pins[2].value = !@pins[1].value

  getDumpType: ->
    "155"

  getName: ->
    "D flip-flop"

  getPostCount: ->
    if @hasReset() then 5 else 4

  getVoltageSourceCount: ->
    2

  hasReset: ->
    (@flags & DFlipFlopElm.FLAG_RESET) != 0

  setupPins: ->
    @sizeX = 2
    @sizeY = 3

    @pins = new Array(@getPostCount())

    @pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "D")

    @pins[1] = new ChipElm.Pin(0, ChipElm.SIDE_E, "Q")
    @pins[1].output = @pins[1].state = true

    @pins[2] = new ChipElm.Pin(2, ChipElm.SIDE_E, "Q")
    @pins[2].output = true
    @pins[2].lineOver = true

    @pins[3] = new ChipElm.Pin(1, ChipElm.SIDE_W, "")
    @pins[3].clock = true

    if @hasReset()
      @pins[4] = new ChipElm.Pin(2, ChipElm.SIDE_W, "R")

  execute: ->
    if @pins[3].value && !@lastClock
      @pins[1].value = @pins[0].value
      @pins[2].value = !@pins[0].value

    if @pins.length > 4 && @pins[4].value
      @pins[1].value = false
      @pins[2].value = true

    @lastClock = @pins[3].value

    #console.log("DFF #{@pins[1].value}")

module.exports = DFlipFlopElm
