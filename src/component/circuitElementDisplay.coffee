### #######################################################################
# RENDERING METHODS
### #######################################################################

draw: ->
  # TODO: Rendering here

draw2Leads: ->
  color = @setVoltageColor(@volts[0])
  @drawThickLinePt @point1, @lead1, color
  color = @setVoltageColor(@volts[1])
  @drawThickLinePt @lead2, @point2, color

updateDotCount: (current, currentCount) ->
  current = @current if isNaN(current)
  currentCount = @curcount if isNaN(currentCount)
  return currentCount  if @Circuit.stoppedCheck
  currentIncrement = current * AbstractCircuitComponent.currentMult
  currentIncrement %= 8
  @curcount = currentIncrement + currentCount
  currentCount + currentIncrement

doDots: ->
  @curcount = @updateDotCount()
  @drawDots @point1, @point2, @curcount  unless @Circuit.dragElm is this

# Todo: move to independent drawing class
drawDots: (pa, pb, pos) ->
  # If the sim is stopped or has dots disabled
  return  if @Circuit.stoppedCheck or pos is 0 or not @Circuit.dotsCheckItem
  deltaX = pb.x1 - pa.x1
  deltaY = pb.y - pa.y
  dn = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  deltaSegment = 16
  pos %= deltaSegment
  pos += deltaSegment  if pos < 0
  di = pos

  while di < dn
    x0 = (pa.x1 + di * deltaX / dn)
    y0 = (pa.y + di * deltaY / dn)

    # Draws each dot:
    paper.beginPath()
    paper.strokeStyle = Color.color2HexString(Settings.DOTS_OUTLINE)
    paper.fillStyle = Color.color2HexString(Settings.DOTS_COLOR)
    paper.arc x0, y0, Settings.CURRENT_RADIUS, 0, 2 * Math.PI, true
    paper.stroke()
    paper.fill()
    paper.closePath()
    di += deltaSegment

###
Todo: Not yet implemented
###
drawCenteredText: (s, x, y, cx) ->
  # TODO: test
  fm = undefined
  text = undefined
  w = 10 * s.length # fm.stringWidth(s);
  x -= w / 2  if cx
  ascent = -10 # fm.getAscent() / 2;
  descent = 5  # fm.getAscent() / 2;

  # TODO: CANVAS
  paper.fillStyle = Color.color2HexString Settings.TEXT_COLOR
  paper.fillText s, x, y + ascent

  #    text = paper.text(x, y + ascent, s).attr({
  #        cursor:"none",
  #        'font-weight':'bold',
  #        fill:Color.color2HexString(Settings.TEXT_COLOR)
  #    });
  @adjustBbox x, y - ascent, x + w, y + ascent + descent
  text


###
# Todo: Not yet implemented
###
drawValues: (s, hs) ->
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
    yc = (@y2 + @y1) / 2
  dpx = Math.floor(@dpx1 * hs)
  dpy = Math.floor(@dpy1 * hs)
  offset = 20
  textLabel = undefined
  paper.fillStyle = Color.color2HexString(Settings.TEXT_COLOR)
  if dpx is 0
    # TODO: CANVAS
    paper.fillText s, xc - w / 2 + 3 * offset / 2, yc - Math.abs(dpy) - offset / 3
  else
    xx = xc + Math.abs(dpx) + offset
    xx = xc - (10 + Math.abs(dpx) + offset)  if this instanceof VoltageElm or (@x1 < @x2 and @y1 > @y2)
    # TODO: CANVAS
    paper.fillText s, xx, yc + dpy + ya
  textLabel

drawPosts: ->
  i = 0
  while i < @getPostCount()
    p = @getPost(i)
    @drawPost p.x1, p.y, @nodes[i]
    ++i

drawPost: (x0, y0, node) ->
  if node
    return  if not @Circuit.dragElm? and not @needsHighlight() and @Circuit.getCircuitNode(node).links.length is 2
    return  if @Circuit.mouseMode is @Circuit.MODE_DRAG_ROW or @Circuit.mouseMode is @Circuit.MODE_DRAG_COLUMN
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

setVoltageColor: (volts) ->
  return Settings.SELECT_COLOR  if @needsHighlight()
  return AbstractCircuitComponent.whiteColor  unless @Circuit.powerCheckItem unless @Circuit.voltsCheckItem
  c = Math.floor((volts + AbstractCircuitComponent.voltageRange) * (AbstractCircuitComponent.colorScaleCount - 1) / (AbstractCircuitComponent.voltageRange * 2))
  c = 0  if c < 0
  c = AbstractCircuitComponent.colorScaleCount - 1  if c >= AbstractCircuitComponent.colorScaleCount
  Math.floor AbstractCircuitComponent.colorScale[c].getColor()

@setPowerColor: (yellow) ->
  return unless @Circuit.powerCheckItem

  w0 = @getPower() * AbstractCircuitComponent.powerMult
  w = if (w0 < 0) then -w0 else w0
  w = 1 if w > 1
  rg = 128 + Math.floor w * 127
  b = Math.floor 128 * (1 - w)