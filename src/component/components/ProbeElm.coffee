ProbeElm = (xa, ya, xb, yb, f, st) ->
  AbstractCircuitComponent.call this, xa, ya, xb, yb, f
ProbeElm:: = new AbstractCircuitComponent()
ProbeElm::constructor = ProbeElm
ProbeElm.FLAG_SHOWVOLTAGE = 1
ProbeElm::center
ProbeElm::getDumpType = ->
  "p"

ProbeElm::setPoints = ->
  AbstractCircuitComponent::setPoints.call this
  
  # swap points so that we subtract higher from lower
  if @point2.y < @point1.y
    x = @point1
    @point1 = @point2
    @point2 = @x1
  @center = AbstractCircuitComponent.interpPointPt(@point1, @point2, .5)

ProbeElm::draw = ->
  hs = 8
  AbstractCircuitComponent.setBboxPt @point1, @point2, hs
  selected = (@needsHighlight() or Circuit.plotYElm is this)
  len = (if (selected or Circuit.dragElm is this) then 16 else @dn - 32)
  AbstractCircuitComponent.calcLeads Math.floor(len)
  color = @setVoltageColor(@volts[0])
  color = AbstractCircuitComponent.selectColor  if selected
  AbstractCircuitComponent.drawThickLinePt @point1, @lead1, color
  color = @setVoltageColor(@volts[1])
  AbstractCircuitComponent.setColor @selectColor  if selected
  AbstractCircuitComponent.drawThickLinePt @lead2, @point2
  f = new Font("SansSerif", Font.BOLD, 14)
  AbstractCircuitComponent.setFont f
  AbstractCircuitComponent.drawCenteredText "X", @center.x1, @center.y, color  if this is Circuit.plotXElm
  AbstractCircuitComponent.drawCenteredText "Y", @center.x1, @center.y, color  if this is Circuit.plotYElm
  if @mustShowVoltage()
    s = AbstractCircuitComponent.getShortUnitText(volts[0], "V")
    @drawValues s, 4
  @drawPosts()

ProbeElm::mustShowVoltage = ->
  (@flags & ProbeElm.FLAG_SHOWVOLTAGE) isnt 0

ProbeElm::getInfo = (arr) ->
  arr[0] = "scope probe"
  arr[1] = "Vd = " + AbstractCircuitComponent.getVoltageText(@getVoltageDiff())

ProbeElm::getConnection = (n1, n2) ->
  false

ProbeElm::getEditInfo = (n) ->
  if n is 0
    ei = new EditInfo("", 0, -1, -1)
    ei.checkbox = new Checkbox("Show Voltage", @mustShowVoltage())
    return ei
  null

ProbeElm::setEditValue = (n, ei) ->
  if n is 0
    if ei.checkbox.getState()
      flags = ProbeElm.FLAG_SHOWVOLTAGE
    else
      flags &= ~ProbeElm.FLAG_SHOWVOLTAGE
