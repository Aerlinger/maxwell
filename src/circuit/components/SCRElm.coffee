CircuitComponent = require('../circuitComponent.js')
Settings = require('../../settings/settings.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

# TODO: Extend from Diode?
class ScrElm extends CircuitComponent

  @Fields = {
    lastvac: {
      data_type: parseFloat
    }
    lastvag: {
      data_type: parseFloat
    }
    triggerI: {
      data_type: parseFloat
      default_value: 0.01
    }
    holdingI: {
      data_type: parseFloat
      default_value: 0.0082
    }
    cresistance: {
      data_type: parseFloat
      default_value: 50
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    @anode = 0
    @cnode = 1
    @gnode = 2
    @inode = 3
    @hs = 8

    super(xa, ya, xb, yb, params, f)

    @setDefaults()

    @vt = 0
    @vdcoef = 0
    @fwdrop = 0
    @zvoltage = 0
    @zoffset = 0
    @lastvoltdiff = 0
    @crit = 0
    @leakage = 1e-14

    @volts[@anode] = 0
    @volts[@cnode] = -@lastvac
    @volts[@gnode] = -@lastvag

    @params['volts'] = @volts

    delete @params['lastvac']
    delete @params['lastvag']

    @setup()

  setPoints: ->
    super

    dir = 0
    if (Math.abs(@dx()) > Math.abs(@dy()))
      dir = -Math.sign(@dx()) * Math.sign(@dy())
      @point2.y = @point1.y
    else
      dir = Math.sign(@dy()) * Math.sign(@dx())
      @point2.x = @point1.x

    if (dir == 0)
      dir = 1
    @calcLeads(16)

    @cathode = new Array(2)
    pa = new Array(2)

    [pa[0], pa[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 0, @hs)
    [@cathode[0], @cathode[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 1, @hs)

    @poly = Util.createPolygon(pa[0], pa[1], @lead2)

    @gate = new Array(2)
    leadlen = (@dn() - 16) / 2

    gatelen = Settings.GRID_SIZE
    gatelen += leadlen % Settings.GRID_SIZE

    if (leadlen < gatelen)
      @point2.x = @point1.x
      @point2.y = @point1.y
      return

    @gate[0] = Util.interpolate(@lead2, @point2, gatelen / leadlen, gatelen * dir)
    @gate[1] = Util.interpolate(@lead2, @point2, gatelen / leadlen, Settings.GRID_SIZE * 2 * dir)

  nonLinear: ->
    true

  draw: (renderContext) ->
#    @setBbox(@point1, @point2, @hs)
#    adjustBbox(@gate[0], @gate[1])

    v1 = @volts[@anode]
    v2 = @volts[@cnode]

    renderContext.drawLeads(this)

    color = Util.getVoltageColor(v1);
    renderContext.drawThickPolygonP(@poly, color)

    # draw thing arrow is pointing to
    color = Util.getVoltageColor(v2)
    renderContext.drawLinePt(@cathode[0], @cathode[1], color)

    renderContext.drawLinePt(@lead2, @gate[0], color)
    renderContext.drawLinePt(@gate[0], @gate[1], color)

    @curcount_a = @updateDots(@ia, @curcount_a)
    @curcount_c = @updateDots(@ic, @curcount_c)
    @curcount_g = @updateDots(@ig, @curcount_g)

    renderContext.drawDots(@point1, @lead2, @curcount_a)
    renderContext.drawDots(@point2, @lead2, @curcount_c)
    renderContext.drawDots(@gate[1], @gate[0], @curcount_g)
#    renderContext.drawDots(@gate[0], @lead2, @curcount_g + distance(@gate[1], @gate[0]))

    renderContext.drawPosts(this)

  setDefaults: ->
    @leakage = 1e-14  # Paramter?

    @cresistance = 50
    @holdingI = .0082
    @triggerI = .01

  getName: ->
    "Silicon Controlled Rectifier"

  getDumpType: ->
    177

  setup: ->
    @fwdrop = 0.8   # Parameter?
    @zvoltage = 0   # zvoltage parameter?

    @vdcoef = Math.log(1 / @leakage + 1) / @fwdrop

    @vt = 1 / @vdcoef

    # critical voltage for limiting; current is vt/sqrt(2) at this voltage
    @vcrit = @vt * Math.log(@vt / (Math.sqrt(2) * @leakage))

    if @zvoltage == 0
      @zoffset = 0
    else
      # calculate offset which will give us 5mA at zvoltage
      i = -0.005
      @zoffset = @zvoltage - Math.log(-(1 + i / @leakage)) / @vdcoef

  reset: ->
    @volts[@anode] = @volts[@cnode] = @volts[@gnode] = 0
    @lastvoltdiff = 0
    @lastvag = @lastvac = @curcount_a = @curcount_c = @curcount_g = 0

  getPost: (n)->
    if (n == 0)
      @point1
    else
      if (n == 1)
        @point2
      else
        @gate[1]

  getPostCount: ->
    3

  getInternalNodeCount: ->
    1

  getPower: ->
    (@volts[@anode] - @volts[@gnode]) * @ia + (@volts[@cnode] - @volts[@gnode]) * @ic

  stamp: (stamper) ->
    stamper.stampNonLinear(@nodes[@anode])
    stamper.stampNonLinear(@nodes[@cnode])
    stamper.stampNonLinear(@nodes[@gnode])
    stamper.stampNonLinear(@nodes[@inode])
    stamper.stampResistor(@nodes[@gnode], @nodes[@cnode], @cresistance)

#    @diode.stamp(@nodes[@inode], @nodes[@gnode])
#    @nodes[0] = @nodes[@inode]
#    @nodes[1] = @nodes[@gnode]
    stamper.stampNonLinear @nodes[@inode]
    stamper.stampNonLinear @nodes[@gnode]

  limitStep: (vnew, vold) ->
    arg = undefined
    oo = vnew

    # check new voltage; has current changed by factor of e^2?
    if vnew > @vcrit and Math.abs(vnew - vold) > (@vt + @vt)
      if vold > 0
        arg = 1 + (vnew - vold) / @vt
        if arg > 0
          # adjust vnew so that the current is the same
          # as in linearized model from previous iteration.
          # current at vnew = old current * arg
          vnew = vold + @vt * Math.log(arg)

          # current at v0 = 1uA
          v0 = Math.log(1e-6 / @leakage) * @vt
          vnew = Math.max(v0, vnew)
        else
          vnew = @vcrit
      else
        # adjust vnew so that the current is the same
        # as in linearized model from previous iteration.
        # (1/vt = slope of load line)
        vnew = @vt * Math.log(vnew / @vt)
      @getParentCircuit().Solver.converged = false

    else if vnew < 0 and @zoffset isnt 0
      # for Zener breakdown, use the same logic but translate the values
      vnew = -vnew - @zoffset
      vold = -vold - @zoffset
      if vnew > @vcrit and Math.abs(vnew - vold) > (@vt + @vt)
        if vold > 0
          arg = 1 + (vnew - vold) / @vt
          if arg > 0
            vnew = vold + @vt * Math.log(arg)
            v0 = Math.log(1e-6 / @leakage) * @vt
            vnew = Math.max(v0, vnew)

          else
            vnew = @vcrit
        else
          vnew = @vt * Math.log(vnew / @vt)
        @getParentCircuit().Solver.converged = false
      vnew = -(vnew + @zoffset)
    vnew


  doStep: (stamper) ->
    @vac = @volts[@anode] - @volts[@cnode]
    @vag = @volts[@anode] - @volts[@gnode]

    if (Math.abs(@vac - @lastvac) > .01 || Math.abs(@vag - @lastvag) > 0.01)
      @getParentCircuit().converged = false

    @lastvac = @vac
    @lastvag = @vag

    # diode.doStep(@volts[@inode] - @volts[@gnode])

    voltdiff = @volts[@inode] - @volts[@gnode]

    ## ------------------------------------------------------
    # DIODE BEHAVIOR
    # TODO: DRY WITH DIODE ELM
    ## ------------------------------------------------------

    if Math.abs(voltdiff - @lastvoltdiff) > .01
      @getParentCircuit().Solver.converged = false

    voltdiff = @limitStep(voltdiff, @lastvoltdiff)

    @lastvoltdiff = voltdiff

    if voltdiff >= 0 or @zvoltage is 0
      # regular diode or forward-biased zener
      eval_ = Math.exp(voltdiff * @vdcoef)

      # make diode linear with negative voltages; aids convergence
      eval_ = 1  if voltdiff < 0
      geq = @vdcoef * @leakage * eval_
      nc = (eval_ - 1) * @leakage - geq * voltdiff

      stamper.stampConductance @nodes[@inode], @nodes[@gnode], geq
      stamper.stampCurrentSource @nodes[@inode], @nodes[@gnode], nc
    else
      exp0 = Math.exp(voltdiff * @vdcoef)
      exp1 = Math.exp((-voltdiff - @zoffset) * @vdcoef)

      geq =  @leakage * (exp0 + exp1) * @vdcoef
      nc =   @leakage * (exp0 - exp1 - 1) + geq * -voltdiff

      stamper.stampConductance @nodes[@inode], @nodes[@gnode], geq
      stamper.stampCurrentSource @nodes[@inode], @nodes[@gnode], nc

    ## ------------------------------------------------------
    # END DIODE BEHAVIOR
    ## ------------------------------------------------------


    icmult = 1 / @triggerI
    iamult = 1 / @holdingI - icmult

    @aresistance = if (-icmult * @ic + @ia * iamult > 1) then 0.0105 else 10e5

    stamper.stampResistor(@nodes[@anode], @nodes[@inode], @aresistance)

  calculateCurrent: ->
    @ic = (@volts[@cnode] - @volts[@gnode]) / @cresistance
    @ia = (@volts[@anode] - @volts[@inode]) / @aresistance
    @ig = -@ic - @ia

module.exports = ScrElm