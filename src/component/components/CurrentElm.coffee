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

  class CurrentElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f
      try
        st = st.split(" ")  if typeof st is "string"
        @currentValue = parseFloat(st[0])
      catch e
        @currentValue = .01

    dump: ->
      super.dump(this) + " " + @currentValue

    getDumpType: ->
      "i"

    setPoints: ->
      @setPoints this
      @calcLeads 26
      @ashaft1 = DrawHelper.interpPoint(@lead1, @lead2, .25)
      @ashaft2 = DrawHelper.interpPoint(@lead1, @lead2, .6)
      @center = DrawHelper.interpPoint(@lead1, @lead2, .5)
      p2 = DrawHelper.interpPoint(@lead1, @lead2, .75)
      @arrow = DrawHelper.calcArrow(@center, p2, 4, 4)

    draw: ->
      cr = 12
      @draw2Leads()
      @setVoltageColor (@volts[0] + @volts[1]) / 2
      @setPowerColor false
      CircuitComponent.drawCircle @center.x1, @center.y, cr
      CircuitComponent.drawCircle @ashaft1, @ashaft2
      CircuitComponent.fillPolygon @arrow
      CircuitComponent.setBboxPt @point1, @point2, cr
      @doDots()

      if Circuit.showValuesCheckItem
        s = CircuitComponent.getShortUnitText(@currentValue, "A")
        @drawValues s, cr  if @dx is 0 or @dy is 0
      @drawPosts()

    stamp: ->
      @current = @currentValue
      Circuit.stampCurrentSource @nodes[0], @nodes[1], @current

    getEditInfo: (n) ->
      return new EditInfo("Current (A)", @currentValue, 0, .1)  if n is 0

    setEditValue: (n, ei) ->
      @currentValue = ei.value

    getInfo: (arr) ->
      arr[0] = "current source"
      @getBasicInfo arr

    getVoltageDiff: ->
      @volts[1] - @volts[0]

  return CurrentElm