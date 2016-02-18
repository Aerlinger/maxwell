CircuitComponent = require("../CircuitComponent.coffee")
Util = require("../../util/util.coffee")
Settings = require('../../settings/settings.coffee')

Point = require("../../geom/point.coffee")

class PotElm extends CircuitComponent

  @Fields = {
    "maxResistance": {
      name: "Max Resistance"
      default_value: 1e4
      data_type: parseFloat
      range: [0, 1e5]
    },
    "position": {
      name: "Position"
      default_value: 1
      range: [0, 1e5]
      data_type: parseFloat
    },
    "sliderText": {
      name: "sliderText"
      default_value: ""
      data_type: (x) -> x
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

    @sliderValue = @position * 100

#  draw: (renderContext) ->
#    super()
#
#    @getParentCircuit.halt("Draw not yet implemented for #{this}")

  adjustmentValueChanged: ->
    @getParentCircuit().Solver.analyzeFlag = true
    @setPoints()

  getDumpType: ->
    174

  getPostCount: ->
    3

  setPoints: ->
    super()

    offset = 0

    if Math.abs(@dx) > Math.abs(@dy)
      @dx = Util.snapGrid(@dx / 2) * 2
      @point2.x = @x2 = @point1.x + @dx

      offset = if (@dx < 0) then @dy else -@dy

      @point2.y = @point1.y
    else
      @dy = Util.snapGrid(@dy / 2) * 2
      @point2.y = @y2 = @point1.y + @dy
      offset = if (@dy > 0) then @dx else -@dx
      @point2.x = @point1.x

    if (offset == 0)
      offset = Settings.GRID_SIZE

    @dn = Math.sqrt(Math.pow(@point1.x - @point2.x, 2), Math.pow(@point1.y - @point2.y, 2))

    bodyLen = 32

    @calcLeads(bodyLen)
    #    @position = @getSliderValue() * 0.0099 + 0.005
    soff = Math.floor((@position - 0.5) * bodyLen)

    @post3 = Util.interpolate(@point1, @point2, 0.5, offset)
    @corner2 = Util.interpolate(@point1, @point2, soff / @dn + 0.5, offset)
    @arrowPoint = Util.interpolate(@point1, @point2, soff / @dn + 0.5, 8 * Math.sign(offset))
    @midpoint = Util.interpolate(@point1, @point2, soff / @dn + 0.5)

    clen = Math.abs(offset) - 8

    [@arrow1, @arrow2] = Util.interpolateSymmetrical(@corner2, @arrowPoint, (clen - 8) / clen, 8)

    @ps3 = new Point()
    @ps4 = new Point()

  getPost: (n) ->
    if n == 0
      @point1
    else if n == 1
      @point2
    else
      @post3

#    return (n == 0) ? @point1 : (n == 1) ? @point2 : @post3;

  calculateCurrent: ->
    @current1 = (@volts[0] - @volts[2]) / @resistance1
    @current2 = (@volts[1] - @volts[2]) / @resistance2
    @current3 = -@current1 - @current2

  stamp: (stamper) ->
    @resistance1 = @maxResistance * @position
    @resistance2 = @maxResistance * (1 - @position)
    stamper.stampResistor(@nodes[0], @nodes[2], @resistance1)
    stamper.stampResistor(@nodes[2], @nodes[1], @resistance2)


module.exports = PotElm
