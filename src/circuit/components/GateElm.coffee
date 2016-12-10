CircuitComponent = require("../CircuitComponent.coffee")
Util = require('../../util/util.coffee')
Settings = require('../../settings/settings.coffee')

class GateElm extends CircuitComponent
  @FLAG_SMALL = 1

  @Fields = [
    {
      id: "inputCount"
      name: "Input count"
      data_type: parseInt
      default_value: 2
      field: "integer"
    },
    {
      id: "lastOutput"
      name: "Last Output"
      data_type: (x) ->
        x > 2.5
      default_value: false
    }
  ]

  constructor: (xa, ya, xb, yb, params, f) ->
    if parseInt(f) & GateElm.FLAG_SMALL != 0
      size = 1
    else
      size = 2

    @setSize(size)

    super(xa, ya, xb, yb, params, f)

    @noDiagonal = true
    @linePoints = null

  isInverting: ->
    false

  setSize: (s) ->
    @gsize = s
    @gwidth = 7 * s
    @gwidth2 = 14 * s
    @gheight = 8 * s
    if s == 1
      @flags = GateElm.FLAG_SMALL
    else
      @flags = 0

  setPoints: ->
    super()

#    if @dn > 150
#      @setSize(2)

    hs = @gheight
    @ww = Math.floor(@gwidth2)

    if @ww > @dn/2
      @ww = Math.floor(@dn/2)

    if @isInverting() && (@ww + 8 > @dn/2)
      @ww = Math.floor(@dn / 2) - 8

    @calcLeads @ww*2

    @inPosts = Util.newPointArray(@inputCount)
    @inGates = Util.newPointArray(@inputCount)

    @allocNodes()

    i0 = -Math.floor(@inputCount / 2)

    for i in [0...@inputCount]
      if i0 == 0 && (@inputCount & 1) == 0
        i0 += 1

      @inPosts[i] = Util.interpolate(@point1, @point2, 0, hs * i0)
      @inGates[i] = Util.interpolate(@lead1, @lead2, 0, hs * i0)

      if (@lastOutput ^ @isInverting())
        @volts[i] = 5
      else
        @volts[i] = 0

      i0 += 1

    @hs2 = @gwidth * (Math.floor(@inputCount / 2) + 1)
    @setBboxPt(@point1, @point2, @hs2)


  doStep: (stamper) ->
    f = @calcFunction()

    if @isInverting()
      f = !f

    @lastOutput = (f > 0)
#    @params['lastOutput'] = (f > 0)

    if f
      res = 5
    else
      res = 0

    stamper.updateVoltageSource(0, @nodes[@inputCount], @voltageSource, res)


  draw: (renderContext)->
    for i in [0...@inputCount]
      voltageColor = Util.getVoltageColor(@volts[i])
      renderContext.drawLinePt(@inPosts[i], @inGates[i], voltageColor)

    voltageColor = Util.getVoltageColor(@volts[@inputCount])
    renderContext.drawLinePt(@lead2, @point2, voltageColor)

    renderContext.drawThickPolygonP(@gatePoly, Settings.STROKE_COLOR)
    if @linePoints != null
      for i in [0...(@linePoints.length - 1)]
        renderContext.drawLinePt(@linePoints[i], @linePoints[i + 1])

    if @isInverting()
      renderContext.fillCircle @pcircle.x, @pcircle.y, 3

    @updateDots()
    renderContext.drawDots @lead2, @point2, this

    renderContext.drawPosts(this, "#FF0000")
    renderContext.drawPosts(this, "#FF0000")

    for i in [0...@getPostCount()]
      post = @getPost(i)
      renderContext.fillCircle post.x, post.y, 1, 1, "#FF0000", "#0000FF"
#      renderContext.drawPost post.x, post.y, color, color

    if CircuitComponent.DEBUG
      super(renderContext)


  getPostCount: ->
    @inputCount + 1

  getVoltageSourceCount: ->
    1

  getPost: (n) ->
    if n == @inputCount
      return @point2

    @inPosts[n]

  getInput: (n)->
    console.log("INPUT #{n} is #{@volts[n]}")
    return @volts[n] > 2.5

  getConnection: (n1, n2)->
    return false

  hasGroundConnection: (n1) ->
    n1 == @inputCount

  stamp: (stamper) ->
    stamper.stampVoltageSource(0, @nodes[@inputCount], @voltSource)



module.exports = GateElm
