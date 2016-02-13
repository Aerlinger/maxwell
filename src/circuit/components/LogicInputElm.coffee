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

  @Fields = Util.extend(@Fields, {
    hiV: {
      name: "Voltage High"
      data_type: parseFloat
    },
    loV: {
      name: "Voltage Low"
      data_type: parseFloat
    }
  })

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

    if @isTernary()
      @posCount = 3


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
    @current = - c

  stamp: (stamper) ->
    v = if @position == 0 then @loV else @hiV

    if @isTernary
      v = @position * 2.5

    stamper.stampVoltageSource(@nodes[0], @voltSource, v)

  getVoltageSourceCount: ->
    1

  getVoltageDiff: ->
    return @volts[0]

  hasGroundConnection: (n1) ->
    return true



module.exports = LogicInputElm

