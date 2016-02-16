CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class VcoElm extends ChipElm
  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @cResistance = 1e6

  getDumpType: ->
    "158"

  getName: ->
    "Voltage Controlled Oscillator"

  nonLinear: ->
    true

  getPostCount: ->
    6

  getVoltageSourceCount: ->
    3

  getDumpType: ->
    158

  setupPins: ->
    @sizeX = 2
    @sizeY = 4
    @pins = new Array(6)

    @pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "Vi")
    @pins[1] = new ChipElm.Pin(3, ChipElm.SIDE_W, "Vo")
    @pins[1].output = true

    @pins[2] = new ChipElm.Pin(0, ChipElm.SIDE_E, "C")
    @pins[3] = new ChipElm.Pin(1, ChipElm.SIDE_E, "C")
    @pins[4] = new ChipElm.Pin(2, ChipElm.SIDE_E, "R1")
    @pins[4].output = true

    @pins[5] = new ChipElm.Pin(3, ChipElm.SIDE_E, "R2")
    @pins[5].output = true

  computeCurrent: ->
    if @cResistance == 0
      return

    c = @cDir * (@pins[4].current + @pins[5].current) + (@volts[3] - @volts[2]) / @cResistance

    @pins[2].current = -c
    @pins[3].current = c
    @pins[0].current = -@pins[4].current

  stamp: (stamper) ->
    stamper.stampVoltageSource(0, @nodes[1], @pins[1].voltSource)
    stamper.stampVoltageSource(@nodes[0], @nodes[4], @pins[4].voltSource, 0)
    stamper.stampVoltageSource(0, @nodes[5], @pins[5].voltSource, 5)

    stamper.stampResistor(@nodes[2], @nodes[3], @cResistance)
    stamper.stampNonLinear(@nodes[2])
    stamper.stampNonLinear(@nodes[3])

  doStep: (stamper) ->
    vc = @volts[3] - @volts[2]
    vo = @volts[1]

    dir = if (vo < 2.5) then 1 else -1

    if (vo < 2.5 && vc > 4.5)
      vo = 5
      dir = -1

    if (vo > 2.5 && vc < 0.5)
      vo = 0
      dir = 1

    @updateVoltageSource(0, @nodes[1], @pins[1].voltSource, vo)

    cur1 = @getParentCircuit().getNodes().length + @pins[4].voltSource
    cur2 = @getParentCircuit().getNodes().length + @pins[5].voltSource

    stamper.stampMatrix(@nodes[2], cur1, dir)
    stamper.stampMatrix(@nodes[2], cur2, dir)
    stamper.stampMatrix(@nodes[3], cur1, -dir)
    stamper.stampMatrix(@nodes[3], cur2, -dir)

    @cDir = dir


  draw: (renderContext) ->
    @computeCurrent()
    @drawChip(renderContext)


module.exports = VcoElm
