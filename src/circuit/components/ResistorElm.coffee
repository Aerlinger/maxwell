Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')
Maxwell = require('../../Maxwell.coffee')


class ResistorElm extends CircuitComponent
  @ParameterDefinitions = {
    "resistance": {
      name: "Resistance"
      unit: "Ohms",
      default_value: 1000,
      symbol: Maxwell.OhmSymbol,
      data_type: "float"
      range: [0, Infinity]
      type: "physical"
    }
  }

  constructor: (xa, ya, xb, yb, params) ->
    super(xa, ya, xb, yb, params)

    @ps3 = new Point(100, 50)
    @ps4 = new Point(100, 150)

  draw: (renderContext) ->
    segments = 16
    oldOffset = 0
    hs = 6
    volt1 = @volts[0]
    volt2 = @volts[1]

    @setBboxPt @point1, @point2, hs
    @draw2Leads(renderContext)
    DrawHelper.getPowerColor @getPower
    segf = 1 / segments

    for i in [0...segments]
      newOffset = 0
      switch i & 3
        when 0
          newOffset = 1
        when 2
          newOffset = -1
        else
          newOffset = 0
      voltDrop = volt1 + (volt2 - volt1) * i / segments
      pt1 = DrawHelper.interpPoint @lead1, @lead2, i * segf, hs * oldOffset
      pt2 = DrawHelper.interpPoint @lead1, @lead2, (i + 1) * segf, hs * newOffset
      renderContext.drawThickLinePt pt1, pt2, DrawHelper.getVoltageColor(voltDrop)
      oldOffset = newOffset

    #if true @Circuit?.Params.showValues
    resistanceVal = DrawHelper.getUnitText(@resistance, "ohm")
    @drawValues resistanceVal, hs, renderContext

    @drawDots(@point1, @point2, renderContext)
    @drawPosts(renderContext)

  getDumpType: ->
    "r"

  getInfo: (arr) ->
    arr[0] = "resistor"
    @getBasicInfo arr
    arr[3] = "R = " + DrawHelper.getUnitText(@resistance, Maxwell.OhmSymbol)
    arr[4] = "P = " + DrawHelper.getUnitText(@getPower(), "W")

    return arr

  needsShortcut: ->
    true

  calculateCurrent: ->
    @current = (@volts[0] - @volts[1]) / @resistance

  setPoints: ->
    super()
    @calcLeads 32
    @ps3 = new Point(0, 0)
    @ps4 = new Point(0, 0)

  stamp: (stamper) ->
#    console.log("\nStamping Resistor Elm")
    if @orphaned()
      console.warn "attempting to stamp an orphaned resistor"

    stamper.stampResistor @nodes[0], @nodes[1], @resistance

  toString: ->
    "ResistorElm"

module.exports = ResistorElm
