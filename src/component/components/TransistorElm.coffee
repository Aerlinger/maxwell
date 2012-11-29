
# Step 1: Prototype of DepthRectangle is Rectangle

# Step 2: Now we need to set the constructor to the DepthRectangle instead of Rectangle

#TODO: Fully test transistor
TransistorElm = (xa, ya, xb, yb, f, st) ->
  CircuitElement.call this, xa, ya, xb, yb, f
  
  # Forward declarations:
  @beta = 100
  @rect = [] # Array of points
  @coll = [] # Array of points
  @emit = [] # Array of points
  @base = new Point() # Single point
  @pnp = 0
  @fgain = 0
  @gmin = 0
  @ie = 0
  @ic = 0
  @ib = 0
  @curcount_c = 0
  @curcount_e = 0
  @curcount_b = 0
  @rectPoly = 0
  @arrowPoly = 0
  @vt = .025
  @vdcoef = 1 / @vt
  @rgain = .5
  @vcrit = 0
  @lastvbc = 0
  @lastvbe = 0
  @leakage = 1e-13
  if st and st.length > 0
    st = st.split(" ")  if typeof st is "string"
    pnp = st.shift()
    @pnp = parseInt(pnp)  if pnp
    lastvbe = st.shift()
    @lastvbe = parseFloat(lastvbe)  if lastvbe
    lastvbc = st.shift()
    @lastvbc = parseFloat(lastvbc)  if lastvbc
    beta = st.shift()
    @beta = parseFloat(beta)  if beta
  @volts[0] = 0
  @volts[1] = -@lastvbe
  @volts[2] = -@lastvbc
  @setup()
TransistorElm.FLAG_FLIP = 1
TransistorElm:: = new CircuitElement()
TransistorElm::constructor = TransistorElm
TransistorElm::setup = ->
  @vcrit = @vt * Math.log(@vt / (Math.sqrt(2) * @leakage))
  @fgain = @beta / (@beta + 1)
  @noDiagonal = true

TransistorElm::nonLinear = ->
  true

TransistorElm::reset = ->
  @volts[0] = @volts[1] = @volts[2] = 0
  @lastvbc = @lastvbe = @curcount_c = @curcount_e = @curcount_b = 0

TransistorElm::getDumpType = ->
  "t"

TransistorElm::dump = ->
  CircuitElement::dump.call(this) + " " + @pnp + " " + (@volts[0] - @volts[1]) + " " + (@volts[0] - @volts[2]) + " " + @beta

TransistorElm::draw = ->
  @setBboxPt @point1, @point2, 16
  @setPowerColor true
  
  # draw collector
  color = @setVoltageColor(@volts[1])
  CircuitElement.drawThickLinePt @coll[0], @coll[1], color
  
  # draw emitter
  color = @setVoltageColor(@volts[2])
  CircuitElement.drawThickLinePt @emit[0], @emit[1], color
  
  # draw arrow
  #g.setColor(lightGrayColor);
  CircuitElement.drawThickPolygonP @arrowPoly, Color.CYAN
  
  # draw base
  color = @setVoltageColor(@volts[0])
  g.setColor Color.gray  if Circuit.powerCheckItem
  CircuitElement.drawThickLinePt @point1, @base, color
  
  # draw dots
  @curcount_b = @updateDotCount(-@ib, @curcount_b)
  @drawDots @base, @point1, @curcount_b
  @curcount_c = @updateDotCount(-@ic, @curcount_c)
  @drawDots @coll[1], @coll[0], @curcount_c
  @curcount_e = @updateDotCount(-@ie, @curcount_e)
  @drawDots @emit[1], @emit[0], @curcount_e
  
  # draw base rectangle
  color = @setVoltageColor(@volts[0])
  @setPowerColor true
  
  #g.fillPolygon(rectPoly);
  CircuitElement.drawThickPolygonP @rectPoly, color
  if (@needsHighlight() or Circuit.dragElm is this) and @dy is 0
    
    #g.setColor(Color.white);
    #g.setFont(this.unitsFont);
    CircuitElement.setColor Color.white
    ds = sign(@dx)
    @drawCenteredText "B", @base.x1 - 10 * ds, @base.y - 5, Color.WHITE
    @drawCenteredText "C", @coll[0].x1 - 3 + 9 * ds, @coll[0].y + 4, Color.WHITE # x+6 if ds=1, -12 if -1
    @drawCenteredText "E", @emit[0].x1 - 3 + 9 * ds, @emit[0].y + 4, Color.WHITE
  @drawPosts()

