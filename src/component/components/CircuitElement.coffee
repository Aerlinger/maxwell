# static members /////////////////////////////////////////////////
#showFormat:flash.globalization.NumberFormatter;
#flash.globalization.NumberFormatter;
#noCommaFormat:flash.globalization.NumberFormatter;

# non-static Member variables

# Constructor //////////////////////////////////////////////////////
CircuitElement = (xa, ya, xb, yb, f, st) ->
  
  #TODO: Needs to be moved to sim
  #Cir.initClass();
  @boundingBox = new Rectangle(0, 0, Math.abs(xa - xb), Math.abs(ya - yb))
  @x1 = Circuit.snapGrid(xa) - 90
  @y = Circuit.snapGrid(ya) - 60
  @x2 = ((if isNaN(xb) then @x1 else Circuit.snapGrid(xb))) - 90
  @y2 = ((if isNaN(yb) then @y else Circuit.snapGrid(yb))) - 60
  @flags = (if isNaN(f) then @getDefaultFlags() else f)
  CircuitElement.lightGrayColor = Settings.LIGHT_GREY
  CircuitElement.selectColor = Settings.SELECT_COLOR
  CircuitElement.whiteColor = Color.WHITE
  @allocNodes()
  @initBoundingBox()
CircuitElement.voltageRange = 5
CircuitElement.colorScaleCount = 32
CircuitElement.colorScale = []
CircuitElement.unitsFont = "Arial, Helvetica, sans-serif"
CircuitElement.currentMult = 0
CircuitElement.powerMult = 10
CircuitElement.ps1 = new Point(50, 0)
CircuitElement.ps2 = new Point(50, 0)
CircuitElement.whiteColor = Color.WHITE
CircuitElement.selectColor = Color.ORANGE
CircuitElement.drawColor = "#FFFFFF"
CircuitElement.lightGreyColor = 0
CircuitElement.showFormat = 0
CircuitElement.shortFormat = 0
CircuitElement.noCommaFormat = 0
CircuitElement::x1 = 0
CircuitElement::y = 0
CircuitElement::x2 = 0
CircuitElement::y2 = 0
CircuitElement::flags = 0
CircuitElement::voltSource = 0
CircuitElement::nodes = []
CircuitElement::dx = 0
CircuitElement::dy = 0
CircuitElement::dsign = 0
CircuitElement::dn = 0
CircuitElement::dpx1 = 0
CircuitElement::dpy1 = 0
CircuitElement::point1 = new Point(50, 100)
CircuitElement::point2 = new Point(50, 150)
CircuitElement::lead1 = new Point(0, 100)
CircuitElement::lead2 = new Point(0, 150)
CircuitElement::volts = [0, 0]
CircuitElement::current = 0
CircuitElement::curcount = 0
CircuitElement::boundingBox
CircuitElement::noDiagonal = false
CircuitElement::selected = false
CircuitElement.setColor = (color) ->
  if typeof (color) is "string"
    CircuitElement.drawColor = color
  else
    CircuitElement.drawColor = Color.color2HexString(color)


#/////////////////////////////////////////////////////////////////////
# Methods to be overridden by children: //////////////////////////////
CircuitElement::setPoints = ->
  @dx = @x2 - @x1
  @dy = @y2 - @y
  @dn = Math.sqrt(@dx * @dx + @dy * @dy)
  @dpx1 = @dy / @dn
  @dpy1 = -@dx / @dn
  @dsign = (if (@dy is 0) then sign(@dx) else sign(@dy))
  @point1 = new Point(@x1, @y)
  @point2 = new Point(@x2, @y2)

CircuitElement::getDumpType = ->
  0


# END: Methods to be overridden by children: /////////////////////////
#/////////////////////////////////////////////////////////////////////
CircuitElement::getDumpClass = ->


# TODO: Return class name
CircuitElement::toString = ->
  "Circuit Element"

CircuitElement::isSelected = ->
  Circuit.selected

