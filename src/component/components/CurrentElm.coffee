CurrentElm = (xa, ya, xb, yb, f, st) ->
  AbstractCircuitComponent.call this, xa, ya, xb, yb, f
  try
    st = st.split(" ")  if typeof st is "string"
    @currentValue = parseFloat(st[0])
  catch e
    @currentValue = .01
CurrentElm:: = new AbstractCircuitComponent()
CurrentElm::constructor = CurrentElm
CurrentElm::dump = ->
  AbstractCircuitComponent::dump.call(this) + " " + @currentValue

CurrentElm::getDumpType = ->
  "i"

AbstractCircuitComponent::arrow
AbstractCircuitComponent::ashaft1
AbstractCircuitComponent::ashaft2
AbstractCircuitComponent::center
CurrentElm::setPoints = ->
  AbstractCircuitComponent::setPoints.call this
  @calcLeads 26
  @ashaft1 = AbstractCircuitComponent.interpPointPt(@lead1, @lead2, .25)
  @ashaft2 = AbstractCircuitComponent.interpPointPt(@lead1, @lead2, .6)
  @center = AbstractCircuitComponent.interpPointPt(@lead1, @lead2, .5)
  p2 = AbstractCircuitComponent.interpPointPt(@lead1, @lead2, .75)
  @arrow = AbstractCircuitComponent.calcArrow(@center, p2, 4, 4)

CurrentElm::draw = ->
  cr = 12
  @draw2Leads()
  @setVoltageColor (@volts[0] + @volts[1]) / 2
  @setPowerColor false
  AbstractCircuitComponent.drawCircle @center.x1, @center.y, cr
  AbstractCircuitComponent.drawCircle @ashaft1, @ashaft2
  AbstractCircuitComponent.fillPolygon @arrow
  AbstractCircuitComponent.setBboxPt @point1, @point2, cr
  @doDots()
  if Circuit.showValuesCheckItem
    s = AbstractCircuitComponent.getShortUnitText(@currentValue, "A")
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
