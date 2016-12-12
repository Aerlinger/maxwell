CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class CC2Elm extends ChipElm
#  @Fields = {
#    gain: {
#      name: "Gain"
#      data_type: parseFloat
#    }
#  }

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    if params
      @gain = parseFloat(params[0])
    else
      @gain = 1

    @params['gain'] = @gain
#    @params = { gain: @gain }

  getName: ->
    "CC2"

  setupPins: ->
    @sizeX = 2
    @sizeY = 3

    @pins = new Array(3)
    @pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "X")
    @pins[0].output = true
    @pins[1] = new ChipElm.Pin(2, ChipElm.SIDE_W, "Y")
    @pins[2] = new ChipElm.Pin(1, ChipElm.SIDE_E, "Z")

  stamp: (stamper) ->
    stamper.stampVoltageSource(0, @nodes[0], @pins[0].voltSource)
    stamper.stampVCVS(0, @nodes[1], 1, @pins[0].voltSource)

    stamper.stampCCCS(0, @nodes[2], @pins[0].voltSource, @gain)

  draw: (renderContext) ->
    @pins[2].current = @pins[0].current * @gain
    @drawChip(renderContext)

  getPostCount: ->
    3

  getVoltageSourceCount: ->
    1

  getDumpType: ->
    "179"

module.exports = CC2Elm