CircuitElement.initClass = ->
  CircuitElement.unitsFont = "Arial, Helvetica, sans-serif"
  
  #	var t = r.text(100, 100, 'test');
  #	t.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif" });
  CircuitElement.colorScale = new Array(CircuitElement.colorScaleCount)
  i = 0

  while i < CircuitElement.colorScaleCount
    v = i * 2 / CircuitElement.colorScaleCount - 1
    if v < 0
      n1 = Math.floor((128 * -v) + 127)
      n2 = Math.floor(127 * (1 + v))
      
      # Color is red for a negative voltage:
      CircuitElement.colorScale[i] = new Color(n1, n2, n2)
    else
      n1 = Math.floor((128 * v) + 127)
      n2 = Math.floor(127 * (1 - v))
      
      # Color is green for a positive voltage
      CircuitElement.colorScale[i] = new Color(n2, n1, n2)
    ++i
  CircuitElement.ps1 = new Point(0, 0)
  CircuitElement.ps2 = new Point(0, 0)


#			shortFormat = new flash.globalization.NumberFormatter(LocaleID.DEFAULT);
#			shortFormat.fractionalDigits = 1;
#			showFormat = new flash.globalization.NumberFormatter(LocaleID.DEFAULT);
#			showFormat.fractionalDigits = 2;
#			showFormat.leadingZero = true;
#			noCommaFormat = new flash.globalization.NumberFormatter(LocaleID.DEFAULT);
#			noCommaFormat.fractionalDigits = 10;
#			noCommaFormat.useGrouping = false;
CircuitElement::initBoundingBox = ->
  @boundingBox = new Rectangle(0, 0, 0, 0)
  @boundingBox.x1 = Math.min(@x1, @x2)
  @boundingBox.y = Math.min(@y, @y2)
  @boundingBox.width = Math.abs(@x2 - @x1) + 1
  @boundingBox.height = Math.abs(@y2 - @y) + 1

CircuitElement::allocNodes = ->
  @nodes = new Array(@getPostCount() + @getInternalNodeCount())
  @volts = new Array(@getPostCount() + @getInternalNodeCount())
  @nodes = zeroArray(@nodes)
  @volts = zeroArray(@volts)

CircuitElement::dump = ->
  @getDumpType() + " " + @x1 + " " + @y + " " + @x2 + " " + @y2 + " " + @flags

CircuitElement::reset = ->
  i = undefined
  i = 0
  while i < @getPostCount() + @getInternalNodeCount()
    @volts[i] = 0
    ++i
  @curcount = 0

CircuitElement::draw = ->
  paper.fillRect @boundingBox.x1, @boundingBox.y, @boundingBox.width, @boundingBox.height

CircuitElement::setCurrent = (x, c) ->
  @current = c

CircuitElement::getCurrent = ->
  @current

CircuitElement::doStep = ->


# Extended by sub-classes
CircuitElement::destroy = ->


# Todo: implement
CircuitElement::startIteration = ->


# Todo: implement
CircuitElement::getPostVoltage = (x) ->
  @volts[x]

CircuitElement::setNodeVoltage = (n, c) ->
  @volts[n] = c
  @calculateCurrent()

CircuitElement::calculateCurrent = ->

CircuitElement::setPoints = ->
  @dx = @x2 - @x1
  @dy = @y2 - @y
  @dn = Math.sqrt(@dx * @dx + @dy * @dy)
  @dpx1 = @dy / @dn
  @dpy1 = -@dx / @dn
  @dsign = (if (@dy is 0) then sign(@dx) else sign(@dy))
  @point1 = new Point(@x1, @y)
  @point2 = new Point(@x2, @y2)

CircuitElement::calcLeads = (len) ->
  if @dn < len or len is 0
    @lead1 = @point1
    @lead2 = @point2
    return
  @lead1 = CircuitElement.interpPointPt(@point1, @point2, (@dn - len) / (2 * @dn))
  @lead2 = CircuitElement.interpPointPt(@point1, @point2, (@dn + len) / (2 * @dn))

