CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
SwitchElm = require('./SwitchElm.coffee')
ArrayUtils = require('../../util/arrayUtils.coffee')
DrawUtil = require('../../util/drawUtil.coffee')

_ = require("lodash")

class Switch2Elm extends SwitchElm

  @FLAG_CENTER_OFF: 1

  @ParameterDefinitions = {}

  _.extend(@ParameterDefinitions, SwitchElm.ParameterDefinitions, {
    "link": {
      name: "link"
      unit: "",
      default_value: 0,
      symbol: "",
      data_type: parseInt
      range: [0, 1]
      type: "attribute"
    }
  })

  constructor: (xa, ya, xb, yb, params, f) ->
    @openhs = 16
    @noDiagonal = true
    #    @link = parseInt(st[st.length - 1])  if st

    super(xa, ya, xb, yb, params, f)


  setPoints: ->
    super()
#    @calcLeads(32);

    @swposts = ArrayUtils.newPointArray(2)
    @swpoles = ArrayUtils.newPointArray(3)

    DrawUtil.interpolateSymmetrical(@lead1, @lead2, @swpoles[0], @swpoles[1], 1, @openhs)
    @swpoles[2] = @lead2

    DrawUtil.interpolateSymmetrical(@point1, @point2, @swposts[0], @swposts[1], 1, @openhs)

    @posCount = if @hasCenterOff() then 3 else 2

  getDumpType: ->
    "S"

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @setBbox @point1, @point2, @openhs

    @calcLeads 32

    @swpoles = ArrayUtils.newPointArray(3)
    @swposts = ArrayUtils.newPointArray(2)

    [@swpoles[0], @swpoles[1]] = renderContext.interpolateSymmetrical(@lead1, @lead2, 1, @openhs)
    @swpoles[2] = @lead2

    [@swposts[0], @swposts[1]] = renderContext.interpolateSymmetrical(@point1, @point2, 1, @openhs)
    if @hasCenterOff()
      @posCount = 3
    else
      @posCount = 2

    # draw first lead
    color = renderContext.getVoltageColor(@volts[0])
    renderContext.drawLinePt @point1, @lead1, color

    # draw second lead
    color = renderContext.getVoltageColor(@volts[1])
    renderContext.drawLinePt @swpoles[0], @swposts[0], color

    # draw third lead
    color = renderContext.getVoltageColor @volts[2]
    renderContext.drawLinePt @swpoles[1], @swposts[1], color

    # draw: (renderContext) ->
#      @setBbox @point1, @point2, @openhs

    renderContext.drawLinePt @lead1, @swpoles[@position], color

    #      @updateDotCount()
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
    @current = 0  if @position is 2

  stamp: (stamper) ->
    # in center?
    return if @position is 2
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
          s2.position = @position  if s2.link is @link

#        while i isnt getCircuit().elementList.length
#          o = Circuit.elementList.elementAt(i)
#          if o instanceof Switch2Elm
#            s2 = o
#            s2.position = @position  if s2.link is @link
#          i++

  getConnection: (n1, n2) ->
    return false  if @position is 2
    @comparePair n1, n2, 0, 1 + @position

  getInfo: (arr) ->
    arr[0] = (if (@link is 0) then "switch (SPDT)" else "switch (DPDT)")
    arr[1] = "I = " + @getCurrentDText(@getCurrent())

  hasCenterOff: ->
    (@flags & Switch2Elm.FLAG_CENTER_OFF) isnt 0

module.exports = Switch2Elm
