CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
DiodeElm = require('./DiodeElm.coffee')
ArrayUtils = require('../../util/arrayUtils.coffee')

class ZenerElm extends DiodeElm
  @ParameterDefinitions = {
    fwdrop: {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: DiodeElm.DEFAULT_DROP || 5.6
      data_type: parseFloat
      range: [-Infinity, Infinity]
      type: "physical"
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

    @setup()

  draw: (renderContext) ->
    @updateDots()
    @setBboxPt(@point1, @point2, @hs)

    @calcLeads 16
    pa = ArrayUtils.newPointArray(2)
    @wing = ArrayUtils.newPointArray(2)

    [pa[0], pa[1]] = renderContext.interpolateSymmetrical(@lead1, @lead2, 0, @hs)
    [@cathode[0], @cathode[1]] = renderContext.interpolateSymmetrical(@lead1, @lead2, 1, @hs)
    @wing[0] = renderContext.interpolate(@cathode[0], @cathode[1], -0.2, -@hs)
    @wing[1] = renderContext.interpolate(@cathode[1], @cathode[0], -0.2, -@hs)

    @poly = renderContext.createPolygonFromArray([pa[0], pa[1], @lead2])

    v1 = @volts[0]
    v2 = @volts[1]

    renderContext.drawLeads(this)

    # draw arrow vector
    # setPowerColor(g, true)
    color = renderContext.getVoltageColor(v1)
    renderContext.drawThickPolygonP @poly, color

    # PLATE:
    # setVoltageColor(g, v2)
    renderContext.drawLinePt(@cathode[0], @cathode[1], v1)

    # Cathode "Wings"
    color = renderContext.getVoltageColor(v2)
    renderContext.drawLinePt(@wing[0], @cathode[0], color)
    renderContext.drawLinePt(@wing[1], @cathode[1], color)

    renderContext.drawDots(@point2, @point1, this)
    renderContext.drawPosts(this)


  nonlinear: ->
    true

  setup: ->
    @leakage = 5e-6
    super()

  getDumpType: ->
    "z"

module.exports = ZenerElm
