Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')
ArrayUtils = require('../../util/arrayUtils.coffee')

class DiodeElm extends CircuitComponent

  @FLAG_FWDROP: 1
  @DEFAULT_DROP: .805904783

  @ParameterDefinitions = {
    fwdrop: {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: DiodeElm.DEFAULT_DROP
      data_type: "float"
      range: [-Infinity, Infinity]
      type: "physical"
    }

#    flags: DiodeElm.FLAG_FWDROP
  }

  constructor: (xa, ya, xb, yb, params) ->
    @hs = 8
    @poly
    @cathode = []

    @diode = new Diode(self)
    @fwdrop = DiodeElm.DEFAULT_DROP
    @zvoltage = 0

    super(xa, ya, xb, yb, params)

#    if (f & DiodeElm.FLAG_FWDROP) > 0
#      try
#        @fwdrop = parseFloat(st)

    @setup()

  nonLinear: ->
    true

  setup: ->
    @diode.setup @fwdrop, @zvoltage

  getDumpType: ->
    "d"

  draw: (renderContext) ->
    @calcLeads renderContext, 16

    @cathode = ArrayUtils.newPointArray(2)
    [pa, pb] = renderContext.interpolateSymmetrical @lead1, @lead2, 0, @hs
    [@cathode[0], @cathode[1]] = renderContext.interpolateSymmetrical @lead1, @lead2, 1, @hs
    @poly = renderContext.renderContext([pa, pb, @lead2])

    @drawDiode(renderContext)
    @drawDots(@point1, @point2, renderContext)
    @drawPosts(renderContext)

  reset: ->
    @diode.reset()
    @volts[0] = @volts[1] = @curcount = 0

  drawDiode: (renderContext) ->
    @setBboxPt @point1, @point2, @hs
    v1 = @volts[0]
    v2 = @volts[1]
    @draw2Leads(renderContext)

    # TODO: RENDER DIODE

    # draw arrow
    #this.setPowerColor(true);
    color = renderContext.getVoltageColor(v1)
    renderContext.drawThickPolygonP @poly, color

    #g.fillPolygon(poly);

    # draw the diode plate
    color = renderContext.getVoltageColor(v2)
    renderContext.drawLinePt @cathode[0], @cathode[1], color

  stamp: (stamper) ->
    @diode.stamp @nodes[0], @nodes[1], stamper

  doStep: (stamper) ->
    @diode.doStep @volts[0] - @volts[1], stamper

  calculateCurrent: ->
    @current = @diode.calculateCurrent(@volts[0] - @volts[1])

  getInfo: (arr) ->
    super()
    arr[0] = "diode"
    arr[1] = "I = " + @getUnitText(@getCurrent(), "A")
    arr[2] = "Vd = " + @getUnitText(@getVoltageDiff(), "V")
    arr[3] = "P = " + @getUnitText(@getPower(), "W")
    arr[4] = "Vf = " + @getUnitText(@fwdrop, "V")

  toString: ->
    "DiodeElm"

  # TODO: fix
  needsShortcut: ->
    return true

module.exports = DiodeElm
