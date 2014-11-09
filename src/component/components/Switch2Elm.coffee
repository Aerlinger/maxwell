# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitComponent',
  'cs!Units'
], (
  Settings,
  DrawHelper,
  Polygon,
  Rectangle,
  Point,

  CircuitComponent,
  Units
) ->
# </DEFINE>


  ###
  Todo: Click functionality does not work
  ###
  class Switch2Elm

    @FLAG_CENTER_OFF: 1

    constructor: ->
      super(xa, ya, xb, yb, f, st)

      @openhs = 16
      @swpoled = new Array()
      @swposts = new Array()

      @noDiagonal = true
      @link = parseInt(st[0])  if st and st[0]


    getDumpType: ->
      "S"

    dump: ->
      SwitchElm::dump.call(this) + @link


    setPoints: ->
      SwitchElm::setPoints.call this
      @calcLeads 32

      @swpoles = DrawHelper.interpPoint @lead1, @lead2, 1, @openhs
      @swpoles[2] = @lead2
      @swposts = DrawHelper.interpPoint @point1, @point2, 1, @openhs
      @posCount = @hasCenterOff() ? 3 : 2

    draw: ->
      @setBbox @point1, @point2, @openhs

      # draw first lead
      color = @setVoltageColor(@volts[0])
      CircuitComponent.drawThickLinePt @point1, @lead1, color

      # draw second lead
      color = @setVoltageColor(@volts[1])
      CircuitComponent.drawThickLinePt @swpoles[0], @swposts[0], color

      # draw third lead
      @setVoltageColor @volts[2], color
      CircuitComponent.drawThickLinePt @swpoles[1], @swposts[1], color

      # draw switch
      color = Settings.SELECT_COLOR unless @needsHighlight()
      CircuitComponent.drawThickLinePt @lead1, @swpoles[@position], color
      @updateDotCount()
      @drawDots @point1, @lead1, @curcount
      @drawDots @swpoles[@position], @swposts[@position], @curcount  unless @position is 2
      @drawPosts()

    getPost: (n) ->
      if (n is 0) then @point1 else @swposts[n - 1]

    getPostCount: ->
      3

    calculateCurrent: ->
      @current = 0  if @position is 2

    Switch2Elm.stamp = ->
      # in center?
      return  if @position is 2
      Circuit.stampVoltageSource @nodes[0], @nodes[@position + 1], @voltSource, 0

    Switch2Elm.getVoltageSourceCount = ->
      (if (@position is 2) then 0 else 1)

    Switch2Elm.toggle = ->
      Switch2Elm::toggle()
      unless @link is 0
        i = 0
        while i isnt Circuit.elementList.length
          o = Circuit.elementList.elementAt(i)
          if o instanceof Switch2Elm
            s2 = o
            s2.position = @position  if s2.link is @link
          i++

    getConnection: (n1, n2) ->
      return false  if @position is 2
      @comparePair n1, n2, 0, 1 + @position

    getInfo: (arr) ->
      arr[0] = (if (@link is 0) then "switch (SPDT)" else "switch (DPDT)")
      arr[1] = "I = " + @getCurrentDText(@getCurrent())

    getEditInfo: (n) ->
      if n is 1
        ei = new EditInfo("", 0, -1, -1)
        ei.checkbox = new Checkbox("Center Off", @hasCenterOff())
        return ei
      SwitchElm::getEditInfo.call this, n

    setEditValue: (n, ei) ->
      if n is 1
        @flags &= ~Switch2Elm.FLAG_CENTER_OFF
        @flags |= Switch2Elm.FLAG_CENTER_OFF  if ei.checkbox.getState()
        @momentary = false  if @hasCenterOff()
        @setPoints()
      else
        Switch2Elm::setEditValue.call this, n, ei

    hasCenterOff: ->
      (@flags & Switch2Elm.FLAG_CENTER_OFF) isnt 0


  return Switch2Elm
