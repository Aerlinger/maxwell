CircuitComponent = require('../circuitComponent.coffee')
Util = require('../../util/util.coffee')
Point = require('../../geom/point.coffee')

class RelayElm extends CircuitComponent
  @FLAG_SWAP_COIL = 1
  @FLAG_BACK_EULER = 2

  @Fields = {
    poleCount: {
      data_type: parseInt
    },
    inductance: {
      data_type: parseFloat
    },
    coilCurrent: {
      data_type: parseFloat
    },
    r_on: {
      data_type: parseFloat
    },
    r_off: {
      data_type: parseFloat
    },
    onCurrent: {
      data_type: parseFloat
    },
    coilR: {
      data_type: parseFloat
    }
  }


  constructor: (xa, ya, xb, yb, params, f) ->
    @switchCurrent = []

    @nSwitch0 = 0
    @nSwitch1 = 1
    @nSwitch2 = 2

    super(xa, ya, xb, yb, params, f)

#    ind.setup(@inductance, @coilCurrent, Inductor.FLAG_BACK_EULER)
#    @flags = RelayElm.FLAG_BACK_EULER
    @current = @coilCurrent
    @compResistance = 0
    @curSourceValue = 0

    @setupPoles()

    @noDiagonal = true

  setupPoles: ->
    @nCoil1 = 3 * @poleCount
    @nCoil2 = @nCoil1 + 1
    @nCoil3 = @nCoil1 + 2

    if (@switchCurrent == null || (@switchCurrent.length != @poleCount))
      @switchCurrent = new Array(@poleCount)
      @switchCurCount = new Array(@poleCount)

  setPoints: ->
    super()
    @setupPoles()
    @allocNodes()
    @openhs = -@dsign * 16

    @calcLeads(32)
    @swposts = (new Point() for i in [0...3] for j in [0...@poleCount])
    @swpoles = (new Point() for i in [0...3] for j in [0...@poleCount])

    for i in [0...@poleCount]
      @swpoles[i][0] = Util.interpolate(@lead1, @lead2, 0, -@openhs * 3 * i)
      @swpoles[i][1] = Util.interpolate(@lead1, @lead2, 1, -@openhs * 3 * i - @openhs)
      @swpoles[i][2] = Util.interpolate(@lead1, @lead2, 1, -@openhs * 3 * i + @openhs)
      @swposts[i][0] = Util.interpolate(@point1, @point2, 0, -@openhs * 3 * i)
      @swposts[i][1] = Util.interpolate(@point1, @point2, 1, -@openhs * 3 * i - @openhs)
      @swposts[i][2] = Util.interpolate(@point1, @point2, 1, -@openhs * 3 * i + @openhs)

    @coilPosts = new Array(2)
    @coilLeads = new Array(2)
    @ptSwitch = new Array(@poleCount)

    x = if ((@flags & RelayElm.FLAG_SWAP_COIL) != 0) then 1 else 0

    @coilPosts[0] = Util.interpolate(@point1, @point2, x, @openhs * 2)
    @coilPosts[1] = Util.interpolate(@point1, @point2, x, @openhs * 3)
    @coilLeads[0] = Util.interpolate(@point1, @point2, 0.5, @openhs * 2)
    @coilLeads[1] = Util.interpolate(@point1, @point2, 0.5, @openhs * 3)

    @lines = new Array(@poleCount * 2)

  getPost: (n) ->
    console.log(n, @swposts)

    if n < 3 * @poleCount
      return @swposts[Math.floor(n / 3)][n % 3]

    @coilPosts[n - 3 * @poleCount]

  getPostCount: ->
    2 + 3 * @poleCount

  getInternalNodeCount: ->
    1

  isTrapezoidal: ->
#    (@flags & RelayElm.FLAG_BACK_EULER) == 0
    true

  getDumpType: ->
    178

  reset: ->
    super()

    @current = 0
    @coilCurrent = 0
    @coilCurCount = 0

    for i in [0...@poleCount]
      @switchCurrent[i] = @switchCurCount[i] = 0

  stamp: (stamper) ->
    console.log(@nodes, @coilR, @compResistance, @inductance)
    console.log(@getParentCircuit().Solver.circuitMatrix)

    @nodes[0] = @nodes[@nCoil1]
    @nodes[1] = @nodes[@nCoil3]

#    console.log("isTrap", @isTrapezoidal())
    if @isTrapezoidal()
      @compResistance = 2 * @inductance / @getParentCircuit().timeStep()
    # backward euler
    else
      @compResistance = @inductance / @getParentCircuit().timeStep()

    console.log(@compResistance)
    stamper.stampResistor @nodes[0], @nodes[1], @compResistance
    stamper.stampRightSide @nodes[0]
    stamper.stampRightSide @nodes[1]

    console.log(@coilR)
    stamper.stampResistor(@nodes[@nCoil3], @nodes[@nCoil2], @coilR)

    for i in [0...(3 * @poleCount)]
      console.log(@nodes[@nSwitch0 + i])
      stamper.stampNonLinear(@nodes[@nSwitch0 + i])

    console.log(@getParentCircuit().Solver.circuitMatrix)

    console.log("STAMP", @nodes, @coilR, @compResistance, @inductance)

  startIteration: ->
#    ind.startIteration(@volts[@nCoil1] - @volts[@nCoil3])

    voltdiff = @volts[@nCoil1] - @volts[@nCoil3]

    if @isTrapezoidal()
      @curSourceValue = voltdiff / @compResistance + @current
    # backward euler
    else
      @curSourceValue = @current

#    magic = 1.3
#    pmult = Math.sqrt(@magic + 1)
    p = @coilCurrent * @pmult / @onCurrent

    @d_position = Math.abs(p * p) - 1.3

    if @d_position < 0
      @d_position = 0
    if @d_position > 1
      @d_position = 1
    if @d_position < 0.1
      @i_position = 0
    else if @d_position > 0.9
      @i_position = 1
    else
      @i_position = 2


  doStep: (stamper) ->
    voltdiff = @volts[@nCoil1] - @volts[@nCoil3]

    stamper.stampCurrentSource @nodes[0], @nodes[1], @curSourceValue

    console.log(@i_position)
    res0 = if @i_position == 0 then @r_on else @r_off
    res1 = if @i_position == 1 then @r_on else @r_off

    p = 0
    while p < 3 * @poleCount
      stamper.stampResistor(@nodes[@nSwitch0 + p], @nodes[@nSwitch1 + p], res0)
      stamper.stampResistor(@nodes[@nSwitch0 + p], @nodes[@nSwitch2 + p], res1)

      p += 3

  calculateCurrent: ->
    voltdiff = @volts[@nCoil1 - @volts[@nCoil3]]

    #  @coilCurrent = ind.calculateCurrent(voltdiff)

    if @compResistance > 0
      @coilCurrent = voltdiff / @compResistance + @curSourceValue

    p = 0
    while p < 3 * @poleCount
      if @i_position == 2
        @switchCurrent[p] = 0
      else
        @switchCurrent[p] = (@volts[@nSwitch0 + p * 3] - @volts[@nSwitch1 + p * 3 + @i_position]) / @r_on

      p += 3

  getConnection: (n1, n2) ->
    Math.floor(n1 / 3) == Math.floor(n2 / 3)

  nonLinear: ->
    true


module.exports = RelayElm
