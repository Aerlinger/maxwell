
# Step 2: Prototype of DepthRectangle is Rectangle

# Step 3: Now we need to set the constructor to the DepthRectangle instead of Rectangle

#/////////////////////////////////////////////////////////////////////////////
# Constructor ////////////////////////////////////////////////////////////////
ResistorElm = (xa, ya, xb, yb, f, st) ->
  CircuitElement.call this, xa, ya, xb, yb, f, st
  
  #var options = st.split(' ');
  if st and st.length > 0
    @resistance = parseFloat(st)
  else
    @resistance = 500
ResistorElm::resistance = 1000
ResistorElm::ps3 = new Point(100, 50)
ResistorElm::ps4 = new Point(100, 150)
ResistorElm:: = new CircuitElement()
ResistorElm::constructor = ResistorElm

#ResistorElm.prototype.setPoints = function() {
#	// Call super-method
#	CircuitElement.prototype.setPoints.call(this);
#	this.calcLeads(32);
#	this.ps3 = new Point(50, 50);
#	this.ps4 = new Point(50, 150);
#};
ResistorElm::draw = ->
  
  # Always Draw dots first
  @doDots()
  segments = 16
  ox = 0
  hs = 6
  v1 = @volts[0]
  v2 = @volts[1]
  @setBboxPt @point1, @point2, hs
  @draw2Leads()
  @setPowerColor true
  segf = 1 / segments
  i = 0

  while i < segments
    nx = 0
    switch i & 3
      when 0
        nx = 1
      when 2
        nx = -1
      else
        nx = 0
    v = v1 + (v2 - v1) * i / segments
    color = @setVoltageColor(v)
    CircuitElement.interpPoint @lead1, @lead2, CircuitElement.ps1, i * segf, hs * ox
    CircuitElement.interpPoint @lead1, @lead2, CircuitElement.ps2, (i + 1) * segf, hs * nx
    CircuitElement.drawThickLinePt CircuitElement.ps1, CircuitElement.ps2, color
    ox = nx
    ++i
  if Circuit.showValuesCheckItem
    s = CircuitElement.getShortUnitText(@resistance, "ohm")
    @drawValues s, hs
  @drawPosts()

ResistorElm::dump = ->
  CircuitElement::dump.call(this) + " " + @resistance

ResistorElm::getDumpType = ->
  "r"

ResistorElm::getEditInfo = (n) ->
  return new EditInfo("Resistance (ohms):", @resistance, 0, 0)  if n is 0
  null

ResistorElm::setEditValue = (n, ei) ->
  @resistance = ei.value  if ei.value > 0

ResistorElm::getInfo = (arr) ->
  arr[0] = "resistor"
  @getBasicInfo arr
  arr[3] = "R = " + CircuitElement.getUnitText(@resistance, Circuit.ohmString)
  arr[4] = "P = " + CircuitElement.getUnitText(@getPower(), "W")

ResistorElm::needsShortcut = ->
  true

ResistorElm::calculateCurrent = ->
  @current = (@volts[0] - @volts[1]) / @resistance

ResistorElm::setPoints = ->
  CircuitElement::setPoints.call this
  @calcLeads 32
  @ps3 = new Point(0, 0)
  @ps4 = new Point(0, 0)

ResistorElm::stamp = ->
  Circuit.stampResistor @nodes[0], @nodes[1], @resistance

ResistorElm::toString = ->
  "ResistorElm"
