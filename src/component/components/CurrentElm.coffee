CurrentElm = (xa, ya, xb, yb, f, st) ->
  CircuitComponent.call this, xa, ya, xb, yb, f
  try
    st = st.split(" ")  if typeof st is "string"
    @currentValue = parseFloat(st[0])
  catch e
    @currentValue = .01
CurrentElm:: = new CircuitComponent()
CurrentElm::constructor = CurrentElm
CurrentElm::dump = ->
  CircuitComponent::dump.call(this) + " " + @currentValue

CurrentElm::getDumpType = ->
  "i"

CircuitComponent::arrow
CircuitComponent::ashaft1
CircuitComponent::ashaft2
CircuitComponent::center
CurrentElm::setPoints = ->
  CircuitComponent::setPoints.call this
  @calcLeads 26
  @ashaft1 = CircuitComponent.interpPointPt(@lead1, @lead2, .25)
  @ashaft2 = CircuitComponent.interpPointPt(@lead1, @lead2, .6)
  @center = CircuitComponent.interpPointPt(@lead1, @lead2, .5)
  p2 = CircuitComponent.interpPointPt(@lead1, @lead2, .75)
  @arrow = CircuitComponent.calcArrow(@center, p2, 4, 4)

CurrentElm::draw = ->
  cr = 12
  @draw2Leads()
  @setVoltageColor (@volts[0] + @volts[1]) / 2
  @setPowerColor false
  CircuitComponent.drawCircle @center.x1, @center.y, cr
  CircuitComponent.drawCircle @ashaft1, @ashaft2
  CircuitComponent.fillPolygon @arrow
  CircuitComponent.setBboxPt @point1, @point2, cr
  @doDots()
  if Circuit.showValuesCheckItem
    s = CircuitComponent.getShortUnitText(@currentValue, "A")
    @drawValues s, cr  if @dx is 0 or @dy is 0
  @drawPosts()

CurrentElm::stamp = ->
  @current = @currentValue
  Circuit.stampCurrentSource @nodes[0], @nodes[1], @current

CurrentElm::getEditInfo = (n) ->
  return new EditInfo("Current (A)", @currentValue, 0, .1)  if n is 0
  null

CurrentElm::setEditValue = (n, ei) ->
  @currentValue = ei.value

CurrentElm::getInfo = (arr) ->
  arr[0] = "current source"
  @getBasicInfo arr

CurrentElm::getVoltageDiff = ->
  @volts[1] - @volts[0]
