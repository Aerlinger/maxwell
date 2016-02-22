CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
SwitchElm = require('./SwitchElm.coffee')
Util = require('../../util/util.coffee')

_ = require("lodash")


# Broken
class Switch2Elm extends SwitchElm

  @FLAG_CENTER_OFF: 1

  @Fields = Util.extend(SwitchElm.Fields, {
    "link": {
      name: "link"
      unit: "",
      default_value: 0,
      data_type: parseInt
      range: [0, 1]
      field_type: "boolean"
    }
  })

  constructor: (xa, ya, xb, yb, params, f) ->
    @openhs = 16
    @noDiagonal = true

    super(xa, ya, xb, yb, params, f)

#    @position = 0

  name: ->
    "SPDT switch"

  setPoints: ->
    super()
#    @calcLeads(32);

    @swposts = Util.newPointArray(2)
    @swpoles = Util.newPointArray(3)

    [@swpoles[0], @swpoles[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 1, @openhs)
    @swpoles[2] = @lead2

    [@swposts[0], @swposts[1]] = Util.interpolateSymmetrical(@point1, @point2, 1, @openhs)

    @posCount = if @hasCenterOff() then 3 else 2

    @setBboxPt @point1, @point2, @openhs

  getDumpType: ->
    "S"

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @calcLeads 32

    @swpoles = Util.newPointArray(3)
    @swposts = Util.newPointArray(2)

    [@swpoles[0], @swpoles[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 1, @openhs)
    @swpoles[2] = @lead2

    [@swposts[0], @swposts[1]] = Util.interpolateSymmetrical(@point1, @point2, 1, @openhs)
    if @hasCenterOff()
      @posCount = 3
    else
      @posCount = 2

    # draw first lead
    color = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt @point1, @lead1, color

    # draw second lead
    color = Util.getVoltageColor(@volts[1])
    renderContext.drawLinePt @swpoles[0], @swposts[0], color

    # draw third lead
    color = Util.getVoltageColor @volts[2]
    renderContext.drawLinePt @swpoles[1], @swposts[1], color

    renderContext.fillCircle(@swpoles[2].x, @swpoles[2].y, 4, 2, "#F0F")
    renderContext.fillCircle(@swpoles[1].x, @swpoles[1].y, 4, 2, "#F0F")
    renderContext.fillCircle(@swpoles[0].x, @swpoles[0].y, 4, 2, "#F0F")

    renderContext.drawLinePt @lead1, @swpoles[@position], Settings.GREY

    @updateDots()
    renderContext.drawDots @point1, @lead1, this

    unless @position is 2
      renderContext.drawDots @swpoles[@position], @swposts[@position], this

    renderContext.drawPosts(this)

  getPost: (n) ->
    if (n is 0)
      @point1
    else
      @swposts[n - 1]

  getPostCount: ->
    3

  calculateCurrent: ->
    @current = 0 if @position is 2

  stamp: (stamper) ->
    # in center?
    if @position is 2
      return
    stamper.stampVoltageSource @nodes[0], @nodes[@position + 1], @voltSource, 0

  getVoltageSourceCount: ->
    if (@position is 2) then 0 else 1

  toggle: ->
    super()
    unless @link is 0
      i = 0
      getParentCircuit().eachComponent (component) ->
        if component instanceof Switch2Elm
          s2 = component
          if s2.link is @link
            s2.position = @position

#        while i isnt getCircuit().elementList.length
#          o = Circuit.elementList.elementAt(i)
#          if o instanceof Switch2Elm
#            s2 = o
#            s2.position = @position  if s2.link is @link
#          i++

  getConnection: (n1, n2) ->
    if @position is 2
      return false
    Util.comparePair n1, n2, 0, 1 + @position

  getInfo: (arr) ->
    arr[0] = (if (@link is 0) then "switch (SPDT)" else "switch (DPDT)")
    arr[1] = "I = " + @getCurrentDText(@getCurrent())

  hasCenterOff: ->
    (@flags & Switch2Elm.FLAG_CENTER_OFF) isnt 0

module.exports = Switch2Elm
