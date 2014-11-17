# #######################################################################
# CircuitComponent:
#   Base class from which all components inherit
#
# @author Anthony Erlinger
# @year 2012
#
# Uses the Observer Design Pattern:
#   Observes: Circuit, CircuitRender
#   Observed By: CircuitCanvas
#
# Events:
#  <None>
#
# #######################################################################


# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point'
  'cs!MathUtils',
  'cs!ArrayUtils',
  'cs!Observer',
  'cs!Module'

], (
  Settings,
  DrawHelper,
  Polygon,
  Rectangle,
  Point,
  MathUtils,
  ArrayUtils,
  Observer,
  Module
) ->
# </DEFINE>


  class CircuitComponent extends Module

    constructor: (@x1 = 100, @y1 = 100, @x2 = 100, @y2 = 200, flags = 0, st = []) ->
      @current = 0
      @curcount = 0
      @noDiagonal = false
      @selected = false
      @dragging = false
      @parentCircuit = null

      @flags = flags || @getDefaultFlags()

      @setPoints()
      @allocNodes()
      @initBoundingBox()
      @component_id = MathUtils.getRand(100000000) + (new Date()).getTime()

    getParentCircuit: () ->
      return @Circuit

    isBeingDragged: () ->
      return @Circuit.dragElm is this

    allocNodes: ->
      @nodes = ArrayUtils.zeroArray(@getPostCount() + @getInternalNodeCount())
      @volts = ArrayUtils.zeroArray(@getPostCount() + @getInternalNodeCount())

    setPoints: ->
      @dx = @x2 - @x1
      @dy = @y2 - @y1

      @dn = Math.sqrt(@dx * @dx + @dy * @dy)
      @dpx1 = @dy / @dn
      @dpy1 = -@dx / @dn

      @dsign = (if (@dy is 0) then MathUtils.sign(@dx) else MathUtils.sign(@dy))

      @point1 = new Point(@x1, @y1)
      @point2 = new Point(@x2, @y2)

#      console.log("Setting points: #{this.toString()} - #{this.dump()}")

      #TODO: Implement snapping here:

    # As a string
    setColor: (color) ->
      @color = color

    getDumpType: ->
      0

    isSelected: ->
      @selected

    reset: ->
      @volts = ArrayUtils.zeroArray(@volts.length)
      @curcount = 0

    setCurrent: (x, current) ->
      @current = current

    getCurrent: ->
      @current

    getVoltageDiff: ->
      @volts[0] - @volts[1]

    getPower: ->
      @getVoltageDiff() * @current

    calculateCurrent: ->
      # TODO: Implemented by subclasses

    # Steps forward one frame and performs calculation
    doStep: ->
      # To be implemented by subclasses

    orphaned: ->
      return @Circuit is null or @Circuit is undefined

    destroy: =>
      @Circuit.desolder(this)

    startIteration: ->
      # Called on reactive elements such as inductors and capacitors.

    getPostVoltage: (post_idx) ->
      @volts[post_idx]

    setNodeVoltage: (node_idx, voltage) ->
      @volts[node_idx] = voltage
      @calculateCurrent()

    calcLeads: (len) ->
      if @dn < len or len is 0
        @lead1 = @point1
        @lead2 = @point2
        return

#      console.log("Calc leads: #{@toString()}");
      @lead1 = DrawHelper.interpPoint(@point1, @point2, (@dn - len) / (2 * @dn));
      @lead2 = DrawHelper.interpPoint(@point1, @point2, (@dn + len) / (2 * @dn));

    # TODO: Validate consistency
    updateDotCount: (cur, cc) ->
      #      return cc  if CirSim.stoppedCheck
      cur = @current  if (isNaN(cur) || !cur?)
      cc = @curcount  if (isNaN(cc) || !cc?)

      cadd = cur * @Circuit.Params.getCurrentMult()
