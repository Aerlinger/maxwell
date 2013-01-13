# <DEFINE>
define([
], (
) ->
# </DEFINE>


#Inductor.FLAG_BACK_EULER = 2;
Diode = ->
  @nodes = new Array(2)
  @vt = 0
  @vdcoef = 0
  @fwdrop = 0
  @zvoltage = 0
  @zoffset = 0
  @lastvoltdiff = 0
  @crit = 0
Diode::leakage = 1e-14
Diode::setup = (fw, zv) ->
  @fwdrop = fw
  @zvoltage = zv
  @vdcoef = Math.log(1 / @leakage + 1) / @fwdrop
  @vt = 1 / @vdcoef
  
  # critical voltage for limiting; current is vt/sqrt(2) at
  # this voltage
  @vcrit = @vt * Math.log(@vt / (Math.sqrt(2) * @leakage))
  unless @zvoltage is 0
    
    # calculate offset which will give us 5mA at zvoltage
    i = -.005
    @zoffset = @zvoltage - Math.log(-(1 + i / @leakage)) / @vdcoef

Diode::reset = ->
  @lastvoltdiff = 0

Diode::limitStep = (vnew, vold) ->
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
    Circuit.converged = false
  
  #console.log(vnew + " " + oo + " " + vold);
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
        
        #console.log(oo + " " + vnew);
        else
          vnew = @vcrit
      else
        vnew = @vt * Math.log(vnew / @vt)
      Circuit.converged = false
    vnew = -(vnew + @zoffset)
  vnew

Diode::stamp = (n0, n1) ->
  @nodes[0] = n0
  @nodes[1] = n1
  Circuit.stampNonLinear @nodes[0]
  Circuit.stampNonLinear @nodes[1]

Diode::doStep = (voltdiff) ->
  
  # used to have .1 here, but needed .01 for peak detector
  Circuit.converged = false  if Math.abs(voltdiff - Circuit.lastvoltdiff) > .01
  voltdiff = @limitStep(voltdiff, Circuit.lastvoltdiff)
  Circuit.lastvoltdiff = voltdiff
  if voltdiff >= 0 or @zvoltage is 0
    
    # regular diode or forward-biased zener
    eval_ = Math.exp(voltdiff * @vdcoef)
    
    # make diode linear with negative voltages; aids convergence
    eval_ = 1  if voltdiff < 0
    geq = @vdcoef * @leakage * eval_
    nc = (eval_ - 1) * @leakage - geq * voltdiff
    Circuit.stampConductance @nodes[0], @nodes[1], geq
    Circuit.stampCurrentSource @nodes[0], @nodes[1], nc
  else
    
    # Zener diode
    
    #
    #         * I(Vd) = Is * (exp[Vd*C] - exp[(-Vd-Vz)*C] - 1 )
    #         *
    #         * geq is I'(Vd)
    #         * nc is I(Vd) + I'(Vd)*(-Vd)
    #         
    geq = @leakage * @vdcoef * (Math.exp(voltdiff * @vdcoef) + Math.exp((-voltdiff - @zoffset) * @vdcoef))
    nc = @leakage * (Math.exp(voltdiff * @vdcoef) - Math.exp((-voltdiff - @zoffset) * @vdcoef) - 1) + geq * (-voltdiff)
    Circuit.stampConductance @nodes[0], @nodes[1], geq
    Circuit.stampCurrentSource @nodes[0], @nodes[1], nc

Diode::calculateCurrent = (voltdiff) ->
  return @leakage * (Math.exp(voltdiff * @vdcoef) - 1)  if voltdiff >= 0 or @zvoltage is 0
  @leakage * (Math.exp(voltdiff * @vdcoef) - Math.exp((-voltdiff - @zoffset) * @vdcoef) - 1)
