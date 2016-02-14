CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class JkFlipFlopElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @pins[4].value = !@pins[3].value;

  getDumpType: ->
    "156"

  getName: ->
    "JK flip-flop"

  getPostCount: ->
    5

  getVoltageSourceCount: ->
    2

  setupPins: ->
    @sizeX = 2
    @sizeY = 3

    @pins = new Array(5)
    @pins[0] = new Pin(0, ChipElm.SIDE_W, "J")
    @pins[1] = new Pin(1, ChipElm.SIDE_W, "")
    @pins[1].clock = true
    @pins[1].bubble = true
    @pins[2] = new Pin(2, ChipElm.SIDE_W, "K");
    @pins[3] = new Pin(0, ChipElm.SIDE_E, "Q");
    @pins[3].output = @pins[3].state = true;
    @pins[4] = new Pin(2, ChipElm.SIDE_E, "Q");
    @pins[4].output = true;
    @pins[4].lineOver = true;

  execute: ->
    if !@pins[1].value && @lastClock
      q = @pins[3].value

      if @pins[0].value
        if @pins[2].value
          q = !q
        else
          q = true
      else if @pins[2].value
        q = false

      @pins[3].value = q
      @pins[4].value = !q

    @lastClock = @pins[1].value


module.exports = JkFlipFlopElm
