GateElm = require("./GateElm.coffee")
DrawUtil = require('../../util/drawUtil.coffee')
ArrayUtil = require('../../util/arrayUtils.coffee')
Point = require('../../geom/Point.coffee')

class AndGateElm extends GateElm
  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  setPoints: ->
    super()

    triPoints = ArrayUtil.newPointArray(23)

    [triPoints[0], triPoints[22]] = DrawUtil.interpolateSymmetrical(@lead1, @lead2, 0, @hs2)

    for i in [0...10]
      a = i * 0.1
      b = Math.sqrt(1 - a*a)

      [triPoints[i + 1], triPoints[21 - i]] = DrawUtil.interpolateSymmetrical(@lead1, @lead2, 0.5 + a / 2, b * @hs2)

    triPoints[11] = new Point(@lead2)

    if @isInverting()
      @pcircle = DrawUtil.interpolate(@point1, @point2, 0.5 + (@ww + 4) / @dn)
      @lead2 = DrawUtil.interpolate(@point1, @point2, 0.5 + (@ww + 8) / @dn)

    @gatePoly = triPoints

  getGateName: ->
    "AND Gate"

  calcFunction: ->
    f = true

    for i in [0...@inputCount]
      f = f & @getInput(i)

    return f

  getDumpType: ->
    150

module.exports = AndGateElm
