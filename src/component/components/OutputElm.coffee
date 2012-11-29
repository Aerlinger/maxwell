OutputElm = (xa, ya, xb, yb, f, st) ->
  
  # st not used for OutputElm
  CircuitElement.call this, xa, ya, xb, yb, f
OutputElm:: = new CircuitElement()
OutputElm::constructor = OutputElm
OutputElm.FLAG_VALUE = 1
OutputElm::getDumpType = ->
  "O"

OutputElm::getPostCount = ->
  1

OutputElm::setPoints = ->
  CircuitElement::setPoints.call this
  @lead1 = new Point()

OutputElm::draw = ->
  selected = (@needsHighlight() or Circuit.plotYElm is this)
  
  #Font f = new Font("SansSerif", selected ? Font.BOLD : 0, 14);
  #g.setFont(f);
  color = (if selected then CircuitElement.selectColor else CircuitElement.whiteColor)
  s = (if (@flags & OutputElm.FLAG_VALUE) isnt 0 then CircuitElement.getVoltageText(@volts[0]) else "out")
  
  #FontMetrics fm = g.getFontMetrics();
  s = "X"  if this is Circuit.plotXElm
  s = "Y"  if this is Circuit.plotYElm
  CircuitElement.interpPoint @point1, @point2, @lead1, 1 - (3 * s.length / 2 + 8) / @dn #fm.stringWidth(s)
  @setBboxPt @point1, @lead1, 0
  @drawCenteredText s, @x2, @y2, true
  color = @setVoltageColor(@volts[0])
  color = Settings.SELECT_COLOR  if selected
  CircuitElement.drawThickLinePt @point1, @lead1, color
  @drawPosts()

OutputElm::getVoltageDiff = ->
  @volts[0]

OutputElm::getInfo = (arr) ->
  arr[0] = "output"
  arr[1] = "V = " + CircuitElement.getVoltageText(@volts[0])

OutputElm::getEditInfo = (n) ->
  if n is 0
    ei = new EditInfo("", 0, -1, -1)
    
    #ei.checkbox = new Checkbox("Show Voltage", (flags & FLAG_VALUE) != 0);
    ei.checkbox = "Show Voltage"
    return ei
  null

OutputElm::setEditValue = (n, ei) ->

# Todo: fix
#if (n == 0)
#   this.flags = (ei.checkbox.getState()) ? (this.flags | OutputElm.FLAG_VALUE) : (this.flags & ~OutputElm.FLAG_VALUE);
