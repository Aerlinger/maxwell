Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
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

  setPoints: ->
    super()
    @calcLeads 16
    @cathode = ArrayUtils.newPointArray(2)
    [pa, pb] = DrawHelper.interpPoint2 @lead1, @lead2, 0, @hs
    [@cathode[0], @cathode[1]] = DrawHelper.interpPoint2 @lead1, @lead2, 1, @hs
    @poly = DrawHelper.createPolygonFromArray([pa, pb, @lead2])

  draw: (renderContext) ->
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
    color = DrawHelper.getVoltageColor(v1)
    renderContext.drawThickPolygonP @poly, color

    #g.fillPolygon(poly);

    # draw the diode plate
    color = DrawHelper.getVoltageColor(v2)
    renderContext.drawThickLinePt @cathode[0], @cathode[1], color

  stamp: (stamper) ->
    @diode.stamp @nodes[0], @nodes[1], stamper

  doStep: (stamper) ->
    @diode.doStep @volts[0] - @volts[1], stamper

  calculateCurrent: ->
    @current = @diode.calculateCurrent(@volts[0] - @volts[1])

  getInfo: (arr) ->
    super()
    arr[0] = "diode"
    arr[1] = "I = " + DrawHelper.getCurrentText(@getCurrent())
    arr[2] = "Vd = " + DrawHelper.getVoltageText(@getVoltageDiff())
    arr[3] = "P = " + DrawHelper.getUnitText(@getPower(), "W")
    arr[4] = "Vf = " + DrawHelper.getVoltageText(@fwdrop)

  toString: ->
    "DiodeElm"

  # TODO: fix
  needsShortcut: ->
    return true

return DiodeElm

module.exports = DiodeElm
