CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
DrawUtil = require('../../util/drawUtil.coffee')

class VoltageElm extends CircuitComponent
  @FLAG_COS: 2
  @WF_DC: 0
  @WF_AC: 1
  @WF_SQUARE: 2
  @WF_TRIANGLE: 3
  @WF_SAWTOOTH: 4
  @WF_PULSE: 5
  @WF_VAR: 6

  @circleSize: 17

  @ParameterDefinitions = {
    "waveform": {
      name: "none"
      default_value: 0
      data_type: parseInt
      range: [0, 6]
    },
    "frequency": {
      name: "Frequency"
      unit: "Hertz"
      default_value: 40
      symbol: "Hz"
      data_type: parseFloat
      range: [-Infinity, Infinity]
    },
    "maxVoltage": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 5
      data_type: parseFloat
      range: [-Infinity, Infinity]
    },
    "bias": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 0
      data_type: parseFloat
      range: [-Infinity, Infinity]
    },
    "phaseShift": {
      name: "degrees"
      unit: "degrees"
      default_value: 0
      symbol: "deg"
      data_type: parseFloat
      range: [-360, 360]
      type: parseFloat
    },
    "dutyCycle": {
      name: "percentage"
      unit: ""
      default_value: 0.5
      symbol: "%"
      data_type: parseFloat
      range: [0, 100]
      type: parseFloat
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    # Convert parameters to a maximum length of 7
    # [val1, ..., val2, "Some", "strings"] -> [val1, ..., val2, "Some strings"]
    if params instanceof Array && params.length > 6
      labels = params[6..params.length]

      params = params.slice(0, 6)
      params.push(labels.join(" "))

    if @flags & VoltageElm.FLAG_COS isnt 0
      @flags &= ~VoltageElm.FLAG_COS
      @phaseShift = Math.PI / 2

    super(xa, ya, xb, yb, params, f)

    @freqTimeZero = 0

    @reset()


  getDumpType: ->
    "v"

  reset: ->
    @freqTimeZero = 0
    @curcount = 0

  triangleFunc: (x) ->
    if x < Math.PI
      return x * (2 / Math.PI) - 1

    1 - (x - Math.PI) * (2 / Math.PI)

  stamp: (stamper) ->
#    console.log("\n::Stamping Voltage Elm #{@waveform}")
    if @waveform is VoltageElm.WF_DC
#      console.log("Get voltage: #{@getVoltage()}")
      stamper.stampVoltageSource @nodes[0], @nodes[1], @voltSource, @getVoltage()
    else
      stamper.stampVoltageSource @nodes[0], @nodes[1], @voltSource

  doStep: (stamper) ->
    unless @waveform is VoltageElm.WF_DC
      stamper.updateVoltageSource @nodes[0], @nodes[1], @voltSource, @getVoltage()

  getVoltage: ->
    omega = 2 * Math.PI * (@Circuit.time - @freqTimeZero) * @frequency + @phaseShift

    switch @waveform
      when VoltageElm.WF_DC
        @maxVoltage + @bias
      when VoltageElm.WF_AC
        Math.sin(omega) * @maxVoltage + @bias
      when VoltageElm.WF_SQUARE
        @bias + (if (omega % (2 * Math.PI) > (2 * Math.PI * @dutyCycle)) then -@maxVoltage else @maxVoltage)
      when VoltageElm.WF_TRIANGLE
        @bias + @triangleFunc(omega % (2 * Math.PI)) * @maxVoltage
      when VoltageElm.WF_SAWTOOTH
        @bias + (omega % (2 * Math.PI)) * (@maxVoltage / Math.PI) - @maxVoltage
      when VoltageElm.WF_PULSE
        if (omega % (2 * Math.PI)) < 1
          @maxVoltage + @bias
        else
          @bias
      else
        0


  setPoints: ->
    super()

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @updateDots()

    if(@waveform is VoltageElm.WF_DC or @waveform is VoltageElm.WF_VAR)
      @calcLeads 8
    else
      @calcLeads VoltageElm.circleSize * 2

    @setBbox @x1, @y2, @x2, @y2
    renderContext.drawLeads(this)

    if @waveform is VoltageElm.WF_DC
      renderContext.drawDots @point1, @point2, this
    else
      renderContext.drawDots(@point1, @lead1, this)
      renderContext.drawDots(@lead2, @point2, this)

    if @waveform is VoltageElm.WF_DC
      [ptA, ptB] = renderContext.interpolateSymmetrical @lead1, @lead2, 0, 10
      renderContext.drawLinePt @lead1, ptA, renderContext.getVoltageColor(@volts[0])
      renderContext.drawLinePt ptA, ptB, renderContext.getVoltageColor(@volts[0])

      @setBboxPt @point1, @point2, Settings.GRID_SIZE
      [ptA, ptB] = renderContext.interpolateSymmetrical @lead1, @lead2, 1, Settings.GRID_SIZE
      renderContext.drawLinePt ptA, ptB, renderContext.getVoltageColor(@volts[1])

    else
      @setBboxPt @point1, @point2, VoltageElm.circleSize
      ps1 = renderContext.interpolate @lead1, @lead2, 0.5
      @drawWaveform ps1, renderContext

    renderContext.drawPosts(this)



  drawWaveform: (center, renderContext) ->
#    color = if @needsHighlight() then Settings.FG_COLOR
    color = Settings.FG_COLOR

    #g.beginFill();
    #@setPowerColor false
    xc = center.x
    yc = center.y

    # TODO:
    renderContext.fillCircle xc, yc, VoltageElm.circleSize, 2, "#FFFFFF"

    #Main.getMainCanvas().drawThickCircle(xc, yc, circleSize, color);
    wl = 8
    @setBbox xc - VoltageElm.circleSize, yc - VoltageElm.circleSize, xc + VoltageElm.circleSize, yc + VoltageElm.circleSize
    xc2 = undefined
    switch @waveform
      when VoltageElm.WF_DC
        break

      when VoltageElm.WF_SQUARE
        xc2 = Math.floor(wl * 2 * @dutyCycle - wl + xc)
        xc2 = Math.max(xc - wl + 3, Math.min(xc + wl - 3, xc2))

        renderContext.drawLine xc - wl, yc - wl, xc - wl, yc, color
        renderContext.drawLine xc - wl, yc - wl, xc2, yc - wl, color
        renderContext.drawLine xc2, yc - wl, xc2, yc + wl, color
        renderContext.drawLine xc + wl, yc + wl, xc2, yc + wl, color
        renderContext.drawLine xc + wl, yc, xc + wl, yc + wl, color

      when VoltageElm.WF_PULSE
        yc += wl / 2

        renderContext.context.strokeStyle = '#FF0000'

#        renderContext.drawThickLine xc - wl, yc - wl, xc - wl, yc, color   # Left vertical
#        renderContext.drawThickLine xc - wl, yc - wl, xc - wl / 2, yc - wl, color
#        renderContext.drawThickLine xc - wl / 2, yc - wl, xc - wl / 2, yc, color
#        renderContext.drawThickLine xc - wl / 2, yc, xc + wl, yc, color

        renderContext.context.stroke()
        renderContext.context.moveTo xc - wl, yc

        renderContext.context.lineTo xc - wl, yc - wl
        renderContext.context.moveTo xc - wl, yc - wl

#        renderContext.context.lineTo xc - wl / 2, yc - wl
#        renderContext.context.moveTo xc - wl / 2, yc - wl

#        renderContext.context.lineTo xc - wl / 2, yc - wl, xc - wl / 2, yc, color
#        renderContext.context.lineTo xc - wl / 2, yc, xc + wl, yc, color
        renderContext.context.closePath()

      when VoltageElm.WF_SAWTOOTH
        renderContext.drawLine xc, yc - wl, xc - wl, yc, color
        renderContext.drawLine xc, yc - wl, xc, yc + wl, color
        renderContext.drawLine xc, yc + wl, xc + wl, yc, color

      when VoltageElm.WF_TRIANGLE
        xl = 5
        renderContext.drawLine xc - xl * 2, yc, xc - xl, yc - wl, color
        renderContext.drawLine xc - xl, yc - wl, xc, yc, color
        renderContext.drawLine xc, yc, xc + xl, yc + wl, color
        renderContext.drawLine xc + xl, yc + wl, xc + xl * 2, yc, color

      when VoltageElm.WF_AC
        xl = 10
        ox = -1
        oy = -1

        i = -xl
        while i <= xl
          yy = yc + Math.floor(0.95 * Math.sin(i * Math.PI / xl) * wl)
          if ox != -1
            renderContext.drawLine ox, oy, xc + i, yy, color
          ox = xc + i
          oy = yy
          i++

    renderContext.drawCircle xc, yc, VoltageElm.circleSize, 2, "#000000"

    if Settings.SHOW_VALUES
      valueString = @getUnitText(@frequency, "Hz")

#      if @axisAligned
#        @drawValues valueString, VoltageElm.circleSize

  getVoltageSourceCount: ->
    1

  getPower: ->
    -@getVoltageDiff() * @current

  getVoltageDiff: ->
    @volts[1] - @volts[0]

  getInfo: (arr) ->
    switch @waveform
      when VoltageElm.WF_DC, VoltageElm.WF_VAR
        arr[0] = "voltage source"
      when VoltageElm.WF_AC
        arr[0] = "A/C source"
      when VoltageElm.WF_SQUARE
        arr[0] = "square wave gen"
      when VoltageElm.WF_PULSE
        arr[0] = "pulse gen"
      when VoltageElm.WF_SAWTOOTH
        arr[0] = "sawtooth gen"
      when VoltageElm.WF_TRIANGLE
        arr[0] = "triangle gen"

    arr[1] = "I = " + @getUnitText(@getCurrent(), "A")
#      arr[2] = ((if (this instanceof RailElm) then "V = " else "Vd = ")) + DrawHelper.getVoltageText(@getVoltageDiff())

    if @waveform isnt VoltageElm.WF_DC and @waveform isnt VoltageElm.WF_VAR
      arr[3] = "f = " + @getUnitText(@frequency, "Hz")
      arr[4] = "Vmax = " + @getUnitText(@maxVoltage, "V")
      i = 5
      unless @bias is 0
        arr[i++] = "Voff = " + @getVoltageText(@bias)
      else arr[i++] = "wavelength = " + @getUnitText(2.9979e8 / @frequency, "m")  if @frequency > 500
      arr[i++] = "P = " + @getUnitText(@getPower(), "W")

  toString: ->
    "VoltageElm"


module.exports = VoltageElm
