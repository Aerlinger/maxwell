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
Util = require('../util/util.coffee')

_ = require("lodash")

sprintf = require("sprintf-js").sprintf

class CircuitComponent
#  @DEBUG = true

  @ParameterDefinitions = {}

  constructor: (@x1, @y1, @x2, @y2, params, f = 0) ->
    @flags = f || 0

    @setParameters(params)

    @current = 0
#    @curcount = 0
    @voltSource = 0
    @noDiagonal = false
    @Circuit = null

    @component_id = Util.getRand(100000000) + (new Date()).getTime()

    console.log("POS: " + @x1, @y1, @x2, @y2)
    @setPoints()
    @recomputeBounds()

    @allocNodes()


  allocNodes: ->
    @nodes = Util.zeroArray(@getPostCount() + @getInternalNodeCount())
    @volts = Util.zeroArray(@getPostCount() + @getInternalNodeCount())


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

      if !data_type
        console.warn("No conversion found for #{data_type}")

      result[param_name] = data_type.call(this, param_value)

    return result

  setParameters: (component_params) ->
    if component_params && component_params.constructor is Array
      component_params = @convertParamsToHash(component_params)

    ParameterDefinitions = @constructor.ParameterDefinitions

    @params = {}

    for param_name, definition of ParameterDefinitions
      default_value = definition.default_value
      data_type = definition.data_type

      # Parameter exists in our ParameterDefinitions attribute table...
      if component_params && (param_name of component_params)
        param_value = data_type(component_params[param_name])

        this[param_name] = param_value
        @params[param_name] = param_value

        delete component_params[param_name]

      # fallback to default
      else
        console.log("Assigning default value of #{default_value} for #{param_name} in #{@constructor.name} (was #{this[param_name]})")

        this[param_name] ||= data_type(default_value)
        @params[param_name] = this[param_name]

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

    @dsign = (if (@dy is 0) then Math.sign(@dx) else Math.sign(@dy))

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
    @volts = Util.zeroArray(@volts.length)
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
    tidyVoltage = Util.tidyFloat(@getVoltageDiff())
    tidyCurrent = Util.tidyFloat(@getCurrent())

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
      @lead1 = Util.interpolate(@point1, @point2, (@dn - len) / (2 * @dn))
      @lead2 = Util.interpolate(@point1, @point2, (@dn + len) / (2 * @dn))

  isVertical: ->
    Math.abs(@x1 - @x2) < 0.01

  getCenter: ->
    centerX = (@point1.x + @point2.x) / 2.0
    centerY = (@point1.y + @point2.y) / 2.0

#    centerX = (@lead1.x + @lead2.x) / 2.0
#    centerY = (@point1.y + @point2.y) / 2.0

    return new Point(centerX, centerY)

  equalTo: (otherComponent) ->
    return @component_id == otherComponent.component_id

  drag: (newX, newY) ->
    newX = Util.snapGrid(newX)
    newY = Util.snapGrid(newY)

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

    @setBbox(@x1, @y1, @x2, @y2)

    if @getParentCircuit()
      @getParentCircuit().invalidate()

    @setPoints()

  moveTo: (x, y) ->
    deltaX = Util.snapGrid(x - @getCenter().x)
    deltaY = Util.snapGrid(y - @getCenter().y)

    @move(deltaX, deltaY)

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

  recomputeBounds: ->
    @setBbox(@x1, @y1, @x2, @y2)

  getBoundingBox: ->
    @boundingBox

  setBbox: (x1, y1, x2, y2) ->
    x = Math.min(x1, x2)
    y = Math.min(y1, y2)
    width = Math.abs(x2 - x1) + 3
    height = Math.abs(y2 - y1) + 3

#    if @isVertical()
#      width = 21
#      @boundingBox = new Rectangle(x - width/2, y, width, height)
#    else
#      height = 21
#      @boundingBox = new Rectangle(x, y - height/2, width, height)

    @boundingBox = new Rectangle(x-1, y-1, width, height)


  setBboxPt: (p1, p2, width) ->
    deltaX = (@dpx1 * width)
    deltaY = (@dpy1 * width)

    @setBbox p1.x - deltaX, p1.y - deltaY, p1.x + deltaX, p1.y + deltaY

# Extended by subclasses
  getInfo: (arr) ->
    arr = new Array(15)

# Extended by subclasses
  getBasicInfo: (arr) ->
    arr[1] = "I = " + Util.getUnitText(@getCurrent(), "A")
    arr[2] = "Vd = " + Util.getUnitText(@getVoltageDiff(), "V")
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

  needsShortcut: ->
    false

  ### #######################################################################
# RENDERING METHODS
  ### #######################################################################

  draw: (renderContext) ->
#    @curcount = @updateDotCount()

    renderContext.drawRect(@boundingBox.x, @boundingBox.y, @boundingBox.width, @boundingBox.height, 1, "#8888CC")

#    renderContext.drawValue 10, -15, this, @constructor.name

#    height = 8
#    i = 0
#    for name, value in @params
#      console.log(name, value);
#      renderContext.drawValue 12, -15 + height * i, this, "#{name}: #{value}"
#      i += 1

#    renderContext.drawCircle(@getCenter().x, @getCenter().y, 5, 0, "#FF0000")

#    @calcLeads 0

#    renderContext.drawPosts(this, "#FF0000")

#    for i in [0...@getPostCount()]
#      post = @getPost(i)
#      renderContext.drawCircle(post.x, post.y, 3, 0, "#FF00FF")

#    renderContext.drawLine(@point1.x-2, @point1.y-2, @point1.x+2, @point1.y+2, "#0000FF")
#    renderContext.drawLine(@point1.x-2, @point1.y+2, @point1.x-2, @point1.y-2, "#0000FF")
#    renderContext.drawLine(@point2.x-2, @point2.y-2, @point2.x+2, @point2.y+2, "#0000FF")
#    renderContext.drawLine(@point2.x-2, @point2.y+2, @point2.x-2, @point2.y-2, "#0000FF")
#
#    if @lead1 && @lead2
#      renderContext.drawLine(@lead1.x-2, @lead1.y-2, @lead1.x+2, @lead1.y+2, "#00FF00")
#      renderContext.drawLine(@lead1.x-2, @lead1.y+2, @lead1.x-2, @lead1.y-2, "#00FF00")
#      renderContext.drawLine(@lead2.x-2, @lead2.y-2, @lead2.x+2, @lead2.y+2, "#00FF00")
#      renderContext.drawLine(@lead2.x-2, @lead2.y+2, @lead2.x-2, @lead2.y-2, "#00FF00")

    renderContext.drawLeads(this)

#    @updateDots(this)
#    renderContext.drawDots(@point1, @point2, this)

  updateDots: (ds = Settings.CURRENT_SEGMENT_LENGTH) ->
    if @Circuit
      @curcount ||= 0

      currentIncrement = @current * @Circuit.Params.getCurrentMult()

      @curcount = (@curcount + currentIncrement) % ds
      @curcount += ds if @curcount < 0

      @curcount

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

  getProperties: ->
    result = []
    for parameter, value of @params
      result.push("#{parameter}: #{value}")

    result


  onSolder: ->

  onclick: ->

  ## Deprecated

  getVoltageText: ->
    Maxwell.logger.warn("GET VOLTAGE TEXT IS DEPRECATED")
    "GET VOLTAGE TEXT IS DEPRECATED"

module.exports = CircuitComponent
