CurrentElm = (xa, ya, xb, yb, f, st) ->
  CircuitElement.call this, xa, ya, xb, yb, f
  try
    st = st.split(" ")  if typeof st is "string"
    @currentValue = parseFloat(st[0])
  catch e
    @currentValue = .01
CurrentElm:: = new CircuitElement()
CurrentElm::constructor = CurrentElm
CurrentElm::dump = ->
  CircuitElement::dump.call(this) + " " + @currentValue

CurrentElm::getDumpType = ->
  "i"

CircuitElement::arrow
CircuitElement::ashaft1
CircuitElement::ashaft2
CircuitElement::center
CurrentElm::setPoints = ->
  CircuitElement::setPoints.call this
  @calcLeads 26
  @ashaft1 = CircuitElement.interpPointPt(@lead1, @lead2, .25)
  @ashaft2 = CircuitElement.interpPointPt(@lead1, @lead2, .6)
  @center = CircuitElement.interpPointPt(@lead1, @lead2, .5)
  p2 = CircuitElement.interpPointPt(@lead1, @lead2, .75)
  @arrow = CircuitElement.calcArrow(@center, p2, 4, 4)

CurrentElm::draw = ->
  cr = 12
  @draw2Leads()
  @setVoltageColor (@volts[0] + @volts[1]) / 2
  @setPowerColor false
  CircuitElement.drawCircle @center.x1, @center.y, cr
  CircuitElement.drawCircle @ashaft1, @ashaft2
  CircuitElement.fillPolygon @arrow
  CircuitElement.setBboxPt @point1, @point2, cr
  @doDots()
  if Circuit.showValuesCheckItem
    s = CircuitElement.getShortUnitText(@currentValue, "A")
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
