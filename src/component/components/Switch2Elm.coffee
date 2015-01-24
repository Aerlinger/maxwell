Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')
SwitchElm = require('./SwitchElm.coffee')

###
Todo: Click functionality does not work
###
class Switch2Elm extends SwitchElm

  @FLAG_CENTER_OFF: 1

  constructor: (xa, ya, xb, yb, f, st) ->
    super(xa, ya, xb, yb, f, st)

    @openhs = 16

    @noDiagonal = true
    @link = parseInt(st[st.length - 1])  if st


  getDumpType: ->
    "S"

  dump: ->
    super() + @link


  setPoints: ->
    super()
    @calcLeads 32

    @swpoles = CircuitComponent.newPointArray(3)
    @swposts = CircuitComponent.newPointArray(2)

    [@swpoles[0], @swpoles[1]] = DrawHelper.interpPoint2 @lead1, @lead2, 1, @openhs
    @swpoles[2] = @lead2

    [@swposts[0], @swposts[1]] = DrawHelper.interpPoint2 @point1, @point2, 1, @openhs
    @posCount = @hasCenterOff() ? 3 : 2

  draw: (renderContext) ->
    @setBbox @point1, @point2, @openhs

    # draw first lead
    color = DrawHelper.getVoltageColor(@volts[0])
    renderContext.drawThickLinePt @point1, @lead1, color

    # draw second lead
    color = DrawHelper.getVoltageColor(@volts[1])
    renderContext.drawThickLinePt @swpoles[0], @swposts[0], color

    # draw third lead
    color = DrawHelper.getVoltageColor @volts[2]
    renderContext.drawThickLinePt @swpoles[1], @swposts[1], color

    # draw switch
    color = Settings.SELECT_COLOR unless @needsHighlight()
    renderContext.drawThickLinePt @lead1, @swpoles[@position], color

#      @updateDotCount()
    @drawDots @point1, @lead1, renderContext
    @drawDots @swpoles[@position], @swposts[@position], renderContext  unless @position is 2
    @drawPosts(renderContext)

  getPost: (n) ->
    if (n is 0) then @point1 else @swposts[n - 1]

  getPostCount: ->
    3

  calculateCurrent: ->
    @current = 0  if @position is 2

  stamp: (stamper) ->
    # in center?
    return  if @position is 2
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

#    getEditInfo: (n) ->
#      if n is 1
#        ei = new EditInfo("", 0, -1, -1)
#        ei.checkbox = new Checkbox("Center Off", @hasCenterOff())
#        return ei
#      SwitchElm::getEditInfo.call this, n

#    setEditValue: (n, ei) ->
#      if n is 1
#        @flags &= ~Switch2Elm.FLAG_CENTER_OFF
#        @flags |= Switch2Elm.FLAG_CENTER_OFF  if ei.checkbox.getState()
#        @momentary = false  if @hasCenterOff()
#        @setPoints()
#      else
#        Switch2Elm::setEditValue.call this, n, ei

  hasCenterOff: ->
    (@flags & Switch2Elm.FLAG_CENTER_OFF) isnt 0


return Switch2Elm
