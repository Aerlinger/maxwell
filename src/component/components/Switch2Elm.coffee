###
Todo: Click functionality does not work
###
Switch2Elm = (xa, ya, xb, yb, f, st) ->
  SwitchElm.call this, xa, ya, xb, yb, f, st
  @link = 0
  @link = parseInt(st[0])  if st and st[0]
  @noDiagonal = true
Switch2Elm:: = new SwitchElm()
Switch2Elm::constructor = Switch2Elm
Switch2Elm.FLAG_CENTER_OFF = 1
Switch2Elm::getDumpType = ->
  "S"

Switch2Elm::dump = ->
  SwitchElm::dump.call(this) + @link

Switch2Elm::openhs = 16
Switch2Elm::swposts = new Array()
Switch2Elm::swpoled = new Array()
Switch2Elm::setPoints = ->
  SwitchElm::setPoints.call this
  @calcLeads 32
  @swposts = CircuitElement.newPointArray(2)
  @swpoles = CircuitElement.newPointArray(3)
  CircuitElement.interpPoint2 @lead1, @lead2, @swpoles[0], @swpoles[1], 1, @openhs
  @swpoles[2] = @lead2
  CircuitElement.interpPoint2 @point1, @point2, @swposts[0], @swposts[1], 1, @openhs
  @posCount = (if @hasCenterOff() then 3 else 2)

Switch2Elm::draw = ->
  @setBbox @point1, @point2, @openhs
  
  # draw first lead
  color = @setVoltageColor(@volts[0])
  CircuitElement.drawThickLinePt @point1, @lead1, color
  
  # draw second lead
  color = @setVoltageColor(@volts[1])
  CircuitElement.drawThickLinePt @swpoles[0], @swposts[0], color
  
  # draw third lead
  @setVoltageColor @volts[2], color
  CircuitElement.drawThickLinePt @swpoles[1], @swposts[1], color
  
  # draw switch
  color = Settings.SELECT_COLOR  unless @needsHighlight()
  CircuitElement.drawThickLinePt @lead1, @swpoles[@position], color
  @updateDotCount()
  @drawDots @point1, @lead1, @curcount
  @drawDots @swpoles[@position], @swposts[@position], @curcount  unless @position is 2
  @drawPosts()

Switch2Elm::getPost = (n) ->
  (if (n is 0) then @point1 else @swposts[n - 1])

Switch2Elm::getPostCount = ->
  3

Switch2Elm::calculateCurrent = ->
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
    i = undefined
    i = 0
    while i isnt Circuit.elementList.length
      o = Circuit.elementList.elementAt(i)
      if o instanceof Switch2Elm
        s2 = o
        s2.position = @position  if s2.link is @link
      i++

Switch2Elm::getConnection = (n1, n2) ->
  return false  if @position is 2
  @comparePair n1, n2, 0, 1 + @position

Switch2Elm::getInfo = (arr) ->
  arr[0] = (if (@link is 0) then "switch (SPDT)" else "switch (DPDT)")
  arr[1] = "I = " + @getCurrentDText(@getCurrent())

Switch2Elm.getEditInfo = (n) ->
  if n is 1
    ei = new EditInfo("", 0, -1, -1)
    ei.checkbox = new Checkbox("Center Off", @hasCenterOff())
    return ei
  SwitchElm::getEditInfo.call this, n

Switch2Elm::setEditValue = (n, ei) ->
  if n is 1
    @flags &= ~Switch2Elm.FLAG_CENTER_OFF
    @flags |= Switch2Elm.FLAG_CENTER_OFF  if ei.checkbox.getState()
    @momentary = false  if @hasCenterOff()
    @setPoints()
  else
    Switch2Elm::setEditValue.call this, n, ei

Switch2Elm::hasCenterOff = ->
  (@flags & Switch2Elm.FLAG_CENTER_OFF) isnt 0
