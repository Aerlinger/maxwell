# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',

  'cs!CircuitComponent'
], (
  Settings,
  DrawHelper,
  Polygon,
  Rectangle,
  Point,

  CircuitComponent
) ->
# </DEFINE>



  #/////////////////////////////////////////////////////////////////////////////
  # Constructor ////////////////////////////////////////////////////////////////
  class ResistorElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f = 0, st = null) ->
      super(xa, ya, xb, yb, f, st)

      if st and st.length > 0
        @resistance = parseFloat(st)
      else
        @resistance = 500


  ResistorElm::ps3 = new Point(100, 50)
  ResistorElm::ps4 = new Point(100, 150)

  ResistorElm::draw = (renderContext) ->
    @doDots(renderContext)

    segments = 16
    oldOffset = 0
    hs = 6
    volt1 = @volts[0]
    volt2 = @volts[1]

    @setBboxPt @point1, @point2, hs
    @draw2Leads(renderContext)
    DrawHelper.getPowerColor @getPower
    segf = 1 / segments

    for i in [0...segments]
      newOffset = 0
      switch i & 3
        when 0
          newOffset = 1
        when 2
          newOffset = -1
        else
          newOffset = 0
      voltDrop = volt1 + (volt2 - volt1) * i / segments
      DrawHelper.interpPoint @lead1, @lead2, DrawHelper.ps1, i * segf, hs * oldOffset
      DrawHelper.interpPoint @lead1, @lead2, DrawHelper.ps2, (i + 1) * segf, hs * newOffset
      renderContext.drawThickLinePt DrawHelper.ps1, DrawHelper.ps2, DrawHelper.getVoltageColor(voltDrop)
      oldOffset = newOffset

    #if true @Circuit?.Params.showValues
    resistanceVal = getUnitText(@resistance, "ohm")
    @drawValues resistanceVal, hs, renderContext

    @drawPosts(renderContext)

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
    arr[3] = "R = " + getUnitText(@resistance, Circuit.ohmString)
    arr[4] = "P = " + getUnitText(@getPower(), "W")

  ResistorElm::needsShortcut = ->
    true

  ResistorElm::calculateCurrent = ->
    @current = (@volts[0] - @volts[1]) / @resistance

  ResistorElm::setPoints = ->
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


  return ResistorElm