TransistorElm::getPost = (n) ->
  (if (n is 0) then @point1 else (if (n is 1) then @coll[0] else @emit[0]))

TransistorElm::getPostCount = ->
  3

TransistorElm::getPower = ->
  (@volts[0] - @volts[2]) * @ib + (@volts[1] - @volts[2]) * @ic

TransistorElm::setPoints = ->
  CircuitElement::setPoints.call this
  hs = 16
  @dsign = -@dsign  unless (@flags & TransistorElm.FLAG_FLIP) is 0
  hs2 = hs * @dsign * @pnp
  
  # calc collector, emitter posts
  @coll = CircuitElement.newPointArray(2)
  @emit = CircuitElement.newPointArray(2)
  CircuitElement.interpPoint2 @point1, @point2, @coll[0], @emit[0], 1, hs2
  
  # calc rectangle edges
  @rect = CircuitElement.newPointArray(4)
  CircuitElement.interpPoint2 @point1, @point2, @rect[0], @rect[1], 1 - 16 / @dn, hs
  CircuitElement.interpPoint2 @point1, @point2, @rect[2], @rect[3], 1 - 13 / @dn, hs
  
  # calc points where collector/emitter leads contact rectangle
  CircuitElement.interpPoint2 @point1, @point2, @coll[1], @emit[1], 1 - 13 / @dn, 6 * @dsign * @pnp
  
  # calc point where base lead contacts rectangle
  @base = new Point()
  CircuitElement.interpPoint @point1, @point2, @base, 1 - 16 / @dn
  
  # rectangle
  @rectPoly = CircuitElement.createPolygon(@rect[0], @rect[2], @rect[3], @rect[1])
  
  # arrow
  unless @pnp is 1
    pt = CircuitElement.interpPoint(@point1, @point2, 1 - 11 / @dn, -5 * @dsign * @pnp)
    @arrowPoly = CircuitElement.calcArrow(@emit[0], pt, 8, 4)

TransistorElm::limitStep = (vnew, vold) ->
  arg = undefined
  oo = vnew
  if vnew > @vcrit and Math.abs(vnew - vold) > (@vt + @vt)
    if vold > 0
      arg = 1 + (vnew - vold) / @vt
      if arg > 0
        vnew = vold + @vt * Math.log(arg)
      else
        vnew = @vcrit
    else
      vnew = @vt * Math.log(vnew / @vt)
    Circuit.converged = false
  
  #console.log(vnew + " " + oo + " " + vold);
  vnew

TransistorElm::stamp = ->
  Circuit.stampNonLinear @nodes[0]
  Circuit.stampNonLinear @nodes[1]
  Circuit.stampNonLinear @nodes[2]

