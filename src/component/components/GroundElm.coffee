# Step 2: Prototype of DepthRectangle is Rectangle

# Step 3: Now we need to set the constructor to the DepthRectangle instead of Rectangle
GroundElm = (xa, ya, xb, yb, f, st) ->
  CircuitElement.call this, xa, ya, xb, yb, f, st
GroundElm:: = new CircuitElement()
GroundElm::constructor = GroundElm
GroundElm::getDumpType = ->
  "g"

GroundElm::getPostCount = ->
  1

GroundElm::draw = ->
  color = @setVoltageColor(0)
  @doDots()
  CircuitElement.drawThickLinePt @point1, @point2, color
  i = undefined
  i = 0
  while i < 3
    a = 10 - i * 4
    b = i * 5 # -10;
    CircuitElement.interpPoint2 @point1, @point2, CircuitElement.ps1, CircuitElement.ps2, 1 + b / @dn, a
    CircuitElement.drawThickLinePt CircuitElement.ps1, CircuitElement.ps2, color
    i++
  CircuitElement.interpPoint @point1, @point2, CircuitElement.ps2, 1 + 11. / @dn
  @setBboxPt @point1, CircuitElement.ps2, 11
  @drawPost @x1, @y, @nodes[0]

GroundElm::setCurrent = (x, c) ->
  @current = -c

GroundElm::stamp = ->
  Circuit.stampVoltageSource 0, @nodes[0], @voltSource, 0

GroundElm::getVoltageDiff = ->
  0

GroundElm::getVoltageSourceCount = ->
  1

GroundElm::getInfo = (arr) ->
  arr[0] = "ground"
  arr[1] = "I = " + CircuitElement.getCurrentText(@getCurrent())

GroundElm::hasGroundConnection = (n1) ->
  true

GroundElm::needsShortcut = ->
  true

GroundElm::toString = ->
  "GroundElm"
