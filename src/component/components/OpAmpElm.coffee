OpAmpElm = (xa, ya, xb, yb, f, st) ->
  CircuitElement.call this, xa, ya, xb, yb, f
  @opsize = 0
  @opheight = 0
  @opwidth = 0
  @opaddtext = 0
  @maxOut = 0
  @minOut = 0
  @nOut = 0
  @gain = 1e6
  @gbw = 0
  @reset = false
  @in1p = []
  @in2p = []
  @textp = []
  @triangle
  
  #Font plusFont;
  @maxOut = 15
  @minOut = -15
  
  # GBW has no effect in this version of the simulator, but we retain it to keep the file format the same
  @gbw = 1e6
  if st and st.length > 0
    st = st.split(" ")  if typeof st is "string"
    try
      @maxOut = parseFloat(st[0])
      @minOut = parseFloat(st[1])
      @gbw = parseFloat(st[2])
  @noDiagonal = true
  @setSize (if (f & OpAmpElm.FLAG_SMALL) isnt 0 then 1 else 2)
  @setGain()
OpAmpElm:: = new CircuitElement()
OpAmpElm::constructor = OpAmpElm
OpAmpElm.FLAG_SWAP = 1
OpAmpElm.FLAG_SMALL = 2
OpAmpElm.FLAG_LOWGAIN = 4
OpAmpElm::lastvd = 0
OpAmpElm::setGain = ->
  
  # gain of 100000 breaks e-amp-dfdx.txt
  # gain was 1000, but it broke amp-schmitt.txt
  @gain = (if ((@flags & OpAmpElm.FLAG_LOWGAIN) isnt 0) then 1000 else 100000)

OpAmpElm::dump = ->
  CircuitElement::dump.call(this) + " " + @maxOut + " " + @minOut + " " + @gbw

OpAmpElm::nonLinear = ->
  true

OpAmpElm::draw = ->
  @setBboxPt @point1, @point2, @opheight * 2
  color = @setVoltageColor(@volts[0])
  CircuitElement.drawThickLinePt @in1p[0], @in1p[1], color
  color = @setVoltageColor(@volts[1])
  CircuitElement.drawThickLinePt @in2p[0], @in2p[1], color
  
  #g.setColor(this.needsHighlight() ? this.selectColor : this.lightGrayColor);
  @setPowerColor true
  CircuitElement.drawThickPolygonP @triangle, (if @needsHighlight() then CircuitElement.selectColor else CircuitElement.lightGrayColor)
  
  #g.setFont(plusFont);
  
  #this.drawCenteredText("-", this.textp[0].x + 3, this.textp[0].y + 8, true).attr({'font-weight':'bold', 'font-size':17});
  #this.drawCenteredText("+", this.textp[1].x + 3, this.textp[1].y + 10, true).attr({'font-weight':'bold', 'font-size':14});
  color = @setVoltageColor(@volts[2])
  CircuitElement.drawThickLinePt @lead2, @point2, color
  @curcount = @updateDotCount(@current, @curcount)
  @drawDots @point2, @lead2, @curcount
  @drawPosts()

OpAmpElm::getPower = ->
  @volts[2] * @current

OpAmpElm::setSize = (s) ->
  @opsize = s
  @opheight = 8 * s
  @opwidth = 13 * s
  @flags = (@flags & ~OpAmpElm.FLAG_SMALL) | ((if (s is 1) then OpAmpElm.FLAG_SMALL else 0))