TransistorElm::doStep = ->
  vbc = @volts[0] - @volts[1] # typically negative
  vbe = @volts[0] - @volts[2] # typically positive
  # .01
  Circuit.converged = false  if Math.abs(vbc - @lastvbc) > .01 or Math.abs(vbe - @lastvbe) > .01
  @gmin = 0
  if Circuit.subIterations > 100
    
    # if we have trouble converging, put a conductance in parallel with all P-N junctions.
    # Gradually increase the conductance value for each iteration.
    @gmin = Math.exp(-9 * Math.log(10) * (1 - Circuit.subIterations / 3000.))
    @gmin = .1  if @gmin > .1
  
  #console.log("T " + vbc + " " + vbe + "\n");
  vbc = @pnp * @limitStep(@pnp * vbc, @pnp * @lastvbc)
  vbe = @pnp * @limitStep(@pnp * vbe, @pnp * @lastvbe)
  @lastvbc = vbc
  @lastvbe = vbe
  pcoef = @vdcoef * @pnp
  expbc = Math.exp(vbc * pcoef)
  
  #if (expbc > 1e13 || Double.isInfinite(expbc))
  #     expbc = 1e13;
  expbe = Math.exp(vbe * pcoef)
  expbe = 1  if expbe < 1
  
  #if (expbe > 1e13 || Double.isInfinite(expbe))
  #     expbe = 1e13;
  @ie = @pnp * @leakage * (-(expbe - 1) + @rgain * (expbc - 1))
  @ic = @pnp * @leakage * (@fgain * (expbe - 1) - (expbc - 1))
  @ib = -(@ie + @ic)
  
  #console.log("gain " + ic/ib);
  #console.log("T " + vbc + " " + vbe + " " + ie + " " + ic + "\n");
  gee = -@leakage * @vdcoef * expbe
  gec = @rgain * @leakage * @vdcoef * expbc
  gce = -gee * @fgain
  gcc = -gec * (1 / @rgain)
  
  #console.log("gee = " + gee + "\n");
  #     console.log("gec = " + gec + "\n");
  #     console.log("gce = " + gce + "\n");
  #     console.log("gcc = " + gcc + "\n");
  #     console.log("gce+gcc = " + (gce+gcc) + "\n");
  #     console.log("gee+gec = " + (gee+gec) + "\n");
  
  # stamps from page 302 of Pillage.  Node 0 is the base, node 1 the collector, node 2 the emitter.  Also stamp
  # minimum conductance (gmin) between b,e and b,c
  Circuit.stampMatrix @nodes[0], @nodes[0], -gee - gec - gce - gcc + @gmin * 2
  Circuit.stampMatrix @nodes[0], @nodes[1], gec + gcc - @gmin
  Circuit.stampMatrix @nodes[0], @nodes[2], gee + gce - @gmin
  Circuit.stampMatrix @nodes[1], @nodes[0], gce + gcc - @gmin
  Circuit.stampMatrix @nodes[1], @nodes[1], -gcc + @gmin
  Circuit.stampMatrix @nodes[1], @nodes[2], -gce
  Circuit.stampMatrix @nodes[2], @nodes[0], gee + gec - @gmin
  Circuit.stampMatrix @nodes[2], @nodes[1], -gec
  Circuit.stampMatrix @nodes[2], @nodes[2], -gee + @gmin
  
  # we are solving for v(k+1), not delta v, so we use formula
  # 10.5.13, multiplying J by v(k)
  Circuit.stampRightSide @nodes[0], -@ib - (gec + gcc) * vbc - (gee + gce) * vbe
  Circuit.stampRightSide @nodes[1], -@ic + gce * vbe + gcc * vbc
  Circuit.stampRightSide @nodes[2], -@ie + gee * vbe + gec * vbc

TransistorElm::getInfo = (arr) ->
  arr[0] = "transistor (" + ((if (@pnp is -1) then "PNP)" else "NPN)")) + " beta=" + showFormat.format(@beta)
  vbc = @volts[0] - @volts[1]
  vbe = @volts[0] - @volts[2]
  vce = @volts[1] - @volts[2]
  if vbc * @pnp > .2
    arr[1] = (if vbe * @pnp > .2 then "saturation" else "reverse active")
  else
    arr[1] = (if vbe * @pnp > .2 then "fwd active" else "cutoff")
  arr[2] = "Ic = " + @getCurrentText(@ic)
  arr[3] = "Ib = " + @getCurrentText(@ib)
  arr[4] = "Vbe = " + @getVoltageText(vbe)
  arr[5] = "Vbc = " + @getVoltageText(vbc)
  arr[6] = "Vce = " + @getVoltageText(vce)

TransistorElm::getScopeValue = (x) ->
  switch x
    when Scope.VAL_IB
      return @ib
    when Scope.VAL_IC
      return @ic
    when Scope.VAL_IE
      return @ie
    when Scope.VAL_VBE
      return @volts[0] - @volts[2]
    when Scope.VAL_VBC
      return @volts[0] - @volts[1]
    when Scope.VAL_VCE
      return @volts[1] - @volts[2]
  0

TransistorElm::getScopeUnits = (x) ->
  switch x
    when Scope.VAL_IB, Scope.VAL_IC
  , Scope.VAL_IE
      "A"
    else
      "V"

TransistorElm::getEditInfo = (n) ->
  return new EditInfo("Beta/hFE", @beta, 10, 1000).setDimensionless()  if n is 0
  if n is 1
    ei = new EditInfo("", 0, -1, -1)
    ei.checkbox = new Checkbox("Swap E/C", (@flags & TransistorElm.FLAG_FLIP) isnt 0)
    return ei
  null

TransistorElm::setEditValue = (n, ei) ->
  if n is 0
    @beta = ei.value
    @setup()
  if n is 1
    if ei.checkbox.getState()
      @flags |= TransistorElm.FLAG_FLIP
    else
      @flags &= ~TransistorElm.FLAG_FLIP
    @setPoints()

TransistorElm::canViewInScope = ->
  true
