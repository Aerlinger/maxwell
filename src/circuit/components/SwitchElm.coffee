Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class SwitchElm extends CircuitComponent

  constructor: (xa, ya, xb, yb, f, params) ->
    super(xa, ya, xb, yb, f, params)

    @momentary = false
    @position = 0
    @posCount = 2

    @ps = new Point(0, 0)
    @ps2 = new Point(0, 0)

#    if params
#      params = params.split(" ")  if typeof params is "string"
#      str = params.shift()
#      @position = 0
#        if str is "true"
#          @position = (if (this instanceof LogicInputElm) then 0 else 1)
#        else if str is "false"
#          @position = (if (this instanceof LogicInputElm) then 1 else 0)
#        else
#          @position = parseInt(str)
#          @momentary = (st.shift().toLowerCase() is "true")


  getDumpType: ->
    "s"

  dump: ->
    "#{super()} #{@position} #{@momentary}"

  setPoints: ->
    super()
    @calcLeads 32
    @ps = new Point(0, 0)
    @ps2 = new Point(0, 0)

  stamp: (stamper) ->
    console.log(@voltSource)
    if @position is 0
      stamper.stampVoltageSource @nodes[0], @nodes[1], @voltSource, 0

  draw: (renderContext) ->
    openhs = 16
    hs1 = (if (@position is 1) then 0 else 2)
    hs2 = (if (@position is 1) then openhs else 2)

    @setBboxPt @point1, @point2, openhs
    @draw2Leads(renderContext)

    @drawDots(renderContext)  if @position is 0

    @ps = DrawHelper.interpPoint @lead1, @lead2, 0, hs1
    @ps2 = DrawHelper.interpPoint @lead1, @lead2, 1, hs2

    renderContext.drawThickLinePt @ps, @ps2, Settings.FG_COLOR

    @drawPosts(renderContext)

  calculateCurrent: ->
    @current = 0  if @position is 1

  getVoltageSourceCount: ->
    if (@position is 1) then 0 else 1

  mouseUp: ->
    @toggle() if @momentary

  toggle: ->
    @position++
    @position = 0  if @position >= @posCount
    @Circuit.Solver.analyzeFlag = true

  getInfo: (arr) ->
    arr[0] = (if (@momentary) then "push switch (SPST)" else "switch (SPST)")
    if @position is 1
      arr[1] = "open"
      arr[2] = "Vd = " + DrawHelper.getVoltageDText(@getVoltageDiff())
    else
      arr[1] = "closed"
      arr[2] = "V = " + DrawHelper.getVoltageText(@volts[0])
      arr[3] = "I = " + DrawHelper.getCurrentDText(@getCurrent())

  getConnection: (n1, n2) ->
    @position is 0

  isWire: ->
    true

  getEditInfo: (n) ->
  # TODO: Implement
  #    if (n == 0) {
  #        var ei:EditInfo = new EditInfo("", 0, -1, -1);
  #        //ei.checkbox = new Checkbox("Momentary Switch", momentary);
  #        return ei;
  #    }
  #    return null;
  setEditValue: (n, ei) ->
    n is 0


  #momentary = ei.checkbox.getState();
  toString: ->
    "SwitchElm"


return SwitchElm