OpAmpElm::setPoints = ->
  CircuitElement::setPoints.call this
  @setSize 2  if @dn > 150 and this is Circuit.dragElm
  ww = Math.floor(@opwidth)
  ww = Math.floor(@dn / 2)  if ww > @dn / 2
  @calcLeads ww * 2
  hs = Math.floor(@opheight * @dsign)
  hs = -hs  unless (@flags & OpAmpElm.FLAG_SWAP) is 0
  @in1p = CircuitElement.newPointArray(2)
  @in2p = CircuitElement.newPointArray(2)
  @textp = CircuitElement.newPointArray(2)
  CircuitElement.interpPoint2 @point1, @point2, @in1p[0], @in2p[0], 0, hs
  CircuitElement.interpPoint2 @lead1, @lead2, @in1p[1], @in2p[1], 0, hs
  CircuitElement.interpPoint2 @lead1, @lead2, @textp[0], @textp[1], .2, hs
  tris = CircuitElement.newPointArray(2)
  CircuitElement.interpPoint2 @lead1, @lead2, tris[0], tris[1], 0, hs * 2
  @triangle = CircuitElement.createPolygon(tris[0], tris[1], @lead2)


#this.plusFont = new Font("SansSerif", 0, opsize == 2 ? 14 : 10);
OpAmpElm::getPostCount = ->
  3

OpAmpElm::getPost = (n) ->
  (if (n is 0) then @in1p[0] else (if (n is 1) then @in2p[0] else @point2))

OpAmpElm::getVoltageSourceCount = ->
  1

OpAmpElm::getInfo = (arr) ->
  arr[0] = "op-amp"
  arr[1] = "V+ = " + CircuitElement.getVoltageText(@volts[1])
  arr[2] = "V- = " + CircuitElement.getVoltageText(@volts[0])
  
  # sometimes the voltage goes slightly outside range, to make convergence easier.  so we hide that here.
  vo = Math.max(Math.min(@volts[2], @maxOut), @minOut)
  arr[3] = "Vout = " + CircuitElement.getVoltageText(vo)
  arr[4] = "Iout = " + CircuitElement.getCurrentText(@getCurrent())
  arr[5] = "range = " + CircuitElement.getVoltageText(@minOut) + " to " + CircuitElement.getVoltageText(@maxOut)

OpAmpElm::stamp = ->
  vn = Circuit.nodeList.length + @voltSource
  Circuit.stampNonLinear vn
  Circuit.stampMatrix @nodes[2], vn, 1

OpAmpElm::doStep = ->
  vd = @volts[1] - @volts[0]
  if Math.abs(@lastvd - vd) > .1
    Circuit.converged = false
  else Circuit.converged = false  if @volts[2] > @maxOut + .1 or @volts[2] < @minOut - .1
  x = 0
  vn = Circuit.nodeList.length + @voltSource
  dx = 0
  if vd >= @maxOut / @gain and (@lastvd >= 0 or getRand(4) is 1)
    dx = 1e-4
    x = @maxOut - dx * @maxOut / @gain
  else if vd <= @minOut / @gain and (@lastvd <= 0 or getRand(4) is 1)
    dx = 1e-4
    x = @minOut - dx * @minOut / @gain
  else
    dx = @gain
  
  #console.log("opamp " + vd + " " + volts[2] + " " + dx + " "  + x + " " + lastvd + " " + sim.converged);
  
  # newton's method:
  Circuit.stampMatrix vn, @nodes[0], dx
  Circuit.stampMatrix vn, @nodes[1], -dx
  Circuit.stampMatrix vn, @nodes[2], 1
  Circuit.stampRightSide vn, x
  @lastvd = vd


#if (sim.converged)
#     console.log((volts[1]-volts[0]) + " " + volts[2] + " " + initvd);

# there is no current path through the op-amp inputs, but there is an indirect path through the output to ground.
OpAmpElm::getConnection = (n1, n2) ->
  false

OpAmpElm::hasGroundConnection = (n1) ->
  n1 is 2

OpAmpElm::getVoltageDiff = ->
  @volts[2] - @volts[1]

OpAmpElm::getDumpType = ->
  "a"

OpAmpElm::getEditInfo = (n) ->
  return new EditInfo("Max Output (V)", @maxOut, 1, 20)  if n is 0
  return new EditInfo("Min Output (V)", @minOut, -20, 0)  if n is 1
  null

OpAmpElm::setEditValue = (n, ei) ->
  @maxOut = ei.value  if n is 0
  @minOut = ei.value  if n is 1
