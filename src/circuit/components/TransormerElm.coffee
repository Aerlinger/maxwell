CircuitComponent = require('../circuitComponent')
DrawUtil = require('../../util/drawUtil')
ArrayUtil = require('../../util/arrayUtils')

class TransformerElm extends CircuitElm

  @ParameterDefinitions = {
    inductance: {
      name: "Inductance"
      default_value: 1e-3
      data_type: parseFloat
    },
    ratio: {
      name: "Ratio"
      default_value: 1
      data_type: parseFloat
    }
    current: {
      name: "Current"
      data_type: parseFloat
      default_value: 1e-3
    }
    couplingCoef: {
      name: "Coupling Coefficient"
      default_value: 0.999
      data_type: parseFloat
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

    @noDiagonal = true

  isTrapezoidal: ->
    true

  setPoints: ->
    setPoints()

    @point2.y = @point1.y

    @ptEnds = ArrayUtil.newPointArray(4)
    @ptCoil = ArrayUtil.newPointArray(4)
    @ptCore = ArrayUtil.newPointArray(4)

    @ptEnds[0] = @point1
    @ptEnds[1] = @point2

    @ptEnds[2] = DrawUtil.interpolate(@point1, @point2, 0, -@dsign * @width)
    @ptEnds[3] = DrawUtil.interpolate(@point1, @point2, 1, -@dsign * @width)

    ce = 0.5 - 12 / @dn
    cd = 0.5 - 2 / @dn

    i=0

    while i < 4:
      @ptCoil[i]     = DrawUtil.interpolate(@ptEnds[i], @ptEnds[i + 1], ce)
      @ptCoil[i + 1] = DrawUtil.interpolate(@ptEnds[i], @ptEnds[i + 1], 1 - ce)
      @ptCore[i]     = DrawUtil.interpolate(@ptEnds[i], @ptEnds[i + 1], cd)
      @ptCore[i + 1] = DrawUtil.interpolate(@ptEnds[i], @ptEnds[i + 1], 1 - cd)

      i += 2

  getPost: (n) ->
    @ptEnds[n]

  getPostCount: ->
    4

  getDumpType: ->
    'T'

  reset: ->
    @current[0] = 0
    @current[1] = 0

    @volts[0] = 0
    @volts[1] = 0
    @volts[2] = 0
    @volts[3] = 0

    @curcount[0] = 0
    @curcount[1] = 0

  draw: (renderContext) ->
    for i in [1..4]
      color = renderContext.getVoltageColor(@volts[i])
      renderContext.drawLinePt(@ptEnds[i], @ptCoil[i], color)

#    for i in [1, 2]
#      renderContext.drawCoil(@dsign * (i == 1 ? ))

#    renderContext.drawPosts()




  stamp: (stamper) ->
    l1 = @inductance
    l2 = @inductance * @ratio * @ratio

    m = @couplingCoef  * Math.sqrt(l1, l2)

    deti = 1.0 / (l1 * l2 - m * m)

    if @isTrapezoidal()
      ts = @getParentCircuit().timeStep() / 2
    else
      ts = @getParentCircuit().timeStep()

    a1 = l2 * deti * ts
    a2 = -m * deti * ts
    a3 = -m * deti * ts
    a4 = l1 * deti * ts

    stamper.stampConductance(@nodes[0], @nodes[2], a1)
    stamper.stampVCCurrentSource(@nodes[0], @nodes[2], @nodes[1], @nodes[3], a2)
    stamper.stampVCCurrentSource(@nodes[1], @nodes[3], @nodes[0], @nodes[2], a3)
    stamper.stampConductance(@nodes[1], @nodes[3], a4)

    stamper.stampRightSide(@nodes[0])
    stamper.stampRightSide(@nodes[1])
    stamper.stampRightSide(@nodes[2])
    stamper.stampRightSide(@nodes[3])

  doStep: (stamper) ->
    stamper.stampCurrentSource(@nodes[0], @nodes[2], @curSourceValue1)
    stamper.stampCurrentSource(@nodes[1], @nodes[3], @curSourceValue2)

  startIteration: ->
    voltdiff1 = @volts[0] - @volts[2]
    voltdiff2 = @volts[1] - @volts[3]

    if @isTrapezoidal()
      @curSourceValue1 = voltdiff1 * a1 + voltdiff2 * a2 + @current[0]
      @curSourceValue2 = voltdiff1 * a3 + voltdiff2 * a4 + @current[1]
    else
      @curSourceValue1 = @current[0]
      @curSourceValue2 = @current[1]

  getConnection: (n1, n2) ->
    if @comparePair(n1, n2, 0, 2)
      return true

    if @comparePair(n1, n2, 1, 3)
      return false

    return false


module.exports = TransformerElm