CircuitElement::getDefaultFlags = ->
  0

CircuitElement.interpPointPt = (a, b, f, g) ->
  Circuit.halt "no interpolation value (f) defined in interpPointPt"  unless f
  p = new Point(0, 0)
  CircuitElement.interpPoint a, b, p, f, g
  p

CircuitElement.interpPoint = (a, b, c, f, g) ->
  gx = 0
  gy = 0
  if g
    gx = b.y - a.y
    gy = a.x1 - b.x1
    g /= Math.sqrt(gx * gx + gy * gy)
  else
    g = 0
  c.x1 = Math.floor(a.x1 * (1 - f) + b.x1 * f + g * gx + .48)
  c.y = Math.floor(a.y * (1 - f) + b.y * f + g * gy + .48)
  b

CircuitElement.interpPoint2 = (a, b, c, d, f, g) ->
  gx = 0
  gy = 0
  unless g is 0
    gx = b.y - a.y
    gy = a.x1 - b.x1
    g /= Math.sqrt(gx * gx + gy * gy)
  else
    g = 0
  offset = .48
  c.x1 = Math.floor(a.x1 * (1 - f) + b.x1 * f + g * gx + offset)
  c.y = Math.floor(a.y * (1 - f) + b.y * f + g * gy + offset)
  d.x1 = Math.floor(a.x1 * (1 - f) + b.x1 * f - g * gx + offset)
  d.y = Math.floor(a.y * (1 - f) + b.y * f - g * gy + offset)

CircuitElement::draw2Leads = ->
  color = @setVoltageColor(@volts[0])
  CircuitElement.drawThickLinePt @point1, @lead1, color
  color = @setVoltageColor(@volts[1])
  CircuitElement.drawThickLinePt @lead2, @point2, color

CircuitElement.newPointArray = (n) ->
  a = new Array(n)
  a[--n] = new Point(0, 0)  while n > 0
  a

CircuitElement::drawDots = (pa, pb, pos) ->
  
  # If the sim is stopped or has dots disabled
  return  if Circuit.stoppedCheck or pos is 0 or not Circuit.dotsCheckItem
  dx = pb.x1 - pa.x1
  dy = pb.y - pa.y
  dn = Math.sqrt(dx * dx + dy * dy)
  ds = 16
  pos %= ds
  pos += ds  if pos < 0
  di = pos

  while di < dn
    x0 = (pa.x1 + di * dx / dn)
    y0 = (pa.y + di * dy / dn)
    
    # Draws each dot:
    # TODO CANVAS
    paper.beginPath()
    paper.strokeStyle = Color.color2HexString(Settings.DOTS_OUTLINE)
    paper.fillStyle = Color.color2HexString(Settings.DOTS_COLOR)
    paper.arc x0, y0, Settings.CURRENT_RADIUS, 0, 2 * Math.PI, true
    paper.stroke()
    paper.fill()
    paper.closePath()
    di += ds

CircuitElement.calcArrow = (a, b, al, aw) ->
  poly = new Polygon()
  p1 = new Point(0, 0)
  p2 = new Point(0, 0)
  adx = b.x1 - a.x1
  ady = b.y - a.y
  l = Math.sqrt(adx * adx + ady * ady)
  poly.addVertex b.x1, b.y
  CircuitElement.interpPoint2 a, b, p1, p2, 1 - al / l, aw
  poly.addVertex p1.x1, p1.y
  poly.addVertex p2.x1, p2.y
  poly

CircuitElement.createPolygon = (a, b, c, d) ->
  p = new Polygon()
  p.addVertex a.x1, a.y
  p.addVertex b.x1, b.y
  p.addVertex c.x1, c.y
  p.addVertex d.x1, d.y  if d
  p

CircuitElement.createPolygonFromArray = (a) ->
  p = new Polygon()
  i = 0

  while i < a.length
    p.addVertex a[i].x1, a[i].y
    ++i
  p

