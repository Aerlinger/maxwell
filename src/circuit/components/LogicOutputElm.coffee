CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class LogicOutputElm extends CircuitComponent
  FLAG_TERNARY: 1
  FLAG_NUMERIC: 2
  FLAG_PULLDOWN: 4

  @ParameterDefinitions = {
    threshold: {
      name: "Threshold Voltage"
      data_type: parseFloat
      default: 2.5
    }
  }


  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

    if @isTernary()
      @posCount = 3


  isTernary: ->
    @flags & LogicOutputElm.FLAG_TERNARY != 0

  isNumeric: ->
    @flags & (LogicOutputElm.FLAG_TERNARY | LogicOutputElm.FLAG_NUMERIC) != 0

  needsPullDown: ->
    (@flags & LogicOutputElm.FLAG_PULLDOWN) != 0

  getDumpType: ->
    'M'

  getPostCount: ->
    1

  setPoints: ->
    super()

    @lead1 = Util.interpolate(@point1, @point2, 1 - 12 / @dn)


  setCurrent: (vs, c) ->
    @current = - c

  stamp: (stamper) ->
    if @needsPullDown()
      stamper.stampResistor(@nodes[0], 0, 1e6)

  getVoltageSourceCount: ->
    1

  getVoltageDiff: ->
    return @volts[0]



module.exports = LogicOutputElm
