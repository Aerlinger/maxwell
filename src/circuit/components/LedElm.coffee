CircuitComponent = require("../CircuitComponent.coffee")
DiodeElm = require("./DiodeElm.coffee")
Util = require('../../util/util.coffee')
Settings = require('../../settings/Settings.coffee')

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
#    fwdrop: {
#      name: "Voltage drop"
#      data_type: parseFloat
#      default_value: DiodeElm.DEFAULT_DROP
#    }
  }


  constructor: (xa, xb, ya, yb, params, f) ->
    @params = {}

    #    if (f & DiodeElm.FLAG_FWDROP) == 0
    #      @fwdrop = 2.1024259

    if (f & DiodeElm.FLAG_FWDROP) == 0
      @fwdrop = 2.1024259  #DiodeElm.DEFAULT_DROP
      @params['fwdrop'] = 0.805904783
    else
      @fwdrop = parseFloat(params.shift())
      @params['fwdrop'] = @fwdrop

    super(xa, xb, ya, yb, params, f)
    @setPoints()

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
    voltageColor = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt(@point1, @ledLead1, voltageColor)

    voltageColor = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt(@ledLead2, @point2, voltageColor)

    cr = 12

    renderContext.drawCircle(@ledCenter.x, @ledCenter.y, cr, 2, Settings.PostColor)

    cr -= 4

    w = Math.min(255 * @current / .01, 255)

#    g.fillOval(ledCenter.x - cr, ledCenter.y - cr, cr * 2, cr * 2);
    console.log(@current, w)
    console.log("RBG: #{w * @colorR} #{w * @colorG} #{w * @colorB}")
    hexcolor = Util.rgb2hex(w * @colorR, w * @colorG, w * @colorB)

    renderContext.fillCircle(@ledCenter.x, @ledCenter.y, cr, 2, hexcolor)

    @updateDots()
    renderContext.drawDots(@point1, @ledLead1, @curcount)
    renderContext.drawDots(@point2, @ledLead2, -@curcount)

    renderContext.drawPosts(this)


module.exports = LedElm
