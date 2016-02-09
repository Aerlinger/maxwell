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

Settings = require('../settings/settings.coffee')
Rectangle = require('../geom/rectangle.coffee')
Point = require('../geom/point.coffee')
MathUtils = require('../util/mathUtils.coffee')
ArrayUtils = require('../util/arrayUtils.coffee')
FormatUtils = require('../util/formatUtils.coffee')
DrawUtil = require("../util/drawUtil.coffee")

_ = require("lodash")

sprintf = require("sprintf-js").sprintf

class CircuitComponent
  @ParameterDefinitions = {}

  constructor: (@x1, @y1, @x2, @y2, params, f = 0) ->
    @flags = f || 0

    @setParameters(params)

    @current = 0
    @curcount = 0
    @voltSource = 0
    @noDiagonal = false
    @Circuit = null

    @setBbox(@x1, @y1, @x2, @y2)
    @component_id = MathUtils.getRand(100000000) + (new Date()).getTime()

    @setPoints()

    @allocNodes()

  allocNodes: ->
    @nodes = ArrayUtils.zeroArray(@getPostCount() + @getInternalNodeCount())
    @volts = ArrayUtils.zeroArray(@getPostCount() + @getInternalNodeCount())


  convertParamsToHash: (param_list) ->
    ParameterDefinitions = @constructor.ParameterDefinitions
    result = {}

    for i in [0...param_list.length]
      param_name = Object.keys(ParameterDefinitions)[i]
      param_value = param_list[i]

      if ParameterDefinitions[param_name]
        data_type = ParameterDefinitions[param_name].data_type
      else
        console.warn("Failed to load data_type #{data_type}: #{param_name}: #{param_value}")
        console.log(param_value)
        console.log("#{i}: param_name #{ParameterDefinitions}")
#        @getParentCircuit().halt()

      if (!data_type?)
        console.log("Data type: #{data_type} not found for parameter #{param_name} and value #{param_value}")

      if !data_type
        console.warn("No conversion found for #{data_type}")

      result[param_name] = data_type.call(this, param_value)

#    console.log(result)

    return result

  setParameters: (component_params) ->
    if component_params && component_params.constructor is Array
      component_params = @convertParamsToHash(component_params)

    ParameterDefinitions = @constructor.ParameterDefinitions

    @params = {}

    for param_name, definition of ParameterDefinitions
      default_value = definition.default_value
      data_type = definition.data_type

      if component_params && (param_name of component_params)
        param_value = data_type(component_params[param_name])

        this[param_name] = param_value
        @params[param_name] = param_value

        delete component_params[param_name]
      else
        this[param_name] = data_type(default_value)
        @params[param_name] = data_type(default_value)
    #        console.warn("Defined parameter #{param_name} not set for #{this} (defaulting to #{default_value}#{symbol})")

    unmatched_params = (param for param of component_params)

    if unmatched_params.length > 0
      console.error("The following parameters #{unmatched_params.join(" ")} do not belong in #{this}")
      throw new Error("Invalid params #{unmatched_params.join(" ")} assigned to #{this}")


  serializeParameters: ->
    params = {}

    for param_name, definition of this.constructor.ParameterDefinitions
      params[param_name] = this[param_name]

    return params

  serialize: ->
    {
      sym: this.constructor.name,
      x1: @x1,
      y1: @y1,
      x2: @x2,
      y2: @y2,
      params: @serializeParameters()
    }

  @deserialize: (jsonData) ->
    sym = jsonData['sym']
    x1 = jsonData['x1']
    y1 = jsonData['y1']
    x2 = jsonData['x2']
    y2 = jsonData['y2']
    params = jsonData['params']

    params: @serializeParameters()

    Component = eval(sym)

    return new Component(x1, y2, x2, y2, params)


  getParentCircuit: ->
    return @Circuit

  setPoints: ->
    @dx = @x2 - @x1
    @dy = @y2 - @y1

    @dn = Math.sqrt(@dx * @dx + @dy * @dy)
    @length = Math.sqrt(@dx * @dx + @dy * @dy)
    @dpx1 = @dy / @dn
    @dpy1 = -@dx / @dn

    @dsign = (if (@dy is 0) then MathUtils.sign(@dx) else MathUtils.sign(@dy))

    @point1 = new Point(@x1, @y1)
    @point2 = new Point(@x2, @y2)

  unitText: ->
    "?"

  height: ->
    @y2 - @y1

  width: ->
    @x2 - @x1

  axisAligned: ->
    @height() is 0 or @width() is 0

  setPowerColor: (color) ->
    console.warn("Set power color not yet implemented")

  getDumpType: ->
    0

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
    # To be implemented by subclasses

# Steps forward one frame and performs calculation
  doStep: ->
# To be implemented by subclasses

  orphaned: ->
    return @Circuit is null or @Circuit is undefined

  destroy: =>
    @Circuit.desolder(this)

  dump: ->
    tidyVoltage = FormatUtils.tidyFloat(@getVoltageDiff())
    tidyCurrent = FormatUtils.tidyFloat(@getCurrent())

    #    paramStr = JSON.stringify(@params)

    paramStr = (val for key, val of @params).join(" ")

    "[v #{tidyVoltage}, i #{tidyCurrent}]\t#{@getDumpType()} #{@x1} #{@y1} #{@x2} #{@y2}"

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
    else
      @lead1 = DrawUtil.interpolate(@point1, @point2, (@dn - len) / (2 * @dn))
      @lead2 = DrawUtil.interpolate(@point1, @point2, (@dn + len) / (2 * @dn))

  isVertical: ->
    @dx == 0

  getCenter: ->
    centerX = (@point1.x + @point2.x) / 2.0
    centerY = (@point1.y + @point2.y) / 2.0

