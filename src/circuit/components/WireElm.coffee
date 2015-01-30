Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class WireElm extends CircuitComponent
  constructor: (xa, ya, xb, yb, f, params) ->
    super(xa, ya, xb, yb, f, params)

  toString: ->
    "WireElm"

  @FLAG_SHOWCURRENT: 1
  @FLAG_SHOWVOLTAGE: 2

  draw: (renderContext) ->
    renderContext.drawThickLinePt @point1, @point2, DrawHelper.getVoltageColor(@volts[0])
    @setBboxPt @point1, @point2, 3

    if @mustShowCurrent()
      s = DrawHelper.getUnitText(Math.abs(@getCurrent()), "A")
      @drawValues s, 4, renderContext
    else if @mustShowVoltage()
      s = DrawHelper.getUnitText(@volts[0], "V")

    @drawValues s, 4, renderContext
    @drawPosts(renderContext)

    @drawDots(@point1, @point2, renderContext)


  stamp: (stamper) ->
#    console.log("\nStamping Wire Elm")
    stamper.stampVoltageSource @nodes[0], @nodes[1], @voltSource, 0

  mustShowCurrent: ->
    (@flags & WireElm.FLAG_SHOWCURRENT) isnt 0

  mustShowVoltage: ->
    (@flags & WireElm.FLAG_SHOWVOLTAGE) isnt 0

  getVoltageSourceCount: ->
    1

  getInfo: (arr) ->
    super()

    arr[0] = "Wire"
    arr[1] = "I = " + DrawHelper.getCurrentDText(@getCurrent())
    arr[2] = "V = " + DrawHelper.getVoltageText(@volts[0])

  getEditInfo: (n) ->
  # TODO:
  #    if(n==0) {
  #        var ei:EditInfo = new EditInfo("", 0, -1, -1);
  #        //ei.checkbox = new Checkbox("Show Current", mustShowCurrent());
  #        return ei;
  #    }
  #    if( n==1) {
  #        var ei:EditInfo = new EditInfo("", 0, -1, -1);
  #        //ei.checkbox = new Checkbox("Show Voltage", mustShowVoltage());
  #        return ei;
  #    }
  #    return null;
  setEditValue: (n, ei) ->
  # TODO:
  #    if(n==0) {
  #        if(ei.isChecked)
  #            flags = FLAG_SHOWCURRENT;
  #        else
  #            flags &= ~FLAG_SHOWCURRENT;
  #    }
  #    if( n==1 ) {
  #        if(ei.isChecked)
  #            flags = FLAG_SHOWVOLTAGE;
  #        else
  #            flags &- ~FLAG_SHOWVOLTAGE;
  #    }
  getDumpType: ->
    "w"

  getPower: ->
    0

  getVoltageDiff: ->
    @volts[0]

  isWire: ->
    true

  needsShortcut: ->
    true

module.exports = WireElm
