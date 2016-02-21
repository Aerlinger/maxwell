CircuitComponent = require("../CircuitComponent.coffee")
Util = require('../../util/util.coffee')
Settings = require('../../settings/settings.coffee')

class TransLineElm extends CircuitComponent
  @Fields = {
    delay: {
      name: "Delay"
      data_type: parseFloat
    }
    imped: {
      name: "Impedance"
      data_type: parseFloat
    }
    width: {
      name: "Width (m)"
      data_type: parseFloat
    }
    resistance: {
      name: "Resistance"
      data_type: parseFloat
    }
  }

  constructor: (xa, xb, ya, yb, params, f) ->
    @noDiagonal = true

    super(xa, xb, ya, yb, params, f)
    delete @params['resistance']

    @ptr = 0

  onSolder: (circuit)->
    super()

    @lenSteps = Math.floor(@delay / circuit.timeStep())

    if @lenSteps > 100000
      @voltageL = null
      @voltageR = null

    else
      @voltageL = Util.zeroArray(@lenSteps)
      @voltageR = Util.zeroArray(@lenSteps)

    @ptr = 0

  setPoints: ->
    super()

    ds = if (@dy == 0) then Math.sign(@dx) else -Math.sign(@dy)

    p3 = Util.interpolate(@point1, @point2, 0, -Math.floor(@width * ds))
    p4 = Util.interpolate(@point1, @point2, 1, -Math.floor(@width * ds))

    sep = Settings.GRID_SIZE / 2
    p5 = Util.interpolate(@point1, @point2, 0, -Math.floor(@width / 2 - sep) * ds)
    p6 = Util.interpolate(@point1, @point2, 1, -Math.floor(@width / 2 - sep) * ds)
    p7 = Util.interpolate(@point1, @point2, 0, -Math.floor(@width / 2 + sep) * ds)
    p8 = Util.interpolate(@point1, @point2, 1, -Math.floor(@width / 2 + sep) * ds)

    @posts = [p3, p4, @point1, @point2]
    @inner = [p7, p8, p5, p6]


  getDumpType: ->
    "171"

  getConnection: (n1, n2) ->
    false

  hasGroundConnection: (n1) ->
    false

  getVoltageSourceCount: ->
    2

  getInternalNodeCount: ->
    2

  getPost: (n) ->
    @posts[n]

  getPostCount: ->
    4

  setVoltageSource: (n, v) ->
    if n is 0
      @voltSource1 = v
    else
      @voltSource2 = v

  setCurrent: (v, c) ->
    if v == @voltSource1
      @current1 = c
    else
      @current2 = c

  stamp: (stamper) ->
    stamper.stampVoltageSource(@nodes[4], @nodes[0], @voltSource1)
    stamper.stampVoltageSource(@nodes[5], @nodes[1], @voltSource2)
    stamper.stampResistor(@nodes[2], @nodes[4], @imped)
    stamper.stampResistor(@nodes[3], @nodes[5], @imped)


  startIteration: ->
    unless @voltageL
      console.error("Transmission line delay too large!")
      return

    @voltageL[@ptr] = @volts[2] - @volts[0] + @volts[2] - @volts[4]
    @voltageR[@ptr] = @volts[3] - @volts[1] + @volts[3] - @volts[5]

    @ptr = (@ptr + 1) % @lenSteps

  doStep: (stamper) ->
    unless @voltageL
      console.error("Transmission line delay too large!")
      return

    stamper.updateVoltageSource(@nodes[4], @nodes[0], @voltSource1, -@voltageR[@ptr])
    stamper.updateVoltageSource(@nodes[5], @nodes[1], @voltSource2, -@voltageL[@ptr])

    if Math.abs(@volts[0]) > 1e-5 or Math.abs(@volts[1]) > 1e-5
      console.error("Transmission line not grounded!")


module.exports = TransLineElm
