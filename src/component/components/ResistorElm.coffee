CircuitElement = require('../abstractCircuitComponent.coffee')
{Polygon, Rectangle, Point} = require('../../util/shapePrimitives')

#/////////////////////////////////////////////////////////////////////////////
# Constructor ////////////////////////////////////////////////////////////////
class ResistorElm extends CircuitElement

  constructor: (xa, ya, xb, yb, f = 0, st = null) ->
    super(xa, ya, xb, yb, f, st)

    if st and st.length > 0
      @resistance = parseFloat(st)
    else
      @resistance = 500


ResistorElm::ps3 = new Point(100, 50)
ResistorElm::ps4 = new Point(100, 150)

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
  #CircuitElement::setPoints.call this
  super()
  @calcLeads 32
  @ps3 = new Point(0, 0)
  @ps4 = new Point(0, 0)

ResistorElm::stamp = ->
  if @orphaned()
    console.warn "attempting to stamp an orphaned resistor"
  @Circuit.Solver.Stamper.stampResistor @nodes[0], @nodes[1], @resistance

# Todo replace this:
ResistorElm::toString = ->
  "ResistorElm"


module.exports = ResistorElm