CircuitComponent = require("../circuitComponent.js")
Util = require('../../util/util.coffee')

class DiacElm extends CircuitComponent

  @Fields = {
    onresistance: {
      name: "On Resistance"
      data_type: parseFloat
    }
    offresistance: {
      name: "Off Resistance"
      data_type: parseFloat
    }
    breakdown: {
      name: "Breakdown Voltage"
      data_type: parseFloat
    }
    holdCurrent: {
      name: "Hold Current"
      data_type: parseFloat
    }
  }

  getDumpType: ->
    185

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getDumpType: ->
    "185"

  nonLinear: ->
    true

  setPoints: ->
    super
    @calcLeads(32)
    @ps3 = new Point()
    @ps4 = new Point()

  calculateCurrent: ->
    vd = @volts[0] - @volts[1]

    if state
      @current = vd / @onresistance
    else
      @current = vd / @offresistance

  draw: (renderContext) ->
    v1 = @volts[0]
    v2 = @volts[1]

    @setBbox(@point1, @point2, 6)
    @draw2Leads(g)

    renderContext.drawLeads(this)
    renderContext.drawPosts(this)

    @updateDots()


  startIteration: ->
    vd = @volts[0] - @volts[1]

    @state = false if (Math.abs(@current) < @holdcurrent)
    @state = true if (Math.abs(vd) > @breakdown)


  doStep: (stamper) ->
    if @state
      stamper.stampResistor(@nodes[0], @nodes[1], @onResistance)
    else
      stamper.stampResistor(@nodes[0], @nodes[1], @offResistance)

  stamp: (stamper) ->
    stamper.stampNonLinear(@nodes[0])
    stamper.stampNonLinear(@nodes[1])

  needsShortcut: ->
    false


module.exports = DiacElm
