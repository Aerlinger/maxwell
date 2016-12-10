CircuitComponent = require('../circuitComponent.coffee')
Util = require('../../util/util.coffee')
Point = require('../../geom/point.coffee')
Settings = require('../../settings/settings.coffee')

class RelayElm extends CircuitComponent
  @FLAG_SWAP_COIL = 1
  @FLAG_BACK_EULER = 2

  @Fields = [
    {
      id: "poleCount"
      data_type: parseInt
    },
    {
      id: "inductance"
      data_type: parseFloat
    },
    {
      id: "coilCurrent"
      data_type: parseFloat
    },
    {
      id: "r_on"
      data_type: parseFloat
    },
    {
      id: "r_off"
      data_type: parseFloat
    },
    {
      id: "onCurrent"
      data_type: parseFloat
    },
    {
      id: "coilR"
      data_type: parseFloat
    }
  ]


  constructor: (xa, ya, xb, yb, params, f) ->
    @switchCurrent = []

    @nSwitch0 = 0
    @nSwitch1 = 1
    @nSwitch2 = 2

    super(xa, ya, xb, yb, params, f)

#    ind.setup(@inductance, @coilCurrent, Inductor.FLAG_BACK_EULER)
#    @flags = RelayElm.FLAG_BACK_EULER
    @tempCurrent = @coilCurrent
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
      for j in [0...3]
        @swposts[i][j] = new Point()
        @swpoles[i][j] = new Point()

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
    if n < 3 * @poleCount
      return @swposts[Math.floor(n / 3)][n % 3]

    @coilPosts[n - 3 * @poleCount]

  getPostCount: ->
    2 + 3 * @poleCount

  getInternalNodeCount: ->
    1

  isTrapezoidal: ->
    (@flags & RelayElm.FLAG_BACK_EULER) == 0

  getDumpType: ->
    178

  reset: ->
    super()

    @current = 0
    @tempCurrent = 0
    @coilCurrent = 0
    @coilCurCount = 0

    for i in [0...@poleCount]
      @switchCurrent[i] = @switchCurCount[i] = 0

  stamp: (stamper) ->
    if @isTrapezoidal()
      @compResistance = 2 * @inductance / @getParentCircuit().timeStep()
    # backward euler
    else
      @compResistance = @inductance / @getParentCircuit().timeStep()

    stamper.stampResistor @nodes[@nCoil1], @nodes[@nCoil3], @compResistance
    stamper.stampRightSide @nodes[@nCoil1]
    stamper.stampRightSide @nodes[@nCoil3]

    stamper.stampResistor(@nodes[@nCoil3], @nodes[@nCoil2], @coilR)

    for i in [0...(3 * @poleCount)]
      console.log("STAMP! #{@nodes[@nSwitch0 + i]} #{@nodes[@nCoil1]}, #{@nodes[@nCoil2]}, #{@nodes[@nCoil3]}, #{@coilR} -> #{@compResistance}")

#      console.log(@nodes[@nSwitch0 + i])
      stamper.stampNonLinear(@nodes[@nSwitch0 + i])


  startIteration: ->
    # ind.startIteration(@volts[@nCoil1] - @volts[@nCoil3])
    voltdiff = @volts[@nCoil1] - @volts[@nCoil3]

    if @isTrapezoidal()
      @curSourceValue = voltdiff / @compResistance + @tempCurrent
    # backward euler
    else
      @curSourceValue = @tempCurrent

    magic = 1.3
    pmult = Math.sqrt(magic + 1)
    p = @coilCurrent * pmult / @onCurrent

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

  draw: (renderContext) ->
    for i in [0...2]
      Util.getVoltageColor(@volts[@nCoil1 + i])
      renderContext.drawLinePt(@coilLeads[i], @coilPosts[i])

    renderContext.drawLeads(this)

    x = if ((@flags & RelayElm.FLAG_SWAP_COIL) != 0) then 1 else 0

    renderContext.drawCoil(@coilLeads[x], @coilLeads[1 - x], @volts[@nCoil1 + x], @volts[@nCoil2 - x], @dsign * 6)

    # draw lines
    for i in [0...@poleCount]
      if (i == 0)
        @lines[i * 2] = Util.interpolate(@point1, @point2, .5, @openhs * 2 + 5 * @dsign - i * @openhs * 3)
      else
        @lines[i * 2] = Util.interpolate(@point1, @point2, .5, Math.floor((@openhs * (-i * 3 + 3 - 0.5 + @d_position)) + 5 * @dsign))

      @lines[i * 2 + 1] = Util.interpolate(@point1, @point2, .5, Math.floor((@openhs * (-i * 3 - .5 + @d_position)) - 5 * @dsign))

      renderContext.drawLine(@lines[i * 2].x, @lines[i * 2].y, @lines[i * 2 + 1].x, @lines[i * 2 + 1].y, "#AAA")

    for p in [0...@poleCount]
      po = p * 3

      for i in [0...3]
        # draw lead
        Util.getVoltageColor(@volts[@nSwitch0 + po + i]);
        renderContext.drawLinePt(@swposts[p][i], @swpoles[p][i])

      @ptSwitch[p] = Util.interpolate(@swpoles[p][1], @swpoles[p][2], @d_position)

      renderContext.drawLinePt(@swpoles[p][0], @ptSwitch[p], Settings.LIGHT_POST_COLOR)
      #      switchCurCount[p] = updateDotCount(@switchCurrent[p], @switchCurCount[p], this)

      @updateDots()
      renderContext.drawDots(@swposts[p][0], @swpoles[p][0], this)

      # TODO: Multi dots
#      if (@i_position != 2)
#        @drawDots(g, @swpoles[p][@i_position + 1], @swposts[p][@i_position + 1], @switchCurCount[p])

#    coilCurCount = updateDotCount(coilCurrent, coilCurCount);

#    drawDots(g, coilPosts[0], coilLeads[0], coilCurCount);
#    drawDots(g, coilLeads[0], coilLeads[1], coilCurCount);
#    drawDots(g, coilLeads[1], coilPosts[1], coilCurCount);

    renderContext.drawPosts(this)

    if CircuitComponent.DEBUG
      super(renderContext)

    #    adjustBbox(swpoles[poleCount - 1][0], swposts[poleCount - 1][1]); // XXX

  doStep: (stamper) ->
    stamper.stampCurrentSource @nodes[@nCoil1], @nodes[@nCoil3], @curSourceValue

    res0 = if @i_position == 0 then @r_on else @r_off
    res1 = if @i_position == 1 then @r_on else @r_off

    p = 0
    while p < 3 * @poleCount
      stamper.stampResistor(@nodes[@nSwitch0 + p], @nodes[@nSwitch1 + p], res0)
      stamper.stampResistor(@nodes[@nSwitch0 + p], @nodes[@nSwitch2 + p], res1)

      @nSwitch0 + p

      p += 3

  calculateCurrent: ->
    voltdiff = @volts[@nCoil1 - @volts[@nCoil3]]

    #  @coilCurrent = ind.calculateCurrent(voltdiff)

    if @compResistance > 0
      @tempCurrent = voltdiff / @compResistance + @curSourceValue

    @coilCurrent = @tempCurrent

    for p in [0...@poleCount]
      if @i_position == 2
        @switchCurrent[p] = 0
      else
        @switchCurrent[p] = (@volts[@nSwitch0 + p * 3] - @volts[@nSwitch1 + p * 3 + @i_position]) / @r_on


  getConnection: (n1, n2) ->
    Math.floor(n1 / 3) == Math.floor(n2 / 3)

  nonLinear: ->
    true


module.exports = RelayElm
