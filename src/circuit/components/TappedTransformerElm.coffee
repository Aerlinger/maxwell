CircuitComponent = require("../circuitComponent.js")
Util = require('../../util/util.coffee')

class TappedTransformerElm extends CircuitComponent

  @Fields = {
    inductance: {
      name: "Inductance"
      data_type: parseFloat
    }
    ratio: {
      name: "Ratio"
      data_type: parseFloat
    }
    current0: {
      name: "Current0"
      data_type: parseFloat
    }
    current1: {
      name: "Current1"
      data_type: parseFloat
      default_value: 1
    }
    current2: {
      name: "Current2"
      data_type: parseFloat
      default_value: 0
    }
  }

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @current = [@current0, @current1, @current2, 0]
    @params['current'] = @current

    delete @params['current0']
    delete @params['current1']
    delete @params['current2']

    @noDiagonal = true

  draw: (renderContext) ->
    super(renderContext)
    @current[3] = @current[1] - @current[2]

  setPoints: ->
    super

    hs = 32

    @ptEnds = new Array(5)
    @ptCoil = new Array(5)
    @ptCore = new Array(4)

    @ptEnds[0] = @point1
    @ptEnds[2] = @point2

    @ptEnds[1] = Util.interpolate(@point1, @point2, 0, -hs * 2)
    @ptEnds[3] = Util.interpolate(@point1, @point2, 1, -hs)
    @ptEnds[4] = Util.interpolate(@point1, @point2, 1, -hs * 2)

    ce = 0.5 - 12 / @dn()
    cd = 0.5 - 2 / @dn()

    @ptCoil[0] = Util.interpolate(@ptEnds[0], @ptEnds[2], ce)
    @ptCoil[1] = Util.interpolate(@ptEnds[0], @ptEnds[2], ce, -hs * 2)
    @ptCoil[2] = Util.interpolate(@ptEnds[0], @ptEnds[2], 1 - ce)
    @ptCoil[3] = Util.interpolate(@ptEnds[0], @ptEnds[2], 1 - ce, -hs)
    @ptCoil[4] = Util.interpolate(@ptEnds[0], @ptEnds[2], 1 - ce, -hs * 2)

    for i in [0...2]
      b = -hs * i * 2
      @ptCore[i] = Util.interpolate(@ptEnds[0], @ptEnds[2], cd, b)
      @ptCore[i + 2] = Util.interpolate(@ptEnds[0], @ptEnds[2], 1 - cd, b)

  getPost: (n) ->
    @ptEnds[n]

  getPostCount: ->
    5

  getDumpType: ->
    "169"

  setNodeVoltage: (node_idx, voltage) ->
#    console.log("TRANS", voltage)
    super()

  reset: ->
    @current[0] = 0
    @current[1] = 0

    @volts[0] = 0
    @volts[1] = 0
    @volts[2] = 0
    @volts[3] = 0

    @curcount[0] = 0
    @curcount[1] = 0

  stamp: (stamper) ->
    l1 = @inductance
    l2 = @inductance * @ratio * @ratio / 4
    cc = 0.99

    @a = new Array(9)

    @a[0] = (1 + cc) / (l1 * (1 + cc - 2 * cc * cc))
    @a[1] = @a[2] = @a[3] = @a[6] = 2 * cc / ((2 * cc * cc - cc - 1) * @inductance * @ratio)
    @a[4] = @a[8] = -4 * (1 + cc) / ((2 * cc * cc - cc - 1) * l1 * @ratio * @ratio)
    @a[5] = @a[7] = 4 * cc / ((2 * cc * cc - cc - 1) * l1 * @ratio * @ratio)

    for i in [0...9]
      @a[i] *= @getParentCircuit().timeStep() / 2

      stamper.stampConductance(@nodes[0], @nodes[1], @a[0])
      stamper.stampVCCurrentSource(@nodes[0], @nodes[1], @nodes[2], @nodes[3], @a[1])
      stamper.stampVCCurrentSource(@nodes[0], @nodes[1], @nodes[3], @nodes[4], @a[2])
  
      stamper.stampVCCurrentSource(@nodes[2], @nodes[3], @nodes[0], @nodes[1], @a[3])
      stamper.stampConductance(@nodes[2], @nodes[3], @a[4])
      stamper.stampVCCurrentSource(@nodes[2], @nodes[3], @nodes[3], @nodes[4], @a[5])
  
      stamper.stampVCCurrentSource(@nodes[3], @nodes[4], @nodes[0], @nodes[1], @a[6])
      stamper.stampVCCurrentSource(@nodes[3], @nodes[4], @nodes[2], @nodes[3], @a[7])
      stamper.stampConductance(@nodes[3], @nodes[4], @a[8])
  
      for i in [0...5]
        stamper.stampRightSide(@nodes[i])

      @voltdiff = new Array(3)
      @curSourceValue = new Array(3)

  doStep: (stamper) ->
    stamper.stampCurrentSource(@nodes[0], @nodes[1], @curSourceValue[0])
    stamper.stampCurrentSource(@nodes[2], @nodes[3], @curSourceValue[1])
    stamper.stampCurrentSource(@nodes[3], @nodes[4], @curSourceValue[2])

  startIteration: ->
    @voltdiff[0] = @volts[0] - @volts[1]
    @voltdiff[1] = @volts[2] - @volts[3]
    @voltdiff[2] = @volts[3] - @volts[4]

    for i in [0...3]
      @curSourceValue[i] = @current[i]
      for j in [0...3]
        @curSourceValue[i] = @a[i*3 + j] * @voltdiff[j]

  calculateCurrent: ->
    @voltdiff[0] = @volts[0] - @volts[1]
    @voltdiff[1] = @volts[2] - @volts[3]
    @voltdiff[2] = @volts[3] - @volts[4]

    for i in [0...3]
      @current[i] = @curSourceValue[i]
      for j in [0...3]
        @current[i] += @a[i * 3 + j] * @voltdiff[j]

  getConnection: (n1, n2) ->
    if Util.comparePair(n1, n2, 0, 1)
      return true
    if Util.comparePair(n1, n2, 2, 3)
      return true
    if Util.comparePair(n1, n2, 3, 4)
      return true
    if Util.comparePair(n1, n2, 2, 4)
      return true

    return false

module.exports = TappedTransformerElm