CircuitElement::drag = (xx, yy) ->
  xx = Circuit.snapGrid(xx)
  yy = Circuit.snapGrid(yy)
  if @noDiagonal
    if Math.abs(@x1 - xx) < Math.abs(@y - yy)
      xx = @x1
    else
      yy = @y
  @x2 = xx
  @y2 = yy
  @setPoints()

CircuitElement::move = (dx, dy) ->
  @x1 += dx
  @y += dy
  @x2 += dx
  @y2 += dy
  @boundingBox.x1 += dx
  @boundingBox.y += dy
  @setPoints()

CircuitElement::allowMove = (dx, dy) ->
  nx = @x1 + dx
  ny = @y + dy
  nx2 = @x2 + dx
  ny2 = @y2 + dy
  i = 0

  while i < Circuit.elementList.length
    ce = Circuit.getElm(i)
    return false  if ce.x1 is nx and ce.y is ny and ce.x2 is nx2 and ce.y2 is ny2
    return false  if ce.x1 is nx2 and ce.y is ny2 and ce.x2 is nx and ce.y2 is ny
    ++i
  true

CircuitElement::movePoint = (n, dx, dy) ->
  if n is 0
    @x1 += dx
    @y += dy
  else
    @x2 += dx
    @y2 += dy
  @setPoints()

CircuitElement::stamp = ->


# overridden in subclasses
CircuitElement::getVoltageSourceCount = ->
  0

CircuitElement::getInternalNodeCount = ->
  0

CircuitElement::setNode = (p, n) ->
  @nodes[p] = n

CircuitElement::setVoltageSource = (n, v) ->
  @voltSource = v

CircuitElement::getVoltageSource = ->
  @voltSource

CircuitElement::getVoltageDiff = ->
  @volts[0] - @volts[1]

CircuitElement::nonLinear = ->
  false

CircuitElement::getPostCount = ->
  2

CircuitElement::getNode = (n) ->
  @nodes[n]

CircuitElement::getPost = (n) ->
  (if (n is 0) then @point1 else (if (n is 1) then @point2 else null))

CircuitElement::setBbox = (x1, y1, x2, y2) ->
  if x1 > x2
    q = x1
    x1 = x2
    x2 = q
  if y1 > y2
    q = y1
    y1 = y2
    y2 = q
  @boundingBox.x1 = x1
  @boundingBox.y = y1
  @boundingBox.width = x2 - x1 + 1
  @boundingBox.height = y2 - y1 + 1

CircuitElement::setBboxPt = (p1, p2, w) ->
  @setBbox p1.x1, p1.y, p2.x1, p2.y
  dpx = (@dpx1 * w)
  dpy = (@dpy1 * w)
  @adjustBbox p1.x1 + dpx, p1.y + dpy, p1.x1 - dpx, p1.y - dpy

CircuitElement::adjustBbox = (x1, y1, x2, y2) ->
  if x1 > x2
    q = x1
    x1 = x2
    x2 = q
  if y1 > y2
    q = y1
    y1 = y2
    y2 = q
  x1 = Math.min(@boundingBox.x1, x1)
  y1 = Math.min(@boundingBox.y, y1)
  x2 = Math.max(@boundingBox.x1 + @boundingBox.width - 1, x2)
  y2 = Math.max(@boundingBox.y + @boundingBox.height - 1, y2)
  @boundingBox.x1 = x1
  @boundingBox.y = y1
  @boundingBox.width = x2 - x1
  @boundingBox.height = y2 - y1

CircuitElement::adjustBboxPt = (p1, p2) ->
  @adjustBbox p1.x1, p1.y, p2.x1, p2.y

CircuitElement::isCenteredText = ->
  false