#      cadd = cur * 48
      cadd %= 8
      @curcount = cc + cadd
      @curcount

    getDefaultFlags: ->
      0

    equal_to: (otherComponent) ->
      return @component_id == otherComponent.component_id

    drag: (newX, newY) ->
      newX = @Circuit.snapGrid(newX)
      newY = @Circuit.snapGrid(newY)
      if @noDiagonal
        if Math.abs(@x1 - newX) < Math.abs(@y1 - newY)
          newX = @x1
        else
          newY = @y1
      @x2 = newX
      @y2 = newY
      @setPoints()

    move: (deltaX, deltaY) ->
      @x1 += deltaX
      @y1 += deltaY
      @x2 += deltaX
      @y2 += deltaY

      @boundingBox.x += deltaX
      @boundingBox.y += deltaY
      @setPoints()

    allowMove: (deltaX, deltaY) ->
      newX = @x1 + deltaX
      newY = @y1 + deltaY
      newX2 = @x2 + deltaX
      newY2 = @y2 + deltaY

      for circuitElm in @Circuit.elementList
        if circuitElm.x1 is newX and circuitElm.y1 is newY and circuitElm.x2 is newX2 and circuitElm.y2 is newY2
          return false
        if circuitElm.x1 is newX2 and circuitElm.y1 is newY2 and circuitElm.x2 is newX and circuitElm.y2 is newY
          return false

      true

    movePoint: (n, deltaX, deltaY) ->
      if n is 0
        @x1 += deltaX
        @y1 += deltaY
      else
        @x2 += deltaX
        @y2 += deltaY
      @setPoints()

    stamp: ->
      throw("Called abstract function stamp() in Circuit #{@getDumpType()}")

    # Todo: implement needed
    getDumpClass: ->
      this.toString()

    # Returns the class name of this element (e.x. ResistorElm)
    toString: ->
      console.error("Virtual call on toString in circuitComponent was #{@dump()}");
#      return arguments.callee.name

    dump: ->
      @getDumpType() + " " + @x1 + " " + @y1 + " " + @x2 + " " + @y2 + " " + @flags

    getVoltageSourceCount: ->
      0

    getInternalNodeCount: ->
      0

    setNode: (nodeIdx, newValue) ->
      @nodes[nodeIdx] = newValue

    setVoltageSource: (node, value) ->
      @voltSource = value

    getVoltageSource: ->
      @voltSource

    nonLinear: ->
      false

    # Two terminals by default, but likely to be overidden by subclasses
    getPostCount: ->
      2

    getNode: (nodeIdx) ->
      @nodes[nodeIdx]

    getPost: (postIdx) ->
      if postIdx == 0
        return @point1
      else if postIdx == 1
        return @point2

      printStackTrace()

    getBoundingBox: ->
      @boundingBox

    initBoundingBox: ->
      @boundingBox = new Rectangle()

      @boundingBox.x = Math.min(@x1, @x2);
      @boundingBox.y = Math.min(@y1, @y2);
      @boundingBox.width = Math.abs(@x2 - @x1) + 1;
      @boundingBox.height = Math.abs(@y2 - @y1) + 1;

    setBbox: (x1, y1, x2, y2) ->
      if x1 > x2
        temp = x1
        x1 = x2
        x2 = temp
      if y1 > y2
        temp = y1
        y1 = y2
        y2 = temp
      @boundingBox.x = x1
      @boundingBox.y = y1
      @boundingBox.width = x2 - x1 + 1
      @boundingBox.height = y2 - y1 + 1

    setBboxPt: (p1, p2, width) ->
      @setBbox p1.x, p1.y, p2.x, p2.y
      deltaX = (@dpx1 * width)
      deltaY = (@dpy1 * width)
      @adjustBbox p1.x + deltaX, p1.y + deltaY, p1.x - deltaX, p1.y - deltaY

    adjustBbox: (x1, y1, x2, y2) ->
      if x1 > x2
        q = x1
        x1 = x2
        x2 = q
      if y1 > y2
        q = y1
        y1 = y2
        y2 = q

      x1 = Math.min(@boundingBox.x, x1)
      y1 = Math.min(@boundingBox.y, y1)
      x2 = Math.max(@boundingBox.x + @boundingBox.width - 1, x2)
      y2 = Math.max(@boundingBox.y + @boundingBox.height - 1, y2)

      @boundingBox.x = x1
      @boundingBox.y = y1
      @boundingBox.width = x2 - x1
      @boundingBox.height = y2 - y1

    adjustBboxPt: (p1, p2) ->
      @adjustBbox p1.x, p1.y, p2.x, p2.y

    isCenteredText: ->
      false

    # Extended by subclasses
    getInfo: (arr) ->
      throw("Called abstract function getInfo() in AbstractCircuitElement")

    # TODO: Implement
    getEditInfo: (n) ->
      throw("Called abstract function getEditInfo() in AbstractCircuitElement")

    # TODO: Implement
    setEditValue: (n, ei) ->
      throw("Called abstract function setEditInfo() in AbstractCircuitElement")

    # Extended by subclasses
    getBasicInfo: (arr) ->
      arr[1] = "I = " + CircuitComponent.getCurrentDText(@getCurrent())
      arr[2] = "Vd = " + CircuitComponent.getVoltageDText(@getVoltageDiff())
      3

    getScopeValue: (x) ->
      (if (x is 1) then @getPower() else @getVoltageDiff())

    @getScopeUnits: (x) ->
      if (x is 1) then "W" else "V"

    getConnection: (n1, n2) ->
      true

    hasGroundConnection: (n1) ->
      false

    isWire: ->
      false

    canViewInScope: ->
      return @getPostCount() <= 2

    needsHighlight: ->
      @Circuit?.mouseElm is this or @selected

    setSelected: (selected) ->
      @selected = selected

    selectRect: (rect) ->
      @selected = rect.intersects(@boundingBox)

    needsShortcut: ->
      false


    ### #######################################################################
    # RENDERING METHODS
    ### #######################################################################

    draw: (renderContext) ->
      @curcount = @updateDotCount()
      @drawPosts(renderContext)
      @draw2Leads(renderContext)

