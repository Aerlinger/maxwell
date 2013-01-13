# <DEFINE>
define([
], (
) ->
# </DEFINE>


DiodeElm = (xa, ya, xb, yb, f, st) ->
  CircuitComponent.call this, xa, ya, xb, yb, f
  @diode = new Diode()
  @fwdrop = DiodeElm.DEFAULT_DROP
  @zvoltage = 0
  if (f & DiodeElm.FLAG_FWDROP) > 0
    try
      @fwdrop = parseFloat(st)
  @setup()
DiodeElm.FLAG_FWDROP = 1
DiodeElm.DEFAULT_DROP = .805904783
DiodeElm:: = new CircuitComponent()
DiodeElm::constructor = DiodeElm
DiodeElm::hs = 8
DiodeElm::poly
DiodeElm::cathode = []
DiodeElm::nonLinear = ->
  true

DiodeElm::setup = ->
  @diode.setup @fwdrop, @zvoltage

DiodeElm::getDumpType = ->
  "d"

DiodeElm::dump = ->
  @flags |= DiodeElm.FLAG_FWDROP
  CircuitComponent::dump.call(this) + " " + @fwdrop

DiodeElm::setPoints = ->
  CircuitComponent::setPoints.call this
  @calcLeads 16
  @cathode = CircuitComponent.newPointArray(2)
  pa = CircuitComponent.newPointArray(2) # Point array
  CircuitComponent.interpPoint2 @lead1, @lead2, pa[0], pa[1], 0, @hs
  CircuitComponent.interpPoint2 @lead1, @lead2, @cathode[0], @cathode[1], 1, @hs
  @poly = CircuitComponent.createPolygon(pa[0], pa[1], @lead2)

DiodeElm::draw = ->
  @drawDiode()
  @doDots()
  @drawPosts()

DiodeElm::reset = ->
  @diode.reset()
  @volts[0] = @volts[1] = @curcount = 0

DiodeElm::drawDiode = ->
  @setBboxPt @point1, @point2, @hs
  v1 = @volts[0]
  v2 = @volts[1]
  @draw2Leads()
  
  # draw arrow
  #this.setPowerColor(true);
  color = @setVoltageColor(v1)
  CircuitComponent.drawThickPolygonP @poly, color
  
  #g.fillPolygon(poly);
  
  # draw thing diode plate
  color = @setVoltageColor(v2)
  CircuitComponent.drawThickLinePt @cathode[0], @cathode[1], color

DiodeElm::stamp = ->
  @diode.stamp @nodes[0], @nodes[1]

DiodeElm::doStep = ->
  @diode.doStep @volts[0] - @volts[1]

DiodeElm::calculateCurrent = ->
  @current = @diode.calculateCurrent(@volts[0] - @volts[1])

DiodeElm::getInfo = (arr) ->
  arr[0] = "diode"
  arr[1] = "I = " + CircuitComponent.getCurrentText(@getCurrent())
  arr[2] = "Vd = " + CircuitComponent.getVoltageText(@getVoltageDiff())
  arr[3] = "P = " + CircuitComponent.getUnitText(@getPower(), "W")
  arr[4] = "Vf = " + CircuitComponent.getVoltageText(@fwdrop)

DiodeElm::getEditInfo = (n) ->
  return new EditInfo("Fwd Voltage @ 1A", @fwdrop, 10, 1000)  if n is 0
  null

DiodeElm::setEditValue = (n, ei) ->
  @fwdrop = ei.value
  @setup()


# TODO: fix
DiodeElm::needsShortcut = ->
  
  #return getClass() == DiodeElm.class;
  true