###
Not yet implemented
###
CircuitElement::drawCenteredText = (s, x, y, cx) ->
  
  # todo: test
  fm = undefined
  text = undefined
  w = 10 * s.length #fm.stringWidth(s);
  x -= w / 2  if cx
  ascent = -10 #fm.getAscent() / 2;
  descent = 5 #fm.getAscent() / 2;
  
  # TODO: CANVAS
  paper.fillStyle = Color.color2HexString(Settings.TEXT_COLOR)
  paper.fillText s, x, y + ascent
  
  #    text = paper.text(x, y + ascent, s).attr({
  #        cursor:"none",
  #        'font-weight':'bold',
  #        fill:Color.color2HexString(Settings.TEXT_COLOR)
  #    });
  @adjustBbox x, y - ascent, x + w, y + ascent + descent
  text


###
Not yet implemented
###
CircuitElement::drawValues = (s, hs) ->
  return  unless s?
  w = 100 #fm.stringWidth(s);
  ya = -10 #fm.getAscent() / 2;
  xc = undefined
  yc = undefined
  if this instanceof RailElm or this instanceof SweepElm
    xc = @x2
    yc = @y2
  else
    xc = (@x2 + @x1) / 2
    yc = (@y2 + @y) / 2
  dpx = Math.floor(@dpx1 * hs)
  dpy = Math.floor(@dpy1 * hs)
  offset = 20
  textLabel = undefined
  paper.fillStyle = Color.color2HexString(Settings.TEXT_COLOR)
  if dpx is 0
    
    # TODO: CANVAS
    paper.fillText s, xc - w / 2 + 3 * offset / 2, yc - Math.abs(dpy) - offset / 3
  
  #        textLabel = paper.text(xc - w / 2, yc - Math.abs(dpy) - offset, s).attr({
  #            fill:Color.color2HexString(Settings.TEXT_COLOR),
  #            'font-weight':'bold'
  #        });
  else
    xx = xc + Math.abs(dpx) + offset
    xx = xc - (10 + Math.abs(dpx) + offset)  if this instanceof VoltageElm or (@x1 < @x2 and @y > @y2)
    
    # TODO: CANVAS
    paper.fillText s, xx, yc + dpy + ya
  
  #        textLabel = paper.text(xx, yc + dpy + ya, s).attr({
  #            'font-weight':'bold',
  #            fill:Color.color2HexString(Settings.TEXT_COLOR)
  #        });
  textLabel

CircuitElement::drawCoil = (hs, p1, p2, v1, v2) ->
  
  # todo: implement
  segments = 40
  segf = 1 / segments
  CircuitElement.ps1.x1 = p1.x1
  CircuitElement.ps1.y = p1.y
  i = 0

  while i < segments
    cx = (((i + 1) * 8 * segf) % 2) - 1
    hsx = Math.sqrt(1 - cx * cx)
    hsx = -hsx  if hsx < 0
    CircuitElement.interpPoint p1, p2, CircuitElement.ps2, i * segf, hsx * hs
    v = v1 + (v2 - v1) * i / segments
    color = @setVoltageColor(v)
    CircuitElement.drawThickLinePt CircuitElement.ps1, CircuitElement.ps2, color
    CircuitElement.ps1.x1 = CircuitElement.ps2.x1
    CircuitElement.ps1.y = CircuitElement.ps2.y
    ++i

CircuitElement.drawCircle = (x0, y0, r, color) ->
  paper.beginPath()
  paper.strokeStyle = Color.color2HexString(color)
  paper.arc x0, y0, r, 0, 2 * Math.PI, true
  paper.stroke()
  paper.closePath()


#    circ.attr({
#        stroke:Color.color2HexString(Settings.POST_COLOR),
#        'stroke-width':Settings.LINE_WIDTH
#        //'fill-opacity':0
#    });
#    return circ;
CircuitElement.drawThickLine = (x, y, x2, y2, color) ->
  paper.strokeStyle = (if (color) then Color.color2HexString(color) else CircuitElement.color)
  paper.beginPath()
  paper.moveTo x, y
  paper.lineTo x2, y2
  paper.stroke()
  paper.closePath()


