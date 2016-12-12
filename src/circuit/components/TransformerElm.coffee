CircuitComponent = require('../circuitComponent.coffee')
Util = require('../../util/util.coffee')

class TransformerElm extends CircuitComponent
  @FLAG_BACK_EULER = 2

  @Fields = {
    inductance: {
      name: "Inductance"
      default_value: 1e-3
      data_type: parseFloat
    }
    ratio: {
      name: "Ratio"
      default_value: 1
      data_type: parseFloat
      input_type: "integer"
    }
    # TODO: Name collision
    current0: {
      name: "Current L"
      data_type: parseFloat
      default_value: 1e-3
    }
    current1: {
      name: "Current R"
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
    @width = Math.max(32, Math.abs(yb - ya))

    super(xa, ya, xb, yb, params, f)

    @curcount = 0

    @current = [@current0, @current1]
    @params["current"] = [@current0, @current1]

    delete @params["current0"]
    delete @params["current1"]

    @noDiagonal = true

#    @setPoints()

  isTrapezoidal: ->
    (@flags & TransformerElm.FLAG_BACK_EULER) == 0

  setPoints: ->
    super()

    @point2.y = @point1.y

    @ptEnds = Util.newPointArray(4)
    @ptCoil = Util.newPointArray(4)
    @ptCore = Util.newPointArray(4)

    @ptEnds[0] = @point1
    @ptEnds[1] = @point2

#    console.log("SP: ", @point1, @point2, 0, -@dsign, @width)
    @ptEnds[2] = Util.interpolate(@point1, @point2, 0, -@dsign * @width)
    @ptEnds[3] = Util.interpolate(@point1, @point2, 1, -@dsign * @width)

    ce = 0.5 - 12 / @dn
    cd = 0.5 - 2 / @dn

    i = 0
    while i < 4
      @ptCoil[i]     = Util.interpolate(@ptEnds[i], @ptEnds[i + 1], ce)
      @ptCoil[i + 1] = Util.interpolate(@ptEnds[i], @ptEnds[i + 1], 1 - ce)
      @ptCore[i]     = Util.interpolate(@ptEnds[i], @ptEnds[i + 1], cd)
      @ptCore[i + 1] = Util.interpolate(@ptEnds[i], @ptEnds[i + 1], 1 - cd)

      i += 2

  getPost: (n) ->
    @ptEnds[n]


  #CURRENT: 0.0 0.0 0.0 4.076513432371698E-11
  #CURRENT: 3.8782799757450996E-4 0.0 0.0 4.076513432371698E-11
  #CURRENT: 3.8782799757450996E-4 -4.5613036132278495 0.0 4.076513432371698E-11
  #CURRENT: 3.8782799757450996E-4 -4.5613036132278495 0.0 4.076513432371698E-11

  #CALC CURRENT: 0,0,0,4.967879427950679
  #CALC CURRENT: 0.00038782799757450996,0,0,4.967879427950679
  #CALC CURRENT: 0.00038782799757450996,0.4065758146820641,0,4.967879427950679
  #CALC CURRENT: 0.00038782799757450996,0.4065758146820641,0,4.967879427950679

#  getProperties: ->
#    currentProperties = super()
#    currentProperties['current'] = 0
#    currentProperties

#  getCurrent: ->
#    0

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
    for i in [0...4]
      color = Util.getVoltageColor(@volts[i])

      # console.log(@ptEnds[i], @ptCoil[i], color)
      renderContext.drawLinePt(@ptEnds[i], @ptCoil[i], color)

      renderContext.drawPost(@ptEnds[i], @ptCoil[i], "#33FFEE", "#33FFEE")

    for i in [0...2]
      renderContext.drawCoil(@ptCoil[i], @ptCoil[i + 2], @volts[i], @volts[i + 2], @dsign * (if (i == 1) then -6 else 6))

    for i in [0...2]
      renderContext.drawLinePt(@ptCore[i], @ptCore[i + 2])

      renderContext.drawPost(@ptCore[i], @ptCore[i + 2], "#FFEE33", "#FF33EE")
      #      @curcount[i] = updateDot

    renderContext.drawPosts(this)

    if CircuitComponent.DEBUG
      super(renderContext)


  stamp: (stamper) ->
#    double l1 = inductance;
#    double l2 = inductance * ratio * ratio;
#    double m = couplingCoef * Math.sqrt(l1 * l2);
#    // build inverted matrix
#    double deti = 1 / (l1 * l2 - m * m);
#    double ts = isTrapezoidal() ? sim.timeStep / 2 : sim.timeStep;
#    a1 = l2 * deti * ts; // we multiply dt/2 into a1..a4 here
#    a2 = -m * deti * ts;
#    a3 = -m * deti * ts;
#    a4 = l1 * deti * ts;
#    sim.stampConductance(nodes[0], nodes[2], a1);
#    sim.stampVCCurrentSource(nodes[0], nodes[2], nodes[1], nodes[3], a2);
#    sim.stampVCCurrentSource(nodes[1], nodes[3], nodes[0], nodes[2], a3);
#    sim.stampConductance(nodes[1], nodes[3], a4);
#    sim.stampRightSide(nodes[0]);
#    sim.stampRightSide(nodes[1]);
#    sim.stampRightSide(nodes[2]);
#    sim.stampRightSide(nodes[3]);

    l1 = @inductance
    l2 = @inductance * @ratio * @ratio

    #    deti = 1 / (l1 * l2 - m * m);
    m = @couplingCoef  * Math.sqrt(l1 * l2)

    deti = 1.0 / (l1 * l2 - m * m)

    if @isTrapezoidal()
      ts = @getParentCircuit().timeStep() / 2
    else
      ts = @getParentCircuit().timeStep()

    #console.log("STAMP li: #{l1} l2: #{l2} deti #{deti} ts: #{ts} ratio: #{@ratio} m: #{m}")
    @a1 = l2 * deti * ts
    @a2 = -m * deti * ts
    @a3 = -m * deti * ts
    @a4 = l1 * deti * ts
#    console.log("STAMP", @a1, @a2, @a3, @a4)

    stamper.stampConductance(@nodes[0], @nodes[2], @a1)
    stamper.stampVCCurrentSource(@nodes[0], @nodes[2], @nodes[1], @nodes[3], @a2)
    stamper.stampVCCurrentSource(@nodes[1], @nodes[3], @nodes[0], @nodes[2], @a3)
    stamper.stampConductance(@nodes[1], @nodes[3], @a4)

#    console.log(@nodes)
    stamper.stampRightSide(@nodes[0])
    stamper.stampRightSide(@nodes[1])
    stamper.stampRightSide(@nodes[2])
    stamper.stampRightSide(@nodes[3])

  calculateCurrent: ->
#    console.log("CALC CURRENT (volts): #{@volts} #{@curSourceValue1} #{@curSourceValue2}")

    voltdiff1 = @volts[0] - @volts[2]
    voltdiff2 = @volts[1] - @volts[3]
    @current[0] = voltdiff1 * @a1 + voltdiff2 * @a2 + @curSourceValue1
    @current[1] = voltdiff1 * @a3 + voltdiff2 * @a4 + @curSourceValue2

#  setNode: (j, k) ->
#    super()
#    if j==3
#      console.log("K = #{k}")
#      console.trace()

  doStep: (stamper) ->
#    console.log("DO STEP", @curSourceValue1, @curSourceValue2, @isTrapezoidal())
#    console.log(@nodes)
    stamper.stampCurrentSource(@nodes[0], @nodes[2], @curSourceValue1)
    stamper.stampCurrentSource(@nodes[1], @nodes[3], @curSourceValue2)

#    console.log(@Circuit.Solver.circuitRightSide)

  startIteration: ->

    #    double voltdiff1 = volts[0] - volts[2];
    #    double voltdiff2 = volts[1] - volts[3];
    #    if (isTrapezoidal()) {
    #    curSourceValue1 = voltdiff1 * a1 + voltdiff2 * a2 + current[0];
    #      curSourceValue2 = voltdiff1 * a3 + voltdiff2 * a4 + current[1];
    #    } else {
    #  curSourceValue1 = current[0];
    #    curSourceValue2 = current[1];
    #    }

    voltdiff1 = @volts[0] - @volts[2]
    voltdiff2 = @volts[1] - @volts[3]

    if @isTrapezoidal()
      @curSourceValue1 = voltdiff1 * @a1 + voltdiff2 * @a2 + @current[0]
      @curSourceValue2 = voltdiff1 * @a3 + voltdiff2 * @a4 + @current[1]
    else
      @curSourceValue1 = @current[0]
      @curSourceValue2 = @current[1]

#    console.log("START ITERATION ", voltdiff1, voltdiff2, @curSourceValue1, @curSourceValue2)

  getConnection: (n1, n2) ->
    if Util.comparePair(n1, n2, 0, 2)
      return true

    if Util.comparePair(n1, n2, 1, 3)
      return true

    return false


module.exports = TransformerElm
