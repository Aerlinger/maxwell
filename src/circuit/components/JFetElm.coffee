CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

MosfetElm = require('./MosfetElm.coffee')

class JfetElm extends MosfetElm

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)
    @noDiagonal = true

  getDumpType: ->
    'j'

  getDefaultThreshold: ->
    -4

  getBeta: ->
    .00125

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @setBboxPt(@point1, @point2, @hs)

    renderContext.setVoltageColor(@volts[1])
    renderContext.drawthickLine(@src[0], @src[1])
    renderContext.drawthickLine(@src[1], @src[2])

    renderContext.setVoltageColor(@volts[2])
    renderContext.drawthickLine(@drn[0], @drn[1])
    renderContext.drawthickLine(@drn[1], @drn[2])

    renderContext.setVoltageColor(@volts[0])
    renderContext.drawthickLine(@point1, @gatePt)

    renderContext.fillPolygon(@arrowPoly())
    renderContext.fillPolygon(@arrowPoly())

    if @curcount != 0
      renderContext.drawDots(@src[0], @src[1], this)
      renderContext.drawDots(@src[1], @src[2], this)
      renderContext.drawDots(@drn[0], @drn[1], this)
      renderContext.drawDots(@drn[1], @drn[2], this)

    renderContext.drawPosts(this)


  setPoints: ->
    super()

    hs2 = @hs * @dsign

    @src = Util.newPointArray(3)
    @drn = Util.newPointArray(3)

    [@src[0], @drn[0]] = Util.interpolateSymmetrical(@point1, @point2, 1, hs2)
    [@src[1], @drn[1]] = Util.interpolateSymmetrical(@point1, @point2, 1, hs2 / 2)
    [@src[2], @drn[2]] = Util.interpolateSymmetrical(@point1, @point2, 1 - 10 / @dn, hs2 / 2)

    @gatePt = Util.interpolate(@point1, @point2, 1 - 14/@dn)

    ra = Util.newPointArray(4)
    [ra[0], ra[1]] = Util.interpolateSymmetrical(@point1, @point2, 1 - 13/@dn, @hs)
    [ra[2], ra[3]] = Util.interpolateSymmetrical(@point1, @point2, 1 - 10/@dn, @hs)

    @gatePoly = Util.createPolygonFromArray(ra[0], ra[1], ra[3], ra[2])

    if @pnp == -1
      x = Util.interpolate(@gatePt, @point1, 15/@dn)
      @arrowPoly = Util.calcArrow(@gatePt, x, 8, 3)
    else
      @arrowPoly = Util.calcArrow(@point1, @gatePt, 8, 3)


module.exports = JfetElm

