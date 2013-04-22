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


  class SparkGapElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f
      @resistance = 0
      @offresistance = 1e9
      @onresistance = 1e3
      @breakdown = 1e3
      @holdcurrent = 0.001
      @state = false
      if st
        st = st.split(" ")  if typeof st is "string"
        @onresistance = parseFloat(st.shift())  if st
        @offresistance = parseFloat(st.shift())  if st
        @breakdown = parseFloat(st.shift())  if st
        @holdcurrent = parseFloat(st.shift())  if st


    nonLinear: ->
      true

    getDumpType: ->
      187

    dump: ->
      CircuitComponent::dump.call(this) + " " + @onresistance + " " + @offresistance + " " + @breakdown + " " + @holdcurrent

    setPoints: ->
      CircuitComponent::setPoints.call this
      dist = 16
      alen = 8
      @calcLeads dist + alen
      p1 = DrawHelper.interpPoint(@point1, @point2, (@dn - alen) / (2 * @dn))
      @arrow1 = DrawHelper.calcArrow(@point1, p1, alen, alen)
      p1 = DrawHelper.interpPoint(@point1, @point2, (@dn + alen) / (2 * @dn))
      @arrow2 = DrawHelper.calcArrow(@point2, p1, alen, alen)

    draw: (renderContext) ->
      v1 = @volts[0]
      v2 = @volts[1]
      @setBboxPt @point1, @point2, 8
      @draw2Leads()
      @setPowerColor true
      color = @setVoltageColor(@volts[0])
      CircuitComponent.drawThickPolygonP @arrow1, color
      color = @setVoltageColor(@volts[1])
      CircuitComponent.drawThickPolygonP @arrow2, color
      @doDots() if @state
      @drawPosts()

    calculateCurrent: ->
      vd = @volts[0] - @volts[1]
      @current = vd / @resistance

    reset: ->
      CircuitComponent::reset.call this
      @state = false

    startIteration: ->
      @state = false  if Math.abs(@current) < @holdcurrent
      vd = @volts[0] - @volts[1]
      @state = true  if Math.abs(vd) > @breakdown

    doStep: ->
      @resistance = (if (@state) then @onresistance else @offresistance)
      Circuit.stampResistor @nodes[0], @nodes[1], @resistance

    stamp: ->
      Circuit.stampNonLinear @nodes[0]
      Circuit.stampNonLinear @nodes[1]

    getInfo: (arr) ->
      arr[0] = "spark gap"
      @getBasicInfo arr
      arr[3] = (if @state then "on" else "off")
      arr[4] = "Ron = " + CircuitComponent.getUnitText(@onresistance, Circuit.ohmString)
      arr[5] = "Roff = " + CircuitComponent.getUnitText(@offresistance, Circuit.ohmString)
      arr[6] = "Vbreakdown = " + CircuitComponent.getUnitText(@breakdown, "V")

    getEditInfo: (n) ->

      # ohmString doesn't work here on linux
      return new EditInfo("On resistance (ohms)", @onresistance, 0, 0)  if n is 0
      return new EditInfo("Off resistance (ohms)", @offresistance, 0, 0)  if n is 1
      return new EditInfo("Breakdown voltage", @breakdown, 0, 0)  if n is 2
      return new EditInfo("Holding current (A)", @holdcurrent, 0, 0)  if n is 3
      null

    getEditInfo: (n, ei) ->
      onresistance = ei.value  if ei.value > 0 and n is 0
      offresistance = ei.value  if ei.value > 0 and n is 1
      breakdown = ei.value  if ei.value > 0 and n is 2
      holdcurrent = ei.value  if ei.value > 0 and n is 3

    needsShortcut: ->
      false

  return SparkGapElm
