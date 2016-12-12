CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
SwitchElm = require("./SwitchElm.coffee")
Util = require('../../util/util.coffee')

class LogicInputElm extends SwitchElm
  FLAG_TERNARY: 1
  FLAG_NUMERIC: 2

  @Fields = {
    "position": {
      name: "Position"
      default_value: 0
      data_type: (str)->
        str = str.toString()

        if str == 'true'
          0
        else if str == 'false'
          1
        else
          parseInt(str)
      field_type: "boolean"
    },
    "momentary": {
      name: "Momentary"
      default_value: 0
      data_type: (str) -> str.toString() == 'true'
      field_type: "boolean"
    }
    hiV: {
      name: "Voltage High"
      data_type: parseFloat
      default_value: 5
    },
    loV: {
      name: "Voltage Low"
      data_type: parseFloat
      default_value: 0
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

    if @isTernary()
      @posCount = 3

  draw: (renderContext) ->
    s = if @position == 0 then "L" else "H"

    if (@isNumeric())
      s = "" + @position;

    renderContext.fillText(s, @x2, @y2)

    color = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt(@point1, @lead1, color)

    @updateDots()
    renderContext.drawDots(@point1, @lead1, this)
    renderContext.drawPosts(this)

    if CircuitComponent.DEBUG
      super(renderContext)


  isTernary: ->
    @flags & LogicInputElm.FLAG_TERNARY != 0

  isNumeric: ->
    @flags & (LogicInputElm.FLAG_TERNARY | LogicInputElm.FLAG_NUMERIC) != 0

  getDumpType: ->
    'L'

  getPostCount: ->
    1

  setPoints: ->
    super()

    @lead1 = Util.interpolate(@point1, @point2, 1 - 12 / @dn)


  setCurrent: (vs, c) ->
    @current = -c

  stamp: (stamper) ->
    v = if @position == 0 then @loV else @hiV

    if @isTernary()
      v = @position * 2.5

    stamper.stampVoltageSource(0, @nodes[0], @voltSource, v)

  getVoltageSourceCount: ->
    1

  getVoltageDiff: ->
    return @volts[0]

  hasGroundConnection: (n1) ->
    return true



module.exports = LogicInputElm