#      throw("Called abstract function draw() in AbstractCircuitElement")

    draw2Leads: (renderContext) ->
#      console.log("Draw2Leads #{this}: [#{@point1}, #{@point2}] [#{@lead1}, #{@lead2}]");
      if @point1? and @lead1?
        renderContext.drawThickLinePt @point1, @lead1, DrawHelper.getVoltageColor(@volts[0])
      if @point2? and @lead2?
        renderContext.drawThickLinePt @lead2, @point2, DrawHelper.getVoltageColor(@volts[1])

    updateDotCount: ->


    drawDots: (point1 = @point1, point2 = @point2, renderContext) =>
      return if @Circuit?.isStopped() or @current is 0

      dx = point2.x - point1.x
      dy = point2.y - point1.y
      dn = Math.sqrt dx * dx + dy * dy

      ds = 16
#      pos %= ds

      currentIncrement = @current * @Circuit.currentSpeed()
      @curcount = (@curcount + currentIncrement) % ds
#      @curcount = 3
      @curcount += ds if @curcount < 0

      newPos = @curcount

#      console.log(@curcount)
      while newPos < dn
        x0 = point1.x + newPos * dx / dn
        y0 = point1.y + newPos * dy / dn

        renderContext.fillCircle(x0, y0, Settings.CURRENT_RADIUS)
        newPos += ds

    ###
    Todo: Not yet implemented
    ###
    drawCenteredText: (text, x, y, doCenter, renderContext) ->
      # TODO: test
      strWidth = 10 * text.length # fm.stringWidth(s);
      x -= strWidth / 2 if doCenter
      ascent = -10 # fm.getAscent() / 2;
      descent = 5  # fm.getAscent() / 2;

      renderContext.fillStyle = Settings.TEXT_COLOR
      renderContext.fillText text, x, y + ascent

      @adjustBbox x, y - ascent, x + strWidth, y + ascent + descent
      return text


    ###
    # Draws relevant values near components
    #  e.g. 500 Ohms, 10V, etc...
    ###
    drawValues: (valueText, hs, renderContext) ->
      return unless valueText
      stringWidth = 100 #fm.stringWidth(s);
      ya = -10 #fm.getAscent() / 2;

#      if this instanceof RailElm or this instanceof SweepElm
#        xc = @x2
#        yc = @y2
#      else
      xc = (@x2 + @x1) / 2
      yc = (@y2 + @y1) / 2
      dpx = Math.floor(@dpx1 * hs)
      dpy = Math.floor(@dpy1 * hs)
      offset = 20
      renderContext.fillStyle = Settings.TEXT_COLOR
      if dpx is 0
        renderContext.fillText valueText, xc - stringWidth / 2 + 3 * offset / 2, yc - Math.abs(dpy) - offset / 3
      else
        xx = xc + Math.abs(dpx) + offset
        #if this instanceof VoltageElm or (@x1 < @x2 and @y1 > @y2)
        #  xx = xc - (10 + Math.abs(dpx) + offset)
        renderContext.fillText valueText, xx, yc + dpy + ya


    drawPosts: (renderContext) ->
      for i in [0...@getPostCount()]
        post = @getPost(i)
        @drawPost post.x, post.y, @nodes[i], renderContext

    drawPost: (x0, y0, node, renderContext) ->
      #if node
        #return if not @Circuit?.dragElm? and not @needsHighlight() and @Circuit?.getNode(node).links.length is 2
        #return if @Circuit?.mouseMode is @Circuit?.MODE_DRAG_ROW or @Circuit?.mouseMode is @Circuit?.MODE_DRAG_COLUMN

      if @needsHighlight()
        fillColor = Settings.POST_COLOR_SELECTED
        strokeColor = Settings.POST_COLOR_SELECTED
      else
        fillColor = Settings.POST_COLOR
        strokeColor = Settings.POST_COLOR

      renderContext.fillCircle x0, y0, Settings.POST_RADIUS, 1, fillColor, strokeColor

    # @deprecated
    @newPointArray = (n) ->
      a = new Array(n)
      while (n > 0)
        a[--n] = new Point(0, 0);

      return a

    simParams: ->
      @Circuit.Params

    timeStep: ->
      @Circuit.timeStep()


  return CircuitComponent
