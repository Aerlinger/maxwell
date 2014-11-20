# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitComponent',
  'cs!Units'
], (Settings,
    DrawHelper,
    Polygon,
    Rectangle,
    Point,
    CircuitComponent,
    Units) ->
  # </DEFINE>
  class ProbeElm extends CircuitComponent

    @FLAG_SHOWVOLTAGE: 1

    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f

    getDumpType: ->
      "p"

    toString: ->
      "ProbeElm"

    setPoints: ->
      super()

      # swap points so that we subtract higher from lower
      if @point2.y < @point1.y
        x = @point1
        @point1 = @point2
        @point2 = @x1

      @center = DrawHelper.interpPoint(@point1, @point2, .5)

    draw: (renderContext) ->
      hs = 8
      @setBboxPt @point1, @point2, hs
      #      selected = (@needsHighlight() or Circuit.plotYElm is this)

      #      if selected or Circuit.dragElm is this
      #        len = 16
      #      else
      len = @dn - 32

      @calcLeads Math.floor(len)

      if @isSelected()
        color = Settings.SELECT_COLOR
      else
        color = DrawHelper.getVoltageColor(@volts[0])

      renderContext.drawThickLinePt @point1, @lead1, color

      if @isSelected()
        color = Settings.SELECT_COLOR
      else
        color = DrawHelper.getVoltageColor(@volts[1])

      renderContext.drawThickLinePt @lead2, @point2, color

      #      renderContext.setFont new Font("SansSerif", Font.BOLD, 14)

      #      renderContext.drawCenteredText("X", @center.x1, @center.y, color) if this is Circuit.plotXElm
      #      renderContext.drawCenteredText("Y", @center.x1, @center.y, color) if this is Circuit.plotYElm

      if @mustShowVoltage()
        unit_text = DrawHelper.getShortUnitText(@volts[0], "V")
        @drawValues unit_text, 4, renderContext

      @drawPosts(renderContext)

    mustShowVoltage: ->
      (@flags & ProbeElm.FLAG_SHOWVOLTAGE) isnt 0

    getInfo: (arr) ->
      arr[0] = "scope probe"
      arr[1] = "Vd = " + DrawHelper.getVoltageText(@getVoltageDiff())

    stamp: (stamper) ->

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
