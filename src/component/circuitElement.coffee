# If we are in Node.js:
if process.env
  Settings = require('../settings/settings')
  {Polygon, Rectangle, Point} = require('../util/shapePrimitives')

class CircuitElement

  @ps1: new Point(0, 0)
  @ps2: new Point(0, 0)


  constructor: (@x1, @y1, @x2, @y2, flags, st...) ->
    @current = 0
    @curcount = 0
    @noDiagonal = false
    @selected = false

    if isNaN(flags)
      @flags = @getDefaultFlags()
    else
      @flags = flags

    @setPoints()
    @allocNodes()
    @initBoundingBox()

  setCircuit: (circuit) ->
    @circuit = circuit

  allocNodes: ->
    @nodes = zeroArray(@getPostCount() + @getInternalNodeCount())
    @volts = zeroArray(@getPostCount() + @getInternalNodeCount())

  setPoints: ->
    @dx = @x2 - @x1
    @dy = @y2 - @y1
    @dn = Math.sqrt(@dx * @dx + @dy * @dy)
    @dpx1 = @dy / @dn
    @dpy1 = -@dx / @dn
    @dsign = (if (@dy is 0) then sign(@dx) else sign(@dy))
    @point1 = new Point(@x1, @y1)
    @point2 = new Point(@x2, @y2)
    #TODO: Implement snapping here:

  setColor: (color) ->
    @color = color

  getDefaultFlags: ->
    0

  getDumpType: ->
    0

  # Todo: implement needed
  getDumpClass: ->
    "Needs implementation"

  toString: ->
    "Circuit Element"

  isSelected: ->
    @selected

  initBoundingBox: ->
    @boundingBox = new Rectangle()

    @boundingBox.x = Math.min(@x1, @x2);
    @boundingBox.y = Math.min(@y1, @y2);
    @boundingBox.width = Math.abs(@x2 - @x1) + 1;
    @boundingBox.height = Math.abs(@y2 - @y1) + 1;


  dump: ->
    @getDumpType() + " " + @x1 + " " + @y1 + " " + @x2 + " " + @y2 + " " + @flags;

  reset: ->
    @volts = zeroArray(@volts.length)
    @curcount = 0

  setCurrent: (x, current) ->
    @current = current

  getCurrent: ->
    @current

  # Steps forward one frame and performs calculation
  doStep: ->
    # to be extended by subclasses

  destroy: ->
    # TODO: Implement

  startIteration: ->
    # TODO: Implement

  getPostVoltage: (post_idx) ->
    @volts[post_idx]

  setNodeVoltage: (node_idx, voltage) ->
    @volts[node_idx] = voltage
    @calculateCurrent()

  calculateCurrent: ->
    # TODO: Implemented by subclasses

  calcLeads: (len) ->
    if @dn < len or len is 0
      @lead1 = @point1
      @lead2 = @point2
      return

    @lead1 = CircuitElementDrawUtils.interpPointPt(@point1, @point2, (@dn - len) / (2 * @dn));
    @lead2 = CircuitElementDrawUtils.interpPointPt(@point1, @point2, (@dn + len) / (2 * @dn));

  getDefaultFlags: ->
    0

  drag: (newX, newY) ->
    newX = Circuit.snapGrid(newX)
    newY = Circuit.snapGrid(newY)
    if @noDiagonal
      if Math.abs(@x1 - newX) < Math.abs(@y1 - newY)
        newX = @x1
      else
        newY = @y1
    @x2 = newX
    @y2 = newY
    @setPoints()

  move: (dx, dy) ->
    @x1 += dx
    @y1 += dy
    @x2 += dx
    @y2 += dy
    @boundingBox.x += dx
    @boundingBox.y += dy
    @setPoints()

  allowMove: (dx, dy) ->
    nx = @x1 + dx
    ny = @y1 + dy
    nx2 = @x2 + dx
    ny2 = @y2 + dy

    for circuitElement in @Circuit.elementList
      if circuitElement.x1 is nx and circuitElement.y1 is ny and circuitElement.x2 is nx2 and circuitElement.y2 is ny2
        return false
      if circuitElement.x1 is nx2 and circuitElement.y1 is ny2 and circuitElement.x2 is nx and circuitElement.y2 is ny
        return false

    true

  movePoint: (n, dx, dy) ->
    if n is 0
      @x1 += dx
      @y1 += dy
    else
      @x2 += dx
      @y2 += dy
    @setPoints()

  stamp: ->
    # to be overridden by subclasses

  getVoltageSourceCount: ->
    0

  getInternalNodeCount: ->
    0

  setNode: (nodeIdx, newValue) ->
    @nodes[nodeIdx] = newValue

  setVoltageSource: (node, value) ->
    @voltSource = value

  getVoltageDiff: ->
    @volts[0] - @volts[1]

  nonlinear: ->
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

  setBbox: (x1, y1, x2, y2) ->
    if x1 > x2
      q = x1
      x1 = x2
      x2 = q
    if y1 > y2
      q = y1
      y1 = y2
      y2 = q
    @boundingBox.x = x1
    @boundingBox.y = y1
    @boundingBox.width = x2 - x1 + 1
    @boundingBox.height = y2 - y1 + 1

  setBboxPt: (p1, p2, w) ->
    @setBbox p1.x1, p1.y, p2.x1, p2.y
    dpx = (@dpx1 * w)
    dpy = (@dpy1 * w)
    @adjustBbox p1.x1 + dpx, p1.y + dpy, p1.x1 - dpx, p1.y - dpy

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
    null

  # Extended by subclasses
  getBasicInfo: (arr) ->
    arr[1] = "I = " + CircuitElement.getCurrentDText(@getCurrent())
    arr[2] = "Vd = " + CircuitElement.getVoltageDText(@getVoltageDiff())
    3

  getPower: ->
    @getVoltageDiff() * @current

  getScopeValue: (x) ->
    (if (x is 1) then @getPower() else @getVoltageDiff())

  @getScopeUnits: (x) ->
    if (x is 1) then "W" else "V"

  # TODO: Implement
  getEditInfo: (n) ->
    null

  # TODO: Implement
  setEditValue: (n, ei) ->
    null

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

  isSelected: ->
    @selected

  setSelected: (selected) ->
    @selected = selected

  selectRect: (rect) ->
    @selected = rect.intersects(@boundingBox)

  needsShortcut: ->
    false


# The Footer exports class(es) in this file via Node.js, if it is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = (exports) ? window
module.exports = CircuitElement