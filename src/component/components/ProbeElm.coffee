# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitComponent',
  'cs!Units'
], (
Settings,
DrawHelper,
Polygon,
Rectangle,
Point,

CircuitComponent,
Units
) ->
  # </DEFINE>

  class ProbeElm extends CircuitComponent

    @FLAG_SHOWVOLTAGE: 1

    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f

    getDumpType: ->
      "p"

    setPoints: ->
      CircuitComponent::setPoints.call this

      # swap points so that we subtract higher from lower
      if @point2.y < @point1.y
        x = @point1
        @point1 = @point2
        @point2 = @x1
      @center = DrawHelper.interpPoint(@point1, @point2, .5)

    draw: ->
      hs = 8
      CircuitComponent.setBboxPt @point1, @point2, hs
      selected = (@needsHighlight() or Circuit.plotYElm is this)

      if selected or Circuit.dragElm is this
        len = 16
      else
        len = @dn - 32

      CircuitComponent.calcLeads Math.floor(len)

      color = @setVoltageColor(@volts[0])
      if selected
        color = CircuitComponent.selectColor

      CircuitComponent.drawThickLinePt @point1, @lead1, color

      color = @setVoltageColor(@volts[1])
      if selected
        CircuitComponent.setColor @selectColor

      CircuitComponent.drawThickLinePt @lead2, @point2

      CircuitComponent.setFont new Font("SansSerif", Font.BOLD, 14)
      CircuitComponent.drawCenteredText("X", @center.x1, @center.y, color) if this is Circuit.plotXElm
      CircuitComponent.drawCenteredText("Y", @center.x1, @center.y, color) if this is Circuit.plotYElm

      if @mustShowVoltage()
        s = CircuitComponent.getShortUnitText(volts[0], "V")
        @drawValues s, 4

      @drawPosts()

    mustShowVoltage: ->
      (@flags & ProbeElm.FLAG_SHOWVOLTAGE) isnt 0

    getInfo: (arr) ->
      arr[0] = "scope probe"
      arr[1] = "Vd = " + CircuitComponent.getVoltageText(@getVoltageDiff())

    getConnection: (n1, n2) ->
      false

    getEditInfo: (n) ->
      if n is 0
        ei = new EditInfo("", 0, -1, -1)
        ei.checkbox = new Checkbox("Show Voltage", @mustShowVoltage())
        return ei
      return null

    setEditValue: (n, ei) ->
      if n is 0
        if ei.checkbox.getState()
          flags = ProbeElm.FLAG_SHOWVOLTAGE
        else
          flags &= ~ProbeElm.FLAG_SHOWVOLTAGE


  return ProbeElm
