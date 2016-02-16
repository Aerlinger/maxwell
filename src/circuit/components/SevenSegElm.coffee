CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")

class SevenSegElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getDumpType: ->
    "157"

  getPostCount: ->
    7

  getVoltageSourceCount: ->
    0

  getName: ->
    "7 segment display"

  setupPins: ->
    @sizeX = 4
    @sizeY = 4

    @pins = new Array(7)

    @pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "A")
    @pins[1] = new ChipElm.Pin(1, ChipElm.SIDE_W, "B")
    @pins[2] = new ChipElm.Pin(2, ChipElm.SIDE_W, "C")
    @pins[3] = new ChipElm.Pin(3, ChipElm.SIDE_W, "D")
    @pins[4] = new ChipElm.Pin(1, ChipElm.SIDE_S, "E")
    @pins[5] = new ChipElm.Pin(2, ChipElm.SIDE_S, "F")
    @pins[6] = new ChipElm.Pin(3, ChipElm.SIDE_S, "G")

module.exports = SevenSegElm
