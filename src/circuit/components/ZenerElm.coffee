CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
DiodeElm = require('./DiodeElm.coffee')
Util = require('../../util/util.coffee')

class ZenerElm extends DiodeElm
  @Fields = Util.extend(DiodeElm.Fields, {
    zvoltage: {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: DiodeElm.DEFAULT_DROP
      data_type: parseFloat
    }
  })

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

    @setup()

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @updateDots()
    @setBboxPt(@point1, @point2, @hs)

    @calcLeads 16
    pa = Util.newPointArray(2)
    @wing = Util.newPointArray(2)

    [pa[0], pa[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 0, @hs)
    [@cathode[0], @cathode[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 1, @hs)
    @wing[0] = Util.interpolate(@cathode[0], @cathode[1], -0.2, -@hs)
    @wing[1] = Util.interpolate(@cathode[1], @cathode[0], -0.2, -@hs)

    @poly = Util.createPolygonFromArray([pa[0], pa[1], @lead2])

    v1 = @volts[0]
    v2 = @volts[1]

    renderContext.drawLeads(this)

    # draw arrow vector
    # setPowerColor(g, true)
    color = Util.getVoltageColor(v1)
    renderContext.drawThickPolygonP @poly, color

    # PLATE:
    # setVoltageColor(g, v2)
    renderContext.drawLinePt(@cathode[0], @cathode[1], v1)

    # Cathode "Wings"
    color = Util.getVoltageColor(v2)
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
