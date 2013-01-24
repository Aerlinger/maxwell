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

  class DiodeElm extends CircuitComponent

    @FLAG_FWDROP: 1
    @DEFAULT_DROP: .805904783

    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f

      @hs = 8
      @poly
      @cathode = []

      @diode = new Diode()
      @fwdrop = DiodeElm.DEFAULT_DROP
      @zvoltage = 0

      if (f & DiodeElm.FLAG_FWDROP) > 0
        try
          @fwdrop = parseFloat(st)

      @setup()


    nonLinear: ->
      true

    setup: ->
      @diode.setup @fwdrop, @zvoltage

    getDumpType: ->
      "d"

    dump: ->
      @flags |= DiodeElm.FLAG_FWDROP
      CircuitComponent::dump.call(this) + " " + @fwdrop

    setPoints: ->
      super()
      @calcLeads 16
      @cathode = CircuitComponent.newPointArray(2)
      pa = CircuitComponent.newPointArray(2) # Point array
      DrawHelper.interpPoint @lead1, @lead2, 0, @hs, pa[0], pa[1]
      DrawHelper.interpPoint @lead1, @lead2, 1, @hs, @cathode[0], @cathode[1]
      @poly = CircuitComponent.createPolygon(pa[0], pa[1], @lead2)

    draw: ->
      @drawDiode()
      @doDots()
      @drawPosts()

    reset: ->
      @diode.reset()
      @volts[0] = @volts[1] = @curcount = 0

    drawDiode: ->
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

    stamp: ->
      @diode.stamp @nodes[0], @nodes[1]

    doStep: ->
      @diode.doStep @volts[0] - @volts[1]

    calculateCurrent: ->
      @current = @diode.calculateCurrent(@volts[0] - @volts[1])

    getInfo: (arr) ->
      arr[0] = "diode"
      arr[1] = "I = " + CircuitComponent.getCurrentText(@getCurrent())
      arr[2] = "Vd = " + CircuitComponent.getVoltageText(@getVoltageDiff())
      arr[3] = "P = " + CircuitComponent.getUnitText(@getPower(), "W")
      arr[4] = "Vf = " + CircuitComponent.getVoltageText(@fwdrop)

    getEditInfo: (n) ->
      return new EditInfo("Fwd Voltage @ 1A", @fwdrop, 10, 1000)  if n is 0

    setEditValue: (n, ei) ->
      @fwdrop = ei.value
      @setup()


    # TODO: fix
    needsShortcut: ->
      #return getClass() == DiodeElm.class;
      return true

  return DiodeElm
