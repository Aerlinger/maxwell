CircuitComponent = require("../CircuitComponent.coffee")
DiodeElm = require("./DiodeElm.coffee")
Util = require('../../util/util.coffee')

class LedElm extends DiodeElm

  @Fields = {
    colorR: {
      name: "Red Intensity"
      data_type: parseFloat
      default_value: 0
    }
    colorG: {
      name: "Green Intensity"
      data_type: parseFloat
      default_value: 0
    }
    colorB: {
      name: "Blue Intensity"
      data_type: parseFloat
      default_value: 0
    }
    fwdrop: {
      name: "Voltage drop"
      data_type: parseFloat
      default_value: DiodeElm.DEFAULT_DROP
    }
  }


  constructor: (xa, xb, ya, yb, params, f) ->
#    if (f & DiodeElm.FLAG_FWDROP) == 0
#      @fwdrop = 2.1024259

    super(xa, xb, ya, yb, params, f)

#    if (f & DiodeElm.FLAG_FWDROP) == 0
#      @fwdrop = 2.1024259

    @setup()

  getName: ->
    "LED"

  getDumpType: ->
    "162"

  setPoints: ->
    super()

    cr = 12
    @ledLead1 = Util.interpolate(@point1, @point2, 0.5 - cr / @dn)
    @ledLead2 = Util.interpolate(@point1, @point2, 0.5 + cr / @dn)
    @ledCenter = Util.interpolate(@point1, @point2, 0.5)

  needsShortcut: ->
    false

  draw: (renderContext) ->
    if (@needsHighlight() || this == @dragElm)
      super(renderContext)
      return

    voltageColor = Util.getVoltageColor(@volts[0])
    renderContext.drawLine(@point1, @ledLead1 voltageColor)

    voltageColor = Util.getVoltageColor(volts[0])
    renderContext.drawLine(@ledLead2, @point2, voltageColor)

    renderContext.setColor(Settings.GREY)
    int cr = 12

    renderContext.drawThickCircle(@ledCenter.x, @ledCenter.y, cr)


    # TODO: Finish color
    cr -= 4

    w = 255 * @current / .01

    if (w > 255)
      w = 255

#    Color cc = new Color((int) (colorR * w), (int) (colorG * w), (int) (colorB * w));

#    g.setColor(cc);
#    g.fillOval(ledCenter.x - cr, ledCenter.y - cr, cr * 2, cr * 2);

    @setBbox(@point1, @point2, cr)

    @updateDots()
    @renderContext.drawDots(@point1, @ledLead1, @curcount)
    @renderContext.drawDots(@point2, @ledLead2, -@curcount)

    @drawPosts(this)


module.exports = LedElm