#    var pathName = "M " + x + " " + y + " l " + (x2 - x) + " " + (y2 - y);
#    var newLine = paper.path(pathName);
#    var line_color = (color) ? Color.color2HexString(color) : CircuitElement.color;
#    newLine.attr({
#        'stroke':Color.color2HexString(color),
#        'stroke-width':Settings.LINE_WIDTH
#    });
#    return newLine;
CircuitElement.drawThickLinePt = (pa, pb, color) ->
  CircuitElement.drawThickLine pa.x1, pa.y, pb.x1, pb.y, color

CircuitElement.drawThickPolygon = (xlist, ylist, c, color) ->
  i = undefined
  i = 0
  while i < (c.length - 1)
    CircuitElement.drawThickLine xlist[i], ylist[i], xlist[i + 1], ylist[i + 1], color
    ++i
  CircuitElement.drawThickLine xlist[i], ylist[i], xlist[0], ylist[0], color

CircuitElement.drawThickPolygonP = (polygon, color) ->
  c = polygon.numPoints()
  i = undefined
  i = 0
  while i < (c - 1)
    CircuitElement.drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(i + 1), polygon.getY(i + 1), color
    ++i
  CircuitElement.drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color

CircuitElement::drawPosts = ->
  i = 0

  while i < @getPostCount()
    p = @getPost(i)
    @drawPost p.x1, p.y, @nodes[i]
    ++i

CircuitElement::drawPost = (x0, y0, node) ->
  if node
    return  if not Circuit.dragElm? and not @needsHighlight() and Circuit.getCircuitNode(node).links.length is 2
    return  if Circuit.mouseMode is Circuit.MODE_DRAG_ROW or Circuit.mouseMode is Circuit.MODE_DRAG_COLUMN
  paper.beginPath()
  if @needsHighlight()
    paper.fillStyle = Color.color2HexString(Settings.POST_COLOR_SELECTED)
    paper.strokeStyle = Color.color2HexString(Settings.POST_COLOR_SELECTED)
  else
    paper.fillStyle = Color.color2HexString(Settings.POST_COLOR)
    paper.strokeStyle = Color.color2HexString(Settings.POST_COLOR)
  paper.arc x0, y0, Settings.POST_RADIUS, 0, 2 * Math.PI, true
  paper.stroke()
  paper.fill()
  paper.closePath()


#var circ = paper.circle(x0, y0, Settings.POST_RADIUS);
#circ.attr({
#    stroke:Color.color2HexString(Settings.POST_COLOR),
#    fill:Color.color2HexString(Settings.POST_COLOR)
#});
CircuitElement.getVoltageDText = (v) ->
  CircuitElement.getUnitText Math.abs(v), "V"

CircuitElement.getVoltageText = (v) ->
  CircuitElement.getUnitText v, "V"

CircuitElement.getUnitText = (v, u) ->
  va = Math.abs(v)
  return "0 " + u  if va < 1e-14
  return (v * 1e12).toFixed(2) + " p" + u  if va < 1e-9
  return (v * 1e9).toFixed(2) + " n" + u  if va < 1e-6
  return (v * 1e6).toFixed(2) + " " + Circuit.muString + u  if va < 1e-3
  return (v * 1e3).toFixed(2) + " m" + u  if va < 1
  return (v).toFixed(2) + " " + u  if va < 1e3
  return (v * 1e-3).toFixed(2) + " k" + u  if va < 1e6
  return (v * 1e-6).toFixed(2) + " M" + u  if va < 1e9
  (v * 1e-9).toFixed(2) + " G" + u


###
V is a number, u is  string
###
CircuitElement.getShortUnitText = (v, u) ->
  va = Math.abs(v)
  return null  if va < 1e-13
  return (v * 1e12).toFixed(1) + "p" + u  if va < 1e-9
  return (v * 1e9).toFixed(1) + "n" + u  if va < 1e-6
  return (v * 1e6).toFixed(1) + Circuit.muString + u  if va < 1e-3
  return (v * 1e3).toFixed(1) + "m" + u  if va < 1
  return (v).toFixed(1) + u  if va < 1e3
  return (v * 1e-3).toFixed(1) + "k" + u  if va < 1e6
  return (v * 1e-6).toFixed(1) + "M" + u  if va < 1e9
  (v * 1e-9).toFixed(1) + "G" + u

