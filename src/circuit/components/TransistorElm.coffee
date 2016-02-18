CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class TransistorElm extends CircuitComponent
  @FLAG_FLIP: 1

  @Fields = {
    "pnp": {
      name: "Polarity"
      description: "Current multiplier"
      default_value: -1
      data_type: Math.sign
      field_type: "select"
      select_values: { "NPN": -1, "PNP": 1 }
    },
    "lastvbe": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 0
      data_type: parseFloat
      type: "physical"
    }
    "lastvbc": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 0
      data_type: parseFloat
    },
    "beta": {
      name: "beta"
      description: "Current multiplier"
      default_value: 100
      data_type: parseFloat
      range: [0, Infinity]
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    # Forward declarations:
    @beta = 100
    @rect = [] # Array of points
    @coll = [] # Array of points
    @emit = [] # Array of points
    @base = new Point() # Single point
    @pnp = 0
    @gmin = 0
    @ie = 0
    @ic = 0
    @ib = 0

#      @curcount_c = 0
#      @curcount_e = 0
#      @curcount_b = 0

    @rectPoly = 0
    @arrowPoly = 0
    @vt = .025
    @vdcoef = 1 / @vt
    @rgain = .5
    @lastvbc = 0
    @lastvbe = 0
    @leakage = 1e-13

    @renderSize = 16

    super(xa, ya, xb, yb, params, f)

#    if params and params.length > 0
#      params = params.split(" ") if typeof params is "string"
#
#      pnp = params.shift()
#      @pnp = parseInt(pnp) if pnp
#
#      lastvbe = params.shift()
#      @lastvbe = parseFloat(lastvbe) if lastvbe
#
#      lastvbc = params.shift()
#      @lastvbc = parseFloat(lastvbc) if lastvbc
#
#      beta = params.shift()
#      @beta = parseFloat(beta) if beta

    @volts[0] = 0
    @volts[1] = -@lastvbe
    @volts[2] = -@lastvbc

    @setup()

    # TOOD: non-standard  method for setting param
    @params = {
      "beta": @beta
      "pnp": @pnp
      "volts": @volts
    }
#    @params["beta"] = @beta
#    @params["pnp"] = @pnp
#    @params["volts"] = @volts

  setup: ->
    @vcrit = @vt * Math.log(@vt / (Math.sqrt(2) * @leakage))
    @fgain = @beta / (@beta + 1)
    @noDiagonal = true

  nonLinear: ->
    true

  reset: ->
    @volts[0] = @volts[1] = @volts[2] = 0
    @lastvbc = @lastvbe = @curcount_c = @curcount_e = @curcount_b = 0

  getDumpType: ->
    "t"

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @dsign = -@dsign  unless (@flags & TransistorElm.FLAG_FLIP) is 0

    hs2 = @renderSize * @dsign * @pnp

    # calc collector, emitter posts
    @coll = Util.newPointArray(2)
    @emit = Util.newPointArray(2)

    [@coll[0], @emit[0]] = Util.interpolateSymmetrical @point1, @point2, 1, hs2

    # calc rectangle edges
    @rect = Util.newPointArray(4)
    [@rect[0], @rect[1]] = Util.interpolateSymmetrical @point1, @point2, 1 - 16 / @dn, @renderSize
    [@rect[2], @rect[3]] = Util.interpolateSymmetrical @point1, @point2, 1 - 13 / @dn, @renderSize

    # calc points where collector/emitter leads contact rectangle
    [@coll[1], @emit[1]] = Util.interpolateSymmetrical @point1, @point2, 1 - 13 / @dn, 6 * @dsign * @pnp

    # calc point where base lead contacts rectangle
    @base = Util.interpolate @point1, @point2, 1 - @renderSize / @dn

    # rectangle
    @rectPoly = Util.createPolygon(@rect[0], @rect[2], @rect[3], @rect[1])

    # arrow
    unless @pnp is 1
      pt = Util.interpolateSymmetrical(@point1, @point2, 1 - 11 / @dn, -5 * @dsign * @pnp)
      @arrowPoly = Util.calcArrow(@emit[0], pt, 8, 4)

    @setBboxPt @point1, @point2, @renderSize

    # draw collector
    color = Util.getVoltageColor(@volts[1])
    renderContext.drawLinePt @coll[0], @coll[1], color

    # draw emitter
    color = Util.getVoltageColor(@volts[2])
    renderContext.drawLinePt @emit[0], @emit[1], color

    # draw arrow
    #g.setColor(lightGrayColor);
    renderContext.drawThickPolygonP @arrowPoly

    # draw base
    color = Util.getVoltageColor(@volts[0])
#      g.setColor Color.gray  if Circuit.powerCheckItem
    renderContext.drawLinePt @point1, @base, color

    # draw dots
#      @curcount_b = @updateDotCount(-@ib, @curcount_b)
#      @drawDots @base, @point1, @curcount_b
#      @curcount_c = @updateDotCount(-@ic, @curcount_c)
#      @drawDots @coll[1], @coll[0], @curcount_c
#      @curcount_e = @updateDotCount(-@ie, @curcount_e)
#      @drawDots @emit[1], @emit[0], @curcount_e

    # draw dots
    renderContext.drawDots @base, @point1, this
    renderContext.drawDots @coll[1], @coll[0], this
    renderContext.drawDots @emit[1], @emit[0], this

    color = Util.getVoltageColor(@volts[0])
#      @setPowerColor true

    #g.fillPolygon(rectPoly);
    renderContext.drawThickPolygonP @rectPoly, color

#      if (@needsHighlight() or Circuit.dragElm is this) and @dy is 0
#        g.setColor(Color.white);
#        g.setFont(this.unitsFont);
#        CircuitComponent.setColor Color.white
#
#        ds = MathUtils.sign(@dx)
#        @drawCenteredText "B", @base.x1 - 10 * ds, @base.y - 5, Color.WHITE
#        @drawCenteredText "C", @coll[0].x1 - 3 + 9 * ds, @coll[0].y + 4, Color.WHITE # x+6 if ds=1, -12 if -1
#        @drawCenteredText "E", @emit[0].x1 - 3 + 9 * ds, @emit[0].y + 4, Color.WHITE

    renderContext.drawPosts(this)

  getPost: (n) ->
    if (n is 0)
      @point1
    else if (n is 1)
      @coll[0]
    else
      @emit[0]

  getPostCount: ->
    3

  getPower: ->
    (@volts[0] - @volts[2]) * @ib + (@volts[1] - @volts[2]) * @ic

  setPoints: (stamper) ->
    super()

    hs = @renderSize

    if @flags & TransistorElm.FLAG_FLIP != 0
      @dsign = -@dsign

    hs2 = hs * @dsign * @pnp

    @coll = Util.newPointArray(2)
    @emit = Util.newPointArray(2)

    [@coll[0], @emit[0]] = Util.interpolateSymmetrical(@point1, @point2, 1, hs2)

    @rect = Util.newPointArray(4)

    [@rect[0], @rect[1]] = Util.interpolateSymmetrical(@point1, @point2, 1 - 16/@dn, hs)
    [@rect[2], @rect[3]] = Util.interpolateSymmetrical(@point1, @point2, 1 - 13/@dn, hs)
    [@coll[1], @emit[1]] = Util.interpolateSymmetrical(@point1, @point2, 1 - 13/@dn, 6 * @dsign * @pnp)

    @base = Util.interpolateSymmetrical(@point1, @point2, 1 - 16 / @dn)

    @rectPoly = Util.createPolygonFromArray(@rect)

    if @pnp == 1
      @arrowPoly = Util.calcArrow(@emit[1], @emit[0], 8, 4)
    else
      pt = Util.interpolate(@point1, @point2, 1 - 11 / @dn, -5 * @dsign * @pnp)
#      console.log(pt)
#      console.log(@emit)

      @arrowPoly = Util.calcArrow(@emit[0], pt, 8, 4)

  limitStep: (vnew, vold) ->
    arg = 0  # TODO
    oo = vnew

    if vnew > @vcrit and Math.abs(vnew - vold) > (@vt + @vt)
      if vold > 0
        arg = 1 + (vnew - vold) / @vt
        if arg > 0
          vnew = vold + @vt * Math.log(arg)
        else
          vnew = @vcrit
      else
        vnew = @vt * Math.log(vnew / @vt)
      @getParentCircuit().Solver.converged = false

    #console.log(vnew + " " + oo + " " + vold);
    vnew

  stamp: (stamper) ->
    stamper.stampNonLinear @nodes[0]
    stamper.stampNonLinear @nodes[1]
    stamper.stampNonLinear @nodes[2]

  doStep: (stamper) ->
    subIterations = @getParentCircuit().Solver.subIterations

    vbc = @volts[0] - @volts[1] # typically negative
    vbe = @volts[0] - @volts[2] # typically positive

    # .01
    if Math.abs(vbc - @lastvbc) > .01 or Math.abs(vbe - @lastvbe) > .01
      @getParentCircuit().Solver.converged = false
    @gmin = 0
    if subIterations > 100

      # if we have trouble converging, put a conductance in parallel with all P-N junctions.
      # Gradually increase the conductance value for each iteration.
      @gmin = Math.exp(-9 * Math.log(10) * (1 - subIterations / 3000.0))
      @gmin = .1  if @gmin > .1

    #console.log("T " + vbc + " " + vbe + "\n");
    vbc = @pnp * @limitStep(@pnp * vbc, @pnp * @lastvbc)
    vbe = @pnp * @limitStep(@pnp * vbe, @pnp * @lastvbe)
    @lastvbc = vbc
    @lastvbe = vbe
    pcoef = @vdcoef * @pnp
    expbc = Math.exp(vbc * pcoef)

    #if (expbc > 1e13 || Double.isInfinite(expbc))
    #     expbc = 1e13;
    expbe = Math.exp(vbe * pcoef)
    expbe = 1 if expbe < 1

    #if (expbe > 1e13 || Double.isInfinite(expbe))
    #     expbe = 1e13;
    @ie = @pnp * @leakage * (-(expbe - 1) + @rgain * (expbc - 1))
    @ic = @pnp * @leakage * (@fgain * (expbe - 1) - (expbc - 1))
    @ib = -(@ie + @ic)

    #console.log("gain " + ic/ib);
    #console.log("T " + vbc + " " + vbe + " " + ie + " " + ic + "\n");
    gee = -@leakage * @vdcoef * expbe
    gec = @rgain * @leakage * @vdcoef * expbc
    gce = -gee * @fgain
    gcc = -gec * (1 / @rgain)

    # console.log("gee = " + gee + "\n");
    # console.log("gec = " + gec + "\n");
    # console.log("gce = " + gce + "\n");
    # console.log("gcc = " + gcc + "\n");
    # console.log("gce+gcc = " + (gce+gcc) + "\n");
    # console.log("gee+gec = " + (gee+gec) + "\n");

    # stamps from page 302 of Pillage.  Node 0 is the base, node 1 the collector, node 2 the emitter.  Also stamp
    # minimum conductance (gmin) between b,e and b,c
    stamper.stampMatrix @nodes[0], @nodes[0], -gee - gec - gce - gcc + @gmin * 2
    stamper.stampMatrix @nodes[0], @nodes[1], gec + gcc - @gmin
    stamper.stampMatrix @nodes[0], @nodes[2], gee + gce - @gmin
    stamper.stampMatrix @nodes[1], @nodes[0], gce + gcc - @gmin
    stamper.stampMatrix @nodes[1], @nodes[1], -gcc + @gmin
    stamper.stampMatrix @nodes[1], @nodes[2], -gce
    stamper.stampMatrix @nodes[2], @nodes[0], gee + gec - @gmin
    stamper.stampMatrix @nodes[2], @nodes[1], -gec
    stamper.stampMatrix @nodes[2], @nodes[2], -gee + @gmin

    # we are solving for v(k+1), not delta v, so we use formula
    # 10.5.13, multiplying J by v(k)
    stamper.stampRightSide @nodes[0], -@ib - (gec + gcc) * vbc - (gee + gce) * vbe
    stamper.stampRightSide @nodes[1], -@ic + gce * vbe + gcc * vbc
    stamper.stampRightSide @nodes[2], -@ie + gee * vbe + gec * vbc

  getInfo: (arr) ->
    arr[0] = "transistor (" + ((if (@pnp is -1) then "PNP)" else "NPN)")) + " beta=" + @beta.toFixed(4)
    arr[0] = ""

    vbc = @volts[0] - @volts[1]
    vbe = @volts[0] - @volts[2]
    vce = @volts[1] - @volts[2]

    if vbc * @pnp > .2
      arr[1] = (if vbe * @pnp > .2 then "saturation" else "reverse active")
    else
      arr[1] = (if vbe * @pnp > .2 then "fwd active" else "cutoff")

    arr[2] = "Ic = " + Util.getUnitText(@ic, "A")
    arr[3] = "Ib = " + Util.getUnitText(@ib, "A")
    arr[4] = "Vbe = " +Util.getUnitText(vbe, "V")
    arr[5] = "Vbc = " +Util.getUnitText(vbc, "V")
    arr[6] = "Vce = " +Util.getUnitText(vce, "V")

  getScopeValue: (x) ->
    switch x
      when Oscilloscope.VAL_IB
        return @ib
      when Oscilloscope.VAL_IC
        return @ic
      when Oscilloscope.VAL_IE
        return @ie
      when Oscilloscope.VAL_VBE
        return @volts[0] - @volts[2]
      when Oscilloscope.VAL_VBC
        return @volts[0] - @volts[1]
      when Oscilloscope.VAL_VCE
        return @volts[1] - @volts[2]
    0

  getScopeUnits: (x) ->
    switch x
      when Oscilloscope.VAL_IB, Oscilloscope.VAL_IC, Oscilloscope.VAL_IE
        "A"
      else
        "V"

  canViewInScope: ->
    true

module.exports = TransistorElm
