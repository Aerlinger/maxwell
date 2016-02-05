CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')

class SwitchElm extends CircuitComponent

  @ParameterDefinitions = {
    "position": {
      name: "Position"
      default_value: 0
      data_type: (str)->
        str = str.toString()

        if str == 'true'
          1
        else if str == 'false'
          0
        else
          parseInt(str)
    },
    "momentary": {
      name: "Momentary"
      default_value: 0
      data_type: (str) -> str.toString() == 'true'
    }
  }

  constructor: (xa, ya, xb, yb, params) ->
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

    super(xa, ya, xb, yb, params)


  setPoints: ->
#    super.setPoints()
    super()

    @calcLeads(32)
    @ps = new Point(0, 0)
    @ps2 = new Point(0, 0)

  getDumpType: ->
    "s"

  stamp: (stamper) ->
#    console.log(@voltSource)
    if @position is 0
      stamper.stampVoltageSource @nodes[0], @nodes[1], @voltSource, 0

  draw: (renderContext) ->
    @calcLeads 32
    @ps = new Point(0, 0)
    @ps2 = new Point(0, 0)

    openhs = 16
    hs1 = (if (@position is 1) then 0 else 2)
    hs2 = (if (@position is 1) then openhs else 2)

    @setBboxPt @point1, @point2, openhs
    renderContext.drawLeads(this)

    renderContext.drawDots(this)  if @position is 0

    @ps = renderContext.interpolate @lead1, @lead2, 0, hs1
    @ps2 = renderContext.interpolate @lead1, @lead2, 1, hs2

    renderContext.drawLinePt @ps, @ps2, Settings.FG_COLOR

    renderContext.drawPosts(this)

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
      arr[2] = "Vd = " + @getUnitText(@getVoltageDiff(), "V")
    else
      arr[1] = "closed"
      arr[2] = "V = " + @getUnitText(@volts[0], "V")
      arr[3] = "I = " + @getUnitText(@getCurrent(), "A")

  getConnection: (n1, n2) ->
    @position is 0

  isWire: ->
    true

  toString: ->
    "SwitchElm"


module.exports = SwitchElm
