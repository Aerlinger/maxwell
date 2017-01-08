GateElm = require("./GateElm.coffee")
Util = require('../../util/util.coffee')
Point = require('../../geom/point.coffee')

class AndGateElm extends GateElm
  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  setPoints: ->
    super

    triPoints = Util.newPointArray(23)

    [triPoints[0], triPoints[22]] = Util.interpolateSymmetrical(@lead1, @lead2, 0, @hs2)

    for i in [0...10]
      a = i * 0.1
      b = Math.sqrt(1 - a*a)

      [triPoints[i + 1], triPoints[21 - i]] = Util.interpolateSymmetrical(@lead1, @lead2, 0.5 + a / 2, b * @hs2)

    triPoints[11] = new Point(@lead2.x, @lead2.y)

    if @isInverting()
      @pcircle = Util.interpolate(@point1, @point2, 0.5 + (@ww + 4) / @dn())
      @lead2 = Util.interpolate(@point1, @point2, 0.5 + (@ww + 8) / @dn())

    @gatePoly = Util.createPolygonFromArray(triPoints)

  getGateName: ->
    "AND Gate"

  calcFunction: ->
    f = true

    for i in [0...@inputCount]
      f = f & @getInput(i)

    #console.log("AND: #{f}")
    return f

  getDumpType: ->
    150

module.exports = AndGateElm
