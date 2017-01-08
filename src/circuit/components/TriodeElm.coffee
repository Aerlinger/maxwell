CircuitComponent = require("../circuitComponent.js")
Util = require('../../util/util.coffee')

class TriodeElm extends CircuitComponent
  @Fields = {
    mu: {
      name: ""
      data_type: parseFloat
    }
    kg1: {
      name: ""
      data_type: parseFloat
    }
  }


  constructor: (xa, xb, ya, yb, params, f) ->
    @gridCurrentR = 6000

    super(xa, xb, ya, yb, params, f)

    @setup()

  setup: ->
    @noDiagonal = true

  nonLinear: ->
    true

  reset: ->
    @volts[0] = 0
    @volts[1] = 0
    @volts[2] = 0
    @curcount = 0

  getDumpType: ->
    '173'

  getPost: (n) ->
    if n == 0
      @plate[0]
    else
      if n == 1
        @grid[0]
      else
        @cath[0]

  getPostCount: ->
    3

  nonLinear: ->
    true

  getPower: ->
    (@volts[0] - @volts[2]) * @current

  setPoints: ->
    super

    @plate = new Array(4)
    @grid = new Array(8)
    @cath = new Array(4)

    @grid[0] = @point1

    nearw = 8
    farw = 32
    platew = 18

    @plate[1] = Util.interpolate(@point1, @point2, 1, nearw)
    @plate[0] = Util.interpolate(@point1, @point2, 1, farw)
    [@plate[2], @plate[3]] = Util.interpolateSymmetrical(@point2, @plate[1], 1, platew)

    circler = 24
    @grid[1] = Util.interpolate(@point1, @point2, (@dn() - circler) / @dn(), 0)

    for i in [0...3]
      @grid[2 + i * 2] = Util.interpolate(@grid[1], @point2, (i * 3 + 1) / 4.5, 0)
      @grid[3 + i * 2] = Util.interpolate(@grid[1], @point2, (i * 3 + 2) / 4.5, 0)

    @midgrid = @point2

    cathw = 16
    @midcath = Util.interpolate(@point1, @point2, 1, -nearw)

    [@cath[1], @cath[2]] = Util.interpolateSymmetrical(@point2, @plate[1], -1, cathw)
    @cath[3] = Util.interpolate(@point2, @plate[1], -1.2, -cathw)
    @cath[0] = Util.interpolate(@point2, @plate[1], Math.floor(-farw / nearw), cathw)

  stamp: (stamper) ->
    stamper.stampNonLinear(@nodes[0])
    stamper.stampNonLinear(@nodes[1])
    stamper.stampNonLinear(@nodes[2])

  getConnection: (n1, n2) ->
    !((n1 == 1) || (n2 == 1))

  doStep: (stamper) ->
    vs = new Array(3)

    vs[0] = @volts[0]
    vs[1] = @volts[1]
    vs[2] = @volts[2]

    if (vs[1] > @lastv1 + 0.5)
      vs[1] = @lastv1 + 0.5
    if (vs[1] < @lastv1 - 0.5)
      vs[1] = @lastv1 - 0.5
    if (vs[2] > @lastv2 + 0.5)
      vs[2] = @lastv2 + 0.5
    if (vs[2] < @lastv2 - 0.5)
      vs[2] = @lastv2 - 0.5

    grid = 1
    cath = 2
    plate = 0

    vgk = vs[grid] - vs[cath]
    vpk = vs[plate] - vs[cath]

    if (Math.abs(@lastv0 - vs[0]) > .01 || Math.abs(@lastv1 - vs[1]) > .01 || Math.abs(@lastv2 - vs[2]) > .01)
      @getParentCircuit().Solver.converged = false

    @lastv0 = vs[0]
    @lastv1 = vs[1]
    @lastv2 = vs[2]

    ids = 0
    gm = 0
    Gds = 0
    ival = vgk + vpk / @mu

    @currentg = 0

    if (vgk > .01)
      stamper.stampResistor(@nodes[grid], @nodes[cath], @gridCurrentR)
      @currentg = vgk / @gridCurrentR

    if (ival < 0)
      Gds = 1e-8
      ids = vpk * Gds
    else
      ids = Math.pow(ival, 1.5) / @kg1
      q = 1.5 * Math.sqrt(ival) / @kg1
      # gm = dids/dgk
      # Gds = dids/dpk
      Gds = q
      gm = q / @mu

    @currentp = ids
    @currentc = ids + @currentg
    
    rs = -ids + Gds * vpk + gm * vgk
    
    stamper.stampMatrix(@nodes[plate], @nodes[plate], Gds)
    stamper.stampMatrix(@nodes[plate], @nodes[cath], -Gds - gm)
    stamper.stampMatrix(@nodes[plate], @nodes[grid], gm)

    stamper.stampMatrix(@nodes[cath], @nodes[plate], -Gds)
    stamper.stampMatrix(@nodes[cath], @nodes[cath], Gds + gm)
    stamper.stampMatrix(@nodes[cath], @nodes[grid], -gm)

    stamper.stampRightSide(@nodes[plate], rs)
    stamper.stampRightSide(@nodes[cath], -rs)

module.exports = TriodeElm
