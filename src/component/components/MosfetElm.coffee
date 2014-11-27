# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitComponent'
], (
Settings,
DrawHelper,
Polygon,
Rectangle,
Point,

CircuitComponent
) ->
  # </DEFINE>

  class JFetElm

  class MosfetElm extends CircuitComponent

    @FLAG_PNP: 1
    @FLAG_SHOWVT: 2
    @FLAG_DIGITAL: 4

    constructor: (xa, ya, xb, yb, f, st) ->
      super(xa, ya, xb, yb, f, st)

      @lastv1 = 0
      @lastv2 = 0
      @ids = 0
      @mode = 0
      @gm = 0

      @vt = 1.5
      @pcircler = 3
      @src = [] # Array of points
      @drn = [] # Array of points
      @gate = []
      @pcircle = []

      @pnp = (if ((f & MosfetElm.FLAG_PNP) isnt 0) then -1 else 1)
      @noDiagonal = true
      @vt = @getDefaultThreshold()

      @hs = 16

      if st and st.length > 0
        st = st.split(" ") if typeof st is "string"
        @vt ||= st[0]

    getDefaultThreshold: ->
      1.5

    getBeta: ->
      .02

    nonLinear: ->
      true

    toString: ->
      "MosfetElm"

    drawDigital: ->
      (@flags & MosfetElm.FLAG_DIGITAL) isnt 0

    reset: ->
      @lastv1 = @lastv2 = @volts[0] = @volts[1] = @volts[2] = @curcount = 0

    dump: ->
      super() + " " + @vt

    getDumpType: ->
      "f"

    draw: (renderContext) ->
      @setBboxPt @point1, @point2, @hs

      color = DrawHelper.getVoltageColor(@volts[1])
      renderContext.drawThickLinePt @src[0], @src[1], color

      color = DrawHelper.getVoltageColor(@volts[2])
      renderContext.drawThickLinePt @drn[0], @drn[1], color

      segments = 6
#      @setPowerColor true
      segf = 1.0 / segments
      for i in [0...segments]
        v = @volts[1] + (@volts[2] - @volts[1]) * i / segments
        color = DrawHelper.getVoltageColor(v)
        ps1 = DrawHelper.interpPoint @src[1], @drn[1], i * segf
        ps2 = DrawHelper.interpPoint @src[1], @drn[1], (i + 1) * segf
        renderContext.drawThickLinePt ps1, ps2, color

      color = DrawHelper.getVoltageColor(@volts[1])
      renderContext.drawThickLinePt @src[1], @src[2], color

      color = DrawHelper.getVoltageColor(@volts[2])
      renderContext.drawThickLinePt @drn[1], @drn[2], color

      unless @drawDigital()
        color = DrawHelper.getVoltageColor((if @pnp is 1 then @volts[1] else @volts[2]))
        renderContext.drawThickPolygonP @arrowPoly, color

      renderContext.drawThickPolygonP(@arrowPoly);
#      Circuit.powerCheckItem

      #g.setColor(Color.gray);
      color = DrawHelper.getVoltageColor(@volts[0])
      renderContext.drawThickLinePt @point1, @gate[1], color
      renderContext.drawThickLinePt @gate[0], @gate[2], color
      @drawDigital() and @pnp is -1

      #Main.getMainCanvas().drawThickCircle(pcircle.x, pcircle.y, pcircler, Settings.FG_COLOR);
      #drawThickCircle(g, pcircle.x, pcircle.y, pcircler);
      unless (@flags & MosfetElm.FLAG_SHOWVT) is 0
        s = "" + (@vt * @pnp)

        #g.setColor(whiteColor);
        #g.setFont(unitsFont);
#        @drawCenteredText s, @x2 + 2, @y2, false

      #g.setColor(Color.white);
      #g.setFont(unitsFont);