#    centerX = (@lead1.x + @lead2.x) / 2.0
#    centerY = (@point1.y + @point2.y) / 2.0

    return new Point(centerX, centerY)

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

  equalTo: (otherComponent) ->
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

    @boundingBox.x = @x1
    @boundingBox.y = @x2

    @getParentCircuit().invalidate()

    @setPoints()

  stamp: ->
    @Circuit.halt("Called abstract function stamp() in Circuit #{@getDumpType()}")

# Todo: implement needed
  getDumpClass: ->
    @toString()

  inspect: ->
    paramValues = (val for key, val of @params)

    {
    sym: @getDumpType(),
    x1: @x1,
    y1: @y1,
    x2: @x2,
    xy: @y2,
    params: paramValues,
    voltage: @getVoltageDiff(),
    current: @getCurrent()
    }


# Returns the class name of this element (e.x. ResistorElm)
  toString: ->
    console.error("Virtual call on toString in circuitComponent was #{@constructor.name}")
#      return arguments.callee.name

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

  getBoundingBox: ->
    @boundingBox

  setBbox: (x1, y1, x2, y2) ->
    x = Math.min(x1, x2)
    y = Math.min(y1, y2)
    width = Math.abs(x2 - x1) + 1
    height = Math.abs(y2 - y1) + 1

    @boundingBox = new Rectangle(x, y, width, height)

  setBboxPt: (p1, p2, width) ->
    deltaX = (@dpx1 * width)
    deltaY = (@dpy1 * width)

    @setBbox p1.x - deltaX, p1.y - deltaY, p1.x + deltaX, p1.y + deltaY

# Extended by subclasses
  getInfo: (arr) ->
    arr = new Array(15)

# Extended by subclasses
  getBasicInfo: (arr) ->
    arr[1] = "I = " + @getUnitText(@getCurrent(), "A")
    arr[2] = "Vd = " + @getUnitText(@getVoltageDiff(), "V")
    3

  getScopeValue: (x) ->
    (if (x is 1) then @getPower() else @getVoltageDiff())

  getScopeUnits: (x) ->
    if (x is 1) then "W" else "V"

  getConnection: (n1, n2) ->
    true

  hasGroundConnection: (n1) ->
    false

  isWire: ->
    false

  canViewInScope: ->
    return @getPostCount() <= 2

#  needsHighlight: ->
#    @focused
#      @Circuit?.mouseElm is this or @selected

  needsShortcut: ->
    false

  ### #######################################################################
# RENDERING METHODS
  ### #######################################################################

  draw: (renderContext) ->
#    @curcount = @updateDotCount()

    renderContext.drawRect(@boundingBox.x, @boundingBox.y, @boundingBox.width, @boundingBox.height, 1, "#8888CC")

    renderContext.drawValue 10, 0, this, @constructor.name

    renderContext.drawCircle(@getCenter().x, @getCenter().y, 5, 0, "#FF0000")
#    renderContext.fillText(@boundingBox.x, @boundingBox.y, "Name: " + @constructor.name)

    @calcLeads 0

#    renderContext.drawValue 10, 0, this, @toString()

    renderContext.drawPosts(this, "#FF0000")

    for i in [0...@getPostCount()]
      post = @getPost(i)
      renderContext.drawCircle(post.x, post.y, 3, 0, "#FF00FF")

    renderContext.drawLeads(this)

    @updateDots(this)
    renderContext.drawDots(@point1, @point2, this)


  updateDots: (ds = Settings.CURRENT_SEGMENT_LENGTH) ->
    currentIncrement = @current * @Circuit.currentSpeed()
    @curcount = (@curcount + currentIncrement) % ds
    @curcount += ds if @curcount < 0

    @curcount

  getUnitText: (value, unit, decimalPoints = 2) ->
    absValue = Math.abs(value)
    return "0 " + unit  if absValue < 1e-18
    return (value * 1e15).toFixed(decimalPoints) + " f" + unit  if absValue < 1e-12
    return (value * 1e12).toFixed(decimalPoints) + " p" + unit  if absValue < 1e-9
    return (value * 1e9).toFixed(decimalPoints) + " n" + unit  if absValue < 1e-6
    return (value * 1e6).toFixed(decimalPoints) + " μ" + unit  if absValue < 1e-3
    return (value * 1e3).toFixed(decimalPoints) + " m" + unit  if absValue < 1
    return (value).toFixed(decimalPoints) + " " + unit  if absValue < 1e3
    return (value * 1e-3).toFixed(decimalPoints) + " k" + unit  if absValue < 1e6
    return (value * 1e-6).toFixed(decimalPoints) + " M" + unit  if absValue < 1e9
    (value * 1e-9).toFixed(decimalPoints) + " G" + unit

  comparePair: (x1, x2, y1, y2) ->
    (x1 == y1 && x2 == y2) || (x1 == y2 && x2 == y1)

    @Circuit.Params

  timeStep: ->
    @Circuit.timeStep()

  needsShortcut: ->
    false

  toJson: ->
    {
      x: @x1
      y: @y1
      x2: @x2
      y2: @y2
      flags: @flags
      nodes: @nodes
      params: @params
      selected: false
      voltSource: @getVoltageSource()
      needsShortcut: @needsShortcut()
      dump: @getDumpType().toString()
      postCount: @getPostCount()
      nonLinear: @nonLinear()
    }

  ## Deprecated

  getVoltageText: ->
    Maxwell.logger.warn("GET VOLTAGE TEXT IS DEPRECATED")
    "GET VOLTAGE TEXT IS DEPRECATED"

module.exports = CircuitComponent
