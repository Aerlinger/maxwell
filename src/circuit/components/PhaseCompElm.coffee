CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class PhaseCompElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getName: ->
    "Phase comparator"

  setupPins: ->
    @sizeX = 2
    @sizeY = 2
    @pins = new Array(3)

    @pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "I1")
    @pins[1] = new ChipElm.Pin(1, ChipElm.SIDE_W, "I2")
    @pins[2] = new ChipElm.Pin(0, ChipElm.SIDE_E, "O")

    @pins[2].output = true

  getDumpType: ->
    "161"

  getPostCount: ->
    3

  getVoltageSourceCount: ->
    1

  nonLinear: ->
    true

  stamp: (stamper) ->
    vn = @getParentCircuit().getNodes().length + @pins[2].voltSource

    stamper.stampNonLinear(vn)
    stamper.stampNonLinear(0)
    stamper.stampNonLinear(@nodes[2])

  doStep: (stamper) ->
    v1 = @volts[0] > 2.5
    v2 = @volts[1] > 2.5

    if (v1 && !@pins[0].value)
      @ff1 = true;
    if (v2 && !@pins[1].value)
      @ff2 = true;
    if (@ff1 && @ff2)
      @ff1 = @ff2 = false

    if @ff1
      out = 5
    else
      if @ff2
        out = 0
      else
        out = -1

    if out != -1
      stamper.stampVoltageSource(0, @nodes[2], @pins[2].voltSource, out)
    else
      vn = @getParentCircuit().numNodes() + @pins[2].voltSource
      stamper.stampMatrix(vn, vn, 1)

    @pins[0].value = v1
    @pins[1].value = v2

module.exports = PhaseCompElm
