CircuitComponent = require("../CircuitComponent.coffee")
Util = require('../../util/util.coffee')
Point = require('../../geom/Point.coffee')
Settings = require('../../settings/settings.coffee')

class ChipElm extends CircuitComponent
  @FLAG_SMALL = 1
  @FLAG_FLIP_X = 1024
  @FLAG_FLIP_Y = 2148

  @SIDE_N = 0
  @SIDE_S = 1
  @SIDE_W = 2
  @SIDE_E = 3

  @Fields = {}

#  @Fields = {
#    bits: {
#      name: "Bits"
#      data_type: parseInt
#    }
#    volts: {
#      name: "Volts"
#      data_type: (x) -> x
#    }
#  }

  self = null

  # TODO: Need a better way of dealing with variable length params here
  constructor: (xa, xb, ya, yb, params, f) ->
    @flags = f
    @pins = []
    @bits = 0

    #console.log("ChipElm flags #{@flags} -> #{(f & ChipElm.FLAG_SMALL) != 0}")
    @setSize(if ((f & ChipElm.FLAG_SMALL) != 0) then 1 else 2)

    @params ||= {}

    if @needsBits()
      @bits = parseInt(params?.shift() || 0)
      @params['bits'] = @bits
    else
      @params['bits'] = 0

    if params
      if Object.prototype.toString.call( params ) == '[object Array]'
        initial_voltages = params
      else
        initial_voltages = params['volts']

    self = @
    @setupPins()

    super(xa, xb, ya, yb, {}, f)

    @noDiagonal = true
    numPosts = @getPostCount()

    for i in [0...numPosts]
      if !@pins[i]
        console.error("No pin found at #{i}")
        return


      if @pins[i].state
        @volts[i] = initial_voltages?.shift()
        @pins[i].value = @volts[i] > 2.5

    @params['volts'] = @volts


  inspect: ->
    paramValues = (val for key, val of @params)

    {
      sym: @getDumpType()
      x1: @point1.x
      y1: @point1.y
      x2: @point2.x
      y2: @point2.y

      csize: @csize
      cspc: @cspc
      cspc2: @cspc2
      flags: @flags
      pins: @pins
      params: paramValues
      voltage: @getVoltageDiff()
      current: @getCurrent()
    }


  setupPins: ->
    console.warn("setupPins() to be called from subclasses of ChipElm")

  execute: ->
    console.warn("execute() to be called from subclasses of ChipElm")

  getVoltageSourceCount: ->
    console.warn("getVoltageSourceCount() to be called from subclasses of ChipElm")

  getChipName: ->
    console.warn("getChipName() to be called from subclasses of ChipElm")

  getConnection: (n1, n2) ->
    false

  hasGroundConnection: (n1) ->
    @pins[n1].output

  reset: ->
    for i in [0...@getPostCount()]
      @pins[i].value = false
      @pins[i].curcount = 0
      @volts[i] = 0

    @lastClock = false

  needsBits: ->
    false

  setSize: (s) ->
    #console.log("#{@getName()} Set size: #{s}")
    @csize = s
    @cspc = 8 * s
    @cspc2 = @cspc * 2
    @flags = @flags & ~ChipElm.FLAG_SMALL
    @flags = @flags | (if (s == 1) then ChipElm.FLAG_SMALL else 0)

  getPost: (n) ->
    @pins[n].post

  setCurrent: (x, c) ->
    for i in [0...@getPostCount()]
      pin = @pins[i]
      if pin.output and pin.voltSource == x
        pin.current = c


  setVoltageSource: (j, vs) ->
    for i in [0...@getPostCount()]
      p = @pins[i]
      if (p.output && j--) == 0
        p.voltSource = vs
        return

    console.log("setVoltageSource failed for " + this + "j=#{j}, vs=#{vs}   #{@toJson()}")

  doStep: (stamper) ->
    for i in [0...@getPostCount()]
      p = @pins[i]
      if !p.output
        p.value = @volts[i] > 2.5

    @execute()

    for i in [0...@getPostCount()]
      p = @pins[i]
      if p.output
        stamper.updateVoltageSource(0, @nodes[i], p.voltSource, if p.value then 5 else 0)

  stamp: (stamper) ->
    for i in [0...@getPostCount()]
      p = @pins[i]

      if p.output
        stamper.stampVoltageSource(0, @nodes[i], p.voltSource)

  draw: (renderContext) ->
    @drawChip(renderContext)

    if CircuitComponent.DEBUG && @params['bits'] > 0
      super(renderContext)

  drawChip: (renderContext) ->
    renderContext.drawThickPolygon(@rectPointsX, @rectPointsY, Settings.STROKE_COLOR)

    for i in [0...@getPostCount()]
      if @pins[i]

        p = @pins[i]

        voltageColor = Util.getVoltageColor(@volts[i])

        a = p.post
        b = p.stub

        renderContext.drawLinePt(a, b, voltageColor)

        p.updateDots(@Circuit.Params.getCurrentMult())

        renderContext.drawDots(b, a, p)

        if (p.bubble)
          renderContext.drawCircle(p.bubbleX, p.bubbleY, 1, Settings.FILL_COLOR)
          renderContext.drawCircle(p.bubbleX, p.bubbleY, 3, Settings.STROKE_COLOR)

        renderContext.fillText(p.text, p.textloc.x-4, p.textloc.y+2)

        if p.lineOver
          ya = p.textloc.y - renderContext.context.measureText(p.text).height
          textWidth = renderContext.context.measureText(p.text).width + 2
          renderContext.drawLine(p.textloc.x, ya, p.textloc.x + textWidth, ya)

    if @clockPointsX && @clockPointsY
      renderContext.drawPolyline(@clockPointsX, @clockPointsY, 3)

    for i in [i...@getPostCount()]
      renderContext.drawPost(@pins[i].post.x, @pins[i].post.y, @nodes[i])

  setPoints: ->
