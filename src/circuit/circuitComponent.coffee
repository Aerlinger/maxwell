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
debug = require('debug')('circuitComponent')

_ = require("lodash")

sprintf = require("sprintf-js").sprintf

class CircuitComponent
  @DEBUG = true

  @Fields = {}

  constructor: (x1, y1, x2, y2, params, f = 0) ->
    @current = 0
    @flags = f || 0

    @setParameters(params)

    @voltSource = 0
    @noDiagonal = false
    @Circuit = null

    @component_id = Util.getRand(100000000) + (new Date()).getTime()

    @setPoints(x1, y1, x2, y2)

    @allocNodes()


  allocNodes: ->
    @nodes = Util.zeroArray(@getPostCount() + @getInternalNodeCount())
    @volts = Util.zeroArray(@getPostCount() + @getInternalNodeCount())


  setParameters: (component_params) ->
    if component_params && component_params.constructor is Array
      component_params = @convertParamsToHash(component_params)

    Fields = @constructor.Fields

    @params = @params || {}

    for param_name, definition of Fields
      default_value = definition.default_value
      data_type = definition.data_type

      if !Util.isFunction(data_type)
        console.error("data_type must be a function")

      # Parameter exists in our Fields attribute table...
      if component_params && (param_name of component_params)
        param_value = data_type(component_params[param_name])

        @setValue(param_name, param_value)

        delete component_params[param_name]

      # fallback to default value assigned in @Fields
      else
#        console.log("Assigning default value of #{default_value} for #{param_name} in #{@constructor.name} (was #{this[param_name]})")

        this[param_name] ||= data_type(default_value)
        @params[param_name] = this[param_name]

        if (this[param_name] == null || this[param_name] == undefined || isNaN(this[param_name]))
          debug("Parameter #{param_name} is unset: #{this[param_name]}!")

    unmatched_params = (param for param of component_params)

    if unmatched_params.length > 0
      console.error("The following parameters #{unmatched_params.join(" ")} do not belong in #{this}")
      throw new Error("Invalid params #{unmatched_params.join(" ")} assigned to #{this}")


  # Convert list of parameters to a hash, according to matching order in @Fields
  convertParamsToHash: (param_list) ->
    Fields = @constructor.Fields
    result = {}

    for i in [0...param_list.length]
      param_name = Object.keys(Fields)[i]
      param_value = param_list[i]

      if Fields[param_name]
        data_type = Fields[param_name].data_type
      else
        console.warn("Failed to load data_type #{data_type}: #{param_name}: #{param_value}")
        console.log(param_value)
        console.log("#{i}: param_name #{Fields}")

      if !data_type
        console.warn("No conversion found for #{data_type}")

      if !Util.isFunction(data_type)
        console.error("data_type #{data_type} is not a function!")

#      console.log(@getName(), param_name, param_value)
      result[param_name] = param_value

    return result

  getParentCircuit: ->
    return @Circuit

  setx1: (value) ->
    @point1.x = value
    
  sety1: (value) ->
    @point1.y = value
  
  setx2: (value) ->
    @point2.x = value
    
  sety2: (value) ->
    @point2.y = value
  
    
  x1: ->
    @point1.x

  y1: ->
    @point1.y
    
  x2: ->
    @point2.x

  y2: ->
    @point2.y
    
  dx: ->
    @point2.x - @point1.x

  dy: ->
    @point2.y - @point1.y

  dn: ->
    Math.sqrt(@dx() * @dx() + @dy() * @dy())

  dpx1: ->
    @dy() / @dn()

  dpy1: ->
    - @dx() / @dn()

  dsign: ->
    (if (@dy() is 0) then Math.sign(@dx()) else Math.sign(@dy()))

  setPoints: (x1, y1, x2, y2) ->
    #    @dx() = x2 - x1
    #    @dy() = y2 - y1

    #    @dn() = Math.sqrt(@dx() * @dx() + @dy() * @dy())
    #    @length = Math.sqrt(@dx() * @dx() + @dy() * @dy())
    #    @@dpx1() = @dy() / @dn()
    #    @dpy1 = -@dx() / @dn()

    #    @dsign() = (if (@dy() is 0) then Math.sign(@dx()) else Math.sign(@dy()))

    @point1 ||= new Point(x1, y1)
    @point2 ||= new Point(x2, y2)

    @recomputeBounds()

