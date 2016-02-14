CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class LatchElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)
    @lastLoad = false
    @loadPin = 0

  getName: ->
    "Latch"

  getDumpType: ->
    "168"

  needsBits: ->
    true

  getPostCount: ->
    @bits * 2 + 1

  getVoltageSourceCount: ->
    @bits

  setupPins: ->
    @sizeX = 2
    @sizeY = @bits + 1
    @pins = new Pin[@getPostCount()]

    for i in [0...@bits]
      @pins[i] = new Pin(@bits - 1 - i, ChipElm.SIDE_W, "I" + i)

    for i in [0...@bits]
      @pins[i + @bits] = new Pin(@bits - 1 - i, ChipElm.SIDE_E, "O");
      @pins[i + @bits].output = true

    @loadPin = @bits * 2
    @pins[@loadPin] = new Pin(@bits, ChipElm.SIDE_W, "Ld")

    @allocNodes()

  execute: ->
    if @pins[@loadPin].value and !@lastLoad
      for i in [0...@bits]
        @pins[i + @bits].value = @pins[i].value

    @lastLoad = @pins[@loadPin].value


module.exports = LatchElm