#    if @x2 - @x1 > @sizeX*@cspc2 # dragging
#      @setSize(2)

    super

    hs = @cspc2
    x0 = @point1.x + @cspc2
    y0 = @point1.y

    xr = x0 - @cspc
    yr = y0 - @cspc
    xs = @sizeX * @cspc2
    ys = @sizeY * @cspc2

    @rectPointsX = [xr, xr + xs, xr + xs, xr]
    @rectPointsY = [yr, yr, yr + ys, yr + ys]

    @setBbox(xr, yr, @rectPointsX[2], @rectPointsY[2])

    for i in [0...@getPostCount()]
      p = @pins[i]

      if !p
        console.error("Cannot set pin at index #{i} because it is not defined (bits: #{@bits})")
        return

      if i >= @pins.length
        console.error("Pin index out of bounds: #{i}. @pins is length #{@pins.length} but there are #{@getPostCount()} posts")
        return

      if p.side == ChipElm.SIDE_N
        p.setPoint(x0, y0, 1, 0, 0, -1, 0, 0)
      else if p.side == ChipElm.SIDE_S
        p.setPoint(x0, y0, 1, 0, 0, 1, 0, ys - @cspc2)
      else if p.side == ChipElm.SIDE_W
        p.setPoint(x0, y0, 0, 1, -1, 0, 0, 0)
      else if p.side == ChipElm.SIDE_E
        p.setPoint(x0, y0, 0, 1, 1, 0, xs - @cspc2, 0)

  toJson: ->
    baseJson = super()

    baseJson['bits'] = @bits
    baseJson['pins'] = @pins.map (pin) -> pin.toJson()

    baseJson

  class Pin
    constructor: (@pos, @side, @text) ->
      @post = null
      @stub = null
      @textloc = null
      @voltSource = 0
      @bubbleX = 0
      @bubbleY = 0

      @lineOver = false
      @bubble = false
      @clock = false
      @output = false
      @value = false
      @state = false

      @curcount = 0
      @current = 0

    updateDots: (currentMult, ds = Settings.CURRENT_SEGMENT_LENGTH) ->
      @curcount ||= 0

      currentIncrement = @current * currentMult

      @curcount = (@curcount + currentIncrement) % ds
      @curcount += ds if @curcount < 0

      @curcount

    getName: ->
      self.getName()

    setPoint: (px, py, dx, dy, dax, day, sx, sy) ->
      if (self.flags & ChipElm.FLAG_FLIP_X) != 0
        dx = -dx
        dax = -dax
        px += self.cspc2 * (self.sizeX - 1)
        sx = -sx

      if (self.flags & ChipElm.FLAG_FLIP_Y) != 0
        dy = -dy
        day = -day
        py += self.cspc2 * (self.sizeY - 1)
        sy = -sy

      xa = Math.floor(px + self.cspc2 * dx * @pos + sx)
      ya = Math.floor(py + self.cspc2 * dy * @pos + sy)

#      console.log("SET POINT", px, py, dx, dy, dax, day, sx, sy, self.cspc2, @pos)

      @post = new Point(xa + dax * self.cspc2, ya + day * self.cspc2)
      @stub = new Point(xa + dax * self.cspc, ya + day * self.cspc)

      @textloc = new Point(xa, ya)

      if @bubble
        @bubbleX = xa + dax * 10 * self.csize
        @bubbleY = ya + day * 10 * self.csize

      if (@clock)
        clockPointsX = new Array(3)
        clockPointsY = new Array(3)

        clockPointsX[0] = xa + dax * self.cspc - dx * self.cspc / 2
        clockPointsY[0] = ya + day * self.cspc - dy * self.cspc / 2
        clockPointsX[1] = xa
        clockPointsY[1] = ya
        clockPointsX[2] = xa + dax * self.cspc + dx * self.cspc / 2
        clockPointsY[2] = ya + day * self.cspc + dy * self.cspc / 2

    toJson: ->
      {
        post: @post
        stub: @stub
        textloc: @textloc
        pos: @pos
        side: @side
        voltSource: @voltSource
        bubbleX: @bubbleX
        bubbleY: @bubbleY
        text: @text
        lineOver: @lineOver
        bubble: @bubble
        clock: @clock
        output: @output
        value: @value
        state: @state
      }

  @Pin = Pin

module.exports = ChipElm