CircuitElement.getCurrentText = (i) ->
  CircuitElement.getUnitText i, "A"

CircuitElement.getCurrentDText = (i) ->
  CircuitElement.getUnitText Math.abs(i), "A"

CircuitElement::updateDotCount = (cur, cc) ->
  cur = @current  if isNaN(cur)
  cc = @curcount  if isNaN(cc)
  return cc  if Circuit.stoppedCheck
  cadd = cur * CircuitElement.currentMult
  cadd %= 8
  @curcount = cadd + cc
  cc + cadd

CircuitElement::doDots = ->
  @curcount = @updateDotCount()
  @drawDots @point1, @point2, @curcount  unless Circuit.dragElm is this

CircuitElement::getInfo = (arr) ->


# Extended by subclasses
CircuitElement::getBasicInfo = (arr) ->
  arr[1] = "I = " + CircuitElement.getCurrentDText(@getCurrent())
  arr[2] = "Vd = " + CircuitElement.getVoltageDText(@getVoltageDiff())
  3

CircuitElement::setVoltageColor = (volts) ->
  return Settings.SELECT_COLOR  if @needsHighlight()
  # && !conductanceCheckItem.getState())
  return CircuitElement.whiteColor  unless Circuit.powerCheckItem  unless Circuit.voltsCheckItem
  c = Math.floor((volts + CircuitElement.voltageRange) * (CircuitElement.colorScaleCount - 1) / (CircuitElement.voltageRange * 2))
  c = 0  if c < 0
  c = CircuitElement.colorScaleCount - 1  if c >= CircuitElement.colorScaleCount
  Math.floor CircuitElement.colorScale[c].getColor()

CircuitElement::setPowerColor = (yellow) ->
  return  unless Circuit.powerCheckItem
  w0 = @getPower()
  w0 *= CircuitElement.powerMult
  
  #console.log(w);
  w = (if (w0 < 0) then -w0 else w0)
  w = 1  if w > 1
  rg = 128 + Math.floor(w * 127)
  b = Math.floor(128 * (1 - w))


#if (yellow)
#     //g.setColor(new Color(rg, rg, b));
#     else 

#if (w0 > 0)
#g.beginFill( (new Color(rg, b, b)).getColor() );
#else
#g.beginFill( (new Color(b, rg, b)).getColor() );
CircuitElement::getPower = ->
  @getVoltageDiff() * @current

CircuitElement::getScopeValue = (x) ->
  (if (x is 1) then @getPower() else @getVoltageDiff())

CircuitElement::getScopeUnits = (x) ->
  (if (x is 1) then "W" else "V")

CircuitElement::getEditInfo = (n) ->
  null

CircuitElement::setEditValue = (n, ei) ->

CircuitElement::getConnection = (n1, n2) ->
  true

CircuitElement::hasGroundConnection = (n1) ->
  false

CircuitElement::isWire = ->
  false

CircuitElement::canViewInScope = ->
  @getPostCount() <= 2

CircuitElement::comparePair = (x1, x2, y1, y2) ->
  (x1 is y1 and x2 is y2) or (x1 is y2 and x2 is y1)

CircuitElement::needsHighlight = ->
  Circuit.mouseElm is this or @selected

CircuitElement::isSelected = ->
  @selected

CircuitElement::setSelected = (selected) ->
  @selected = selected

CircuitElement::selectRect = (r) ->
  @selected = r.intersects(@boundingBox)

CircuitElement::getBoundingBox = ->
  @boundingBox

CircuitElement::needsShortcut = ->
  false

CircuitElement::toString = ->
  "Circuit Element"
