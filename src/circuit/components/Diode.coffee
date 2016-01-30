# Unused!
class Diode
  @leakage = 1e-14
  #Inductor.FLAG_BACK_EULER = 2;

  constructor: (circuit) ->
    @nodes = new Array(2)
    @vt = 0
    @vdcoef = 0
    @fwdrop = 0
    @zvoltage = 0
    @zoffset = 0
    @lastvoltdiff = 0
    @crit = 0
    @circuit = circuit
    @leakage = 1e-14

  setup: (fw, zv) ->
    @fwdrop = fw
    @zvoltage = zv
    @vdcoef = Math.log(1 / @leakage + 1) / @fwdrop
    @vt = 1 / @vdcoef

    # critical voltage for limiting; current is vt/sqrt(2) at this voltage
    @vcrit = @vt * Math.log(@vt / (Math.sqrt(2) * @leakage))

    unless @zvoltage is 0
      # calculate offset which will give us 5mA at zvoltage
      i = -.005
      @zoffset = @zvoltage - Math.log(-(1 + i / @leakage)) / @vdcoef

  reset: ->
    @lastvoltdiff = 0

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
      @circuit.converged = false

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
        @circuit.converged = false
      vnew = -(vnew + @zoffset)
    vnew


  # public
  stamp: (n0, n1, stamper) ->
    @nodes[0] = n0
    @nodes[1] = n1
    stamper.stampNonLinear @nodes[0]
    stamper.stampNonLinear @nodes[1]

  # public
  doStep: (voltdiff, stamper) ->
    # used to have .1 here, but needed .01 for peak detector
    if Math.abs(voltdiff - @lastvoltdiff) > .01
      @circuit.converged = false
    voltdiff = @limitStep(voltdiff, @lastvoltdiff)

    @lastvoltdiff = voltdiff

    if voltdiff >= 0 or @zvoltage is 0
      # regular diode or forward-biased zener
      eval_ = Math.exp(voltdiff * @vdcoef)

      # make diode linear with negative voltages; aids convergence
      eval_ = 1  if voltdiff < 0
      geq = @vdcoef * @leakage * eval_
      nc = (eval_ - 1) * @leakage - geq * voltdiff

      stamper.stampConductance @nodes[0], @nodes[1], geq
      stamper.stampCurrentSource @nodes[0], @nodes[1], nc
    else
      # Zener diode
      #* I(Vd) = Is * (exp[Vd*C] - exp[(-Vd-Vz)*C] - 1 )
      #*
      #* geq is I'(Vd)
      #* nc is I(Vd) + I'(Vd)*(-Vd)
      geq = @leakage * @vdcoef * (Math.exp(voltdiff * @vdcoef) + Math.exp((-voltdiff - @zoffset) * @vdcoef))
      nc = @leakage * (Math.exp(voltdiff * @vdcoef) - Math.exp((-voltdiff - @zoffset) * @vdcoef) - 1) + geq * (-voltdiff)

      stamper.stampConductance @nodes[0], @nodes[1], geq
      stamper.stampCurrentSource @nodes[0], @nodes[1], nc

  calculateCurrent: (voltdiff) ->
    if voltdiff >= 0 or @zvoltage is 0
      return @leakage * (Math.exp(voltdiff * @vdcoef) - 1)

    return @leakage * (Math.exp(voltdiff * @vdcoef) - Math.exp((-voltdiff - @zoffset) * @vdcoef) - 1)

module.exports = Diode
