Rectangle = require("../../geom/rectangle.coffee")
Util = require("../../util/util.coffee")

class Scope

  @VAL_POWER = 1
  @VAL_IB = 1
  @VAL_IC = 2
  @VAL_IE = 3
  @VAL_VBE = 4
  @VAL_VBC = 5
  @VAL_VCE = 6
  @VAL_R = 2

  @Fields = [
    {
      id: "minMaxV"
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 5
      data_type: parseFloat
    },
    {
      id: "minMaxI"
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: .1
      data_type: parseFloat
    },
    {
      id: "speed"
      name: "Speed"
      unit: "Scalar"
      symbol: "x"
      default_value: 64
      data_type: parseFloat
    },
    {
      id: "showI"
      name: "Show I"
      unit: "boolean"
      symbol: ""
      default_value: false
      data_type: parseFloat
    },
    {
      id: "showFreq"
      name: "Show Freq"
      unit: "boolean"
      symbol: ""
      default_value: false
      data_type: parseFloat
    }
  ]

  constructor: ->
    @rect = Rectangle(0, 500, 200, 100)

  reset: ->
    @minMaxV = 5
    @minMaxI = .1
    @speed = 64
    @showI = showV = showMax = true
    @showFreq = lockScale = showMin = false
    @plot2d = false

    # no showI for Output
    if (elm != null && (@elm instanceof OutputElm || @elm instanceof LogicOutputElm || @elm instanceof ProbeElm))
      @showI = false

    @value = @ivalue = 0

    if (@elm instanceof TransistorElm)
      @value = VAL_VCE


  resetGraph: ->
    @scopePointCount = 1

    while (@scopePointCount <= @rect.width)
      @scopePointCount *= 2

    @minV = Util.zeroArray(@scopePointCount)
    @maxV = Util.zeroArray(@scopePointCount)
    @minI = Util.zeroArray(@scopePointCount)
    @maxI = Util.zeroArray(@scopePointCount)

    @ptr = @ctr = 0

  draw: (renderContext) ->
    renderContext.drawLinePt @rect.x, @rect.y, @rect.x + @rect.width, @rect.y + @rect.height

  setElm: (ce)->
    @elm = ce


module.exports = Scope