#      ds = MathUtils.sign(@dx)  if (@needsHighlight() or Circuit.dragElm is this) and @dy is 0

      #        Main.getMainCanvas().drawString("G", gate[1].x - 10 * ds, gate[1].y - 5);
      #        Main.getMainCanvas().drawString(pnp == -1 ? "D" : "S", src[0].x - 3 + 9 * ds, src[0].y + 4);
      #        Main.getMainCanvas().drawString(pnp == -1 ? "S" : "D", drn[0].x - 3 + 9 * ds, drn[0].y + 4);
      #
      #        g.drawString("G", gate[1].x - 10 * ds, gate[1].y - 5);
      #        g.drawString(pnp == -1 ? "D" : "S", src[0].x - 3 + 9 * ds, src[0].y + 4); // x+6 if ds=1, -12 if -1
      #        g.drawString(pnp == -1 ? "S" : "D", drn[0].x - 3 + 9 * ds, drn[0].y + 4);
#      @curcount = @updateDotCount(-@ids, @curcount)
      @drawDots @src[0], @src[1], renderContext
      @drawDots @src[1], @drn[1], renderContext
      @drawDots @drn[1], @drn[0], renderContext
      @drawPosts(renderContext)

    getPost: (n) ->
      (if (n is 0) then @point1 else (if (n is 1) then @src[0] else @drn[0]))

    getCurrent: ->
      @ids

    getPower: ->
      @ids * (@volts[2] - @volts[1])

    getPostCount: ->
      3

    setPoints: ->
      super()
      # find the coordinates of the various points we need to draw
      # the MOSFET.
      hs2 = @hs * @dsign
      @src = CircuitComponent.newPointArray(3)
      @drn = CircuitComponent.newPointArray(3)

      [@src[0], @drn[0]] = DrawHelper.interpPoint2 @point1, @point2, 1, -hs2
      [@src[1], @drn[1]] = DrawHelper.interpPoint2 @point1, @point2, 1 - 22 / @dn, -hs2
      [@src[2], @drn[2]] = DrawHelper.interpPoint2 @point1, @point2, 1 - 22 / @dn, -hs2 * 4 / 3

      @gate = CircuitComponent.newPointArray(3)

      [@gate[0], @gate[2]] = DrawHelper.interpPoint2 @point1, @point2, 1 - 28 / @dn, hs2 / 2  #,  # was 1-20/dn
      @gate[1] = DrawHelper.interpPoint @gate[0], @gate[2], .5
      console.log("GATE: #{@gate[1]}")

      if !@drawDigital()
        if @pnp is 1
          @arrowPoly = DrawHelper.calcArrow(@src[1], @src[0], 10, 4)
        else
          @arrowPoly = DrawHelper.calcArrow(@drn[0], @drn[1], 12, 5)

      else if @pnp is -1
        @gate[1] = DrawHelper.interpPoint @point1, @point2, 1 - 36 / @dn
        dist = (if (@dsign < 0) then 32 else 31)

        @pcircle = DrawHelper.interpPoint(@point1, @point2, 1 - dist / @dn)
        @pcircler = 3

    stamp: (stamper) ->
      stamper.stampNonLinear @nodes[1]
      stamper.stampNonLinear @nodes[2]

    doStep: (stamper) ->
      vs = new Array(3)

      vs[0] = @volts[0]
      vs[1] = @volts[1]
      vs[2] = @volts[2]

      vs[1] = @lastv1 + .5  if vs[1] > @lastv1 + .5
      vs[1] = @lastv1 - .5  if vs[1] < @lastv1 - .5
      vs[2] = @lastv2 + .5  if vs[2] > @lastv2 + .5
      vs[2] = @lastv2 - .5  if vs[2] < @lastv2 - .5

      source_node = 1
      drain_node = 2

      if @pnp * vs[1] > @pnp * vs[2]
        source_node = 2
        drain_node = 1

      gate = 0

      vgs = vs[gate] - vs[source_node]
      vds = vs[drain_node] - vs[source_node]

      if Math.abs(@lastv1 - vs[1]) > .01 or Math.abs(@lastv2 - vs[2]) > .01
        @getParentCircuit().converged = false

      @lastv1 = vs[1]
      @lastv2 = vs[2]

      realvgs = vgs
      realvds = vds

      vgs *= @pnp
      vds *= @pnp

      @ids = 0
      @gm = 0
      Gds = 0
      beta = @getBeta()

      if vgs > .5 and this instanceof JFetElm
        Circuit.halt "JFET is reverse biased!", this
        return
      if vgs < @vt

        # should be all zero, but that causes a singular matrix,
        # so instead we treat it as a large resistor
        Gds = 1e-8
        @ids = vds * Gds
        @mode = 0
      else if vds < vgs - @vt

        # linear
        @ids = beta * ((vgs - @vt) * vds - vds * vds * .5)
        @gm = beta * vds
        Gds = beta * (vgs - vds - @vt)
        @mode = 1
      else
        # saturation; Gds = 0
        @gm = beta * (vgs - @vt)

        # use very small Gds to avoid nonconvergence
        Gds = 1e-8
        @ids = .5 * beta * (vgs - @vt) * (vgs - @vt) + (vds - (vgs - @vt)) * Gds
        @mode = 2

      rs = -@pnp * @ids + Gds * realvds + @gm * realvgs

      #console.log("M " + vds + " " + vgs + " " + ids + " " + gm + " "+ Gds + " " + volts[0] + " " + volts[1] + " " + volts[2] + " " + source + " " + rs + " " + this);
      stamper.stampMatrix @nodes[drain_node], @nodes[drain_node], Gds
      stamper.stampMatrix @nodes[drain_node], @nodes[source_node], -Gds - @gm
      stamper.stampMatrix @nodes[drain_node], @nodes[gate], @gm
      stamper.stampMatrix @nodes[source_node], @nodes[drain_node], -Gds
      stamper.stampMatrix @nodes[source_node], @nodes[source_node], Gds + @gm
      stamper.stampMatrix @nodes[source_node], @nodes[gate], -@gm
      stamper.stampRightSide @nodes[drain_node], rs
      stamper.stampRightSide @nodes[source_node], -rs

      @ids = -@ids  if (source_node is 2 and @pnp is 1) or (source_node is 1 and @pnp is -1)

    getFetInfo: (arr, n) ->
      arr[0] = ((if (@pnp is -1) then "p-" else "n-")) + n
      arr[0] += " (Vt = " + DrawHelper.getVoltageText(@pnp * @vt) + ")"
      arr[1] = ((if (@pnp is 1) then "Ids = " else "Isd = ")) + DrawHelper.getCurrentText(@ids)
      arr[2] = "Vgs = " + DrawHelper.getVoltageText(@volts[0] - @volts[(if @pnp is -1 then 2 else 1)])
      arr[3] = ((if (@pnp is 1) then "Vds = " else "Vsd = ")) + DrawHelper.getVoltageText(@volts[2] - @volts[1])
      arr[4] = (if (@mode is 0) then "off" else (if (@mode is 1) then "linear" else "saturation"))
      arr[5] = "gm = " + DrawHelper.getUnitText(@gm, "A/V")

    getInfo: (arr) ->
      @getFetInfo arr, "MOSFET"

    canViewInScope: ->
      true

    getVoltageDiff: ->
      @volts[2] - @volts[1]

    getConnection: (n1, n2) ->
      not (n1 is 0 or n2 is 0)
#
#    getEditInfo: (n) ->
#      return new EditInfo("Threshold Voltage", @pnp * @vt, .01, 5)  if n is 0
#      if n is 1
#        ei = new EditInfo("", 0, -1, -1)
#        ei.checkbox = "Digital Symbol" # new Checkbox("Digital Symbol", this.drawDigital());
#        return ei
#      null
#
#    setEditValue: (n, ei) ->
#      @vt = @pnp * ei.value  if n is 0
#      if n is 1
#        @flags = (if (ei.checkbox) then (@flags | MosfetElm.FLAG_DIGITAL) else (@flags & ~MosfetElm.FLAG_DIGITAL))
#        @setPoints()

  return MosfetElm