#    console.log("c", @point1.x)

  unitText: ->
    "?"

  height: ->
    Math.abs(@point2.y - @point1.y)

  width: ->
    Math.abs(@point2.x - @point1.x)

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
    @getVoltageDiff() * @getCurrent()

  calculateCurrent: ->
    # To be implemented by subclasses

  doStep: ->
    # To be implemented by subclasses

  orphaned: ->
    return @Circuit is null or @Circuit is undefined

  destroy: =>
    @Circuit.desolder(this)

  dump: ->
    tidyVoltage = Util.tidyFloat(@getVoltageDiff())
    tidyCurrent = Util.tidyFloat(@getCurrent())

    paramStr = (val for key, val of @params).join(" ")

    "[v #{tidyVoltage}, i #{tidyCurrent}]\t#{@getDumpType()} #{@point1.x} #{@point1.y} #{@point2.x} #{@point2.y}"

  startIteration: ->
    # Called on reactive elements such as inductors and capacitors.

  getPostAt: (x, y) ->
    for postIdx in [0...@getPostCount()]
      post = @getPost(postIdx)

      if post.x == x && post.y == y
        return post

  getPostVoltage: (post_idx) ->
    @volts[post_idx]

  setNodeVoltage: (node_idx, voltage) ->
    @volts[node_idx] = voltage
    @calculateCurrent()

  calcLeads: (len) ->
    if @dn() < len or len is 0
      @lead1 = @point1
      @lead2 = @point2
    else
      @lead1 = Util.interpolate(@point1, @point2, (@dn() - len) / (2 * @dn()))
      @lead2 = Util.interpolate(@point1, @point2, (@dn() + len) / (2 * @dn()))

  isVertical: ->
    Math.abs(@point1.x - @point2.x) < 0.01

  getCenter: ->
    centerX = (@point1.x + @point2.x) / 2.0
    centerY = (@point1.y + @point2.y) / 2.0

    return new Point(centerX, centerY)

  equalTo: (otherComponent) ->
    return @component_id == otherComponent.component_id

  drag: (newX, newY) ->
    newX = Util.snapGrid(newX)
    newY = Util.snapGrid(newY)

    if @noDiagonal
      if Math.abs(@point1.x - newX) < Math.abs(@point1.y - newY)
        newX = @point1.x
      else
        newY = @point1.y

    @point2.x = newX
    @point2.y = newY

#    @setPoints()

  move: (deltaX, deltaY) ->
    @point1.x += deltaX
    @point1.y += deltaY
    @point2.x += deltaX
    @point2.y += deltaY

    @recomputeBounds()

    if @getParentCircuit()
      @getParentCircuit().invalidate()

    @setPoints()

  moveTo: (x, y) ->
    deltaX = Util.snapGrid(x - @getCenter().x)
    deltaY = Util.snapGrid(y - @getCenter().y)

    @move(deltaX, deltaY)

  stamp: ->
    @Circuit.halt("Called abstract function stamp() in Circuit #{@getDumpType()}")

  inspect: ->
    paramValues = (val for key, val of @params)

    {
      sym: @getDumpType()
      x1: @point1.x
      y1: @point1.y
      x2: @point2.x
      xy: @point2.y
      params: paramValues
      voltage: @getVoltageDiff()
      current: @getCurrent()
    }

  toString: ->
    #    "#{@constructor.name} #{@point1.x} #{@point1.y} #{@point2.x} #{@point2.y}"
    @constructor.name

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

  getName: ->
    "#{@constructor.name}(#{@point1.x},#{@point1.y},#{@point2.x},#{@point2.y})"

  getNode: (nodeIdx) ->
    @nodes[nodeIdx]

  getVoltageForNode: (nodeIdx) ->
    subIdx = 0

    for node in @nodes
      if node == nodeIdx
        return @volts[subIdx]

      subIdx++


  getPost: (postIdx) ->
    if postIdx == 0
      return @point1
    else if postIdx == 1
      return @point2

  recomputeBounds: ->
    @setBbox(@point1.x, @point1.y, @point2.x, @point2.y)

  getBoundingBox: ->
    @boundingBox

  setBbox: (x1, y1, x2, y2) ->
    x = Math.min(x1, x2)
    y = Math.min(y1, y2)
    width = Math.max(Math.abs(x2 - x1), 3)
    height = Math.max(Math.abs(y2 - y1), 3)

    @boundingBox = new Rectangle(x, y, width, height)


  setBboxPt: (p1, p2, width) ->
    deltaX = (@dpx1() * width)
    deltaY = (@dpy1() * width)

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
    renderContext.drawRect(@boundingBox.x-2, @boundingBox.y-2, @boundingBox.width+2, @boundingBox.height+2, 0.5, "#8888CC")

