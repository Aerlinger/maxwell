Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')
DiodeElm = require('./DiodeElm.coffee')
ArrayUtils = require('../../util/arrayUtils.coffee')

class ZenerElm extends DiodeElm
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
  }

  constructor: (xa, ya, xb, yb, f, params) ->
    @default_z_voltage = 5.6
    @zvoltage = params[0] || @default_z_voltage

    super(xa, ya, xb, yb, f, params)

#    if (f & DiodeElm.FLAG_FWDROP) > 0
#      try
#        @fwdrop = params[1]

    @setup()

  setPoints: ->
    super()

    @calcLeads(16)
    pa = ArrayUtils.newPointArray(2)
    @wing = ArrayUtils.newPointArray(2)

    [pa[0], pa[1]] = DrawHelper.interpPoint2(@lead1, @lead2, 0, @hs)
    [@cathode[0], @cathode[1]] = DrawHelper.interpPoint2(@lead1, @lead2, 1, @hs)
    @wing[0] = DrawHelper.interpPoint(@cathode[0], @cathode[1], -0.2, -@hs)
    @wing[1] = DrawHelper.interpPoint(@cathode[1], @cathode[0], -0.2, -@hs)

    @poly = DrawHelper.createPolygonFromArray([pa[0], pa[1], @lead2])

  draw: (renderContext) ->
    @setBboxPt(@point1, @point2, @hs)

    v1 = @volts[0]
    v2 = @volts[1]

    @draw2Leads(renderContext)

    # draw arrow vector
#      setPowerColor(g, true)
    color = DrawHelper.getVoltageColor(v1)
    renderContext.drawThickPolygonP @poly, color
#      g.fillPolygon(poly)

#      // draw thing arrow is pointing to
#      setVoltageColor(g, v2)
    renderContext.drawThickLinePt(@cathode[0], @cathode[1], v1)

#      // draw wings on cathode
    color = DrawHelper.getVoltageColor(v2)
    renderContext.drawThickLinePt(@wing[0], @cathode[0], color)
    renderContext.drawThickLinePt(@wing[1], @cathode[1], color)

    @drawDots(@point2, @point1, renderContext)
    @drawPosts(renderContext)


  nonlinear: ->
    true

  setup: ->
    @diode.leakage = 5e-6
    super()

  getDumpType: ->
    "z"

module.exports = ZenerElm