#    renderContext.drawValue 10, -15, this, @constructor.name

    if @params
      height = 8
      i = 0
      for name, value in @params
        console.log(name, value);
        renderContext.drawValue 12, -15 + height * i, this, "#{name}: #{value}"
        i += 1

    outlineRadius = 7

#    nodeIdx = 0
#    for node in @nodes
#      if @point1 && @point2
#        renderContext.drawValue 25+10*nodeIdx, -10*nodeIdx, this, "#{node}-#{@getVoltageForNode(node)}"
#        nodeIdx += 1


    if @point1
      renderContext.drawCircle(@point1.x, @point1.y, outlineRadius-1, 1, 'rgba(0,0,255,0.7)')

    if @point2
      renderContext.drawCircle(@point1.x, @point1.y, outlineRadius-1, 1, 'rgba(0,0,255,0.5)')

    if @lead1
      renderContext.drawRect(@lead1.x-outlineRadius/2, @lead1.y-outlineRadius/2, outlineRadius, outlineRadius, 2, 'rgba(0,255,0,0.7)')

    if @lead2
      renderContext.drawRect(@lead2.x-outlineRadius/2, @lead2.y-outlineRadius/2, outlineRadius, outlineRadius, 2, 'rgba(0,255,0,0.7)')

    for postIdx in [0...@getPostCount()]
      post = @getPost(postIdx)
      renderContext.drawCircle(post.x, post.y, outlineRadius + 2, 1, 'rgba(255,0,255,0.5)')

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

  timeStep: ->
    @Circuit.timeStep()

  needsShortcut: ->
    false

  hash: ->
    "#{@constructor.name}#{@point1.x}#{@point1.y}#{@point2.x}#{@point2.y}"

  equals: (otherComponent) ->
    otherComponent.toString() == @toString()

  toJson: ->
    {
      x: @point1.x
      y: @point1.y
      x2: @point2.x
      y2: @point2.y
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
    {
      name: @getName()
      pos: [@point1.x, @point1.y, @point2.x, @point2.y]
      params: @params
      current: @getCurrent()
      voltDiff: @getVoltageDiff()
      power: @getPower()
    }

  setValue: (paramName, paramValue) ->
    if paramName not in @getParamNames()
      console.error("Error while setting param for #{@getName()}: #{paramName} is not a field in #{@getParamNames()}")

    this[paramName] = paramValue
    @params[paramName] = paramValue

  getParamNames: ->
    Object.keys(@constructor.Fields)

  ##
  # Returns the JSON metadata object for this field with an additional key/value pair for the assigned value.
  # Used externally to edit/update component values
  #
  # Eg:
  # voltageElm.getFieldWithValue("waveform")
  #
  # {
  #   name: "none"
  #   default_value: 0
  #   data_type: parseInt
  #   range: [0, 6]
  #   input_type: "select"
  #   select_values: ...
  #   value: 2  // Square wave
  # }
  #
  # @see @Fields
  getFieldWithValue: (param_name) ->
    param_value = @params[param_name]

    field_metadata = {}

    for key, value of @constructor.Fields[param_name]
      unless key == "data_type"
        field_metadata[key] = value

    field_metadata['value'] = param_value

    field_metadata


  onSolder: (circuit) ->

  onclick: ->

module.exports = CircuitComponent
