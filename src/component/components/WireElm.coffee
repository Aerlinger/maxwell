# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point'

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

  class WireElm extends CircuitComponent
    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f, st

    toString: () ->
      "WireElm"
  
    @FLAG_SHOWCURRENT: 1
    @FLAG_SHOWVOLTAGE: 2
  
    draw: (renderContext) ->
      @doDots(renderContext)
      renderContext.drawThickLinePt @point1, @point2, DrawHelper.getVoltageColor(@volts[0])
      @setBboxPt @point1, @point2, 3
      if @mustShowCurrent()
        s = CircuitComponent.getShortUnitText(Math.abs(@getCurrent()), "A")
        @drawValues s, 4
      else if @mustShowVoltage()
        s = CircuitComponent.getShortUnitText(@volts[0], "V")
        @drawValues s, 4
      @drawPosts(renderContext)
  
    stamp: ->
      @Circuit.Solver.Stamper.stampVoltageSource @nodes[0], @nodes[1], @voltSource, 0
  
    mustShowCurrent: ->
      (@flags & WireElm.FLAG_SHOWCURRENT) isnt 0
  
    mustShowVoltage: ->
      (@flags & WireElm.FLAG_SHOWVOLTAGE) isnt 0
  
    getVoltageSourceCount: ->
      1
  
    getInfo: (arr) ->
      arr[0] = "Wire"
      arr[1] = "I = " + CircuitComponent.getCurrentDText(@getCurrent())
      arr[2] = "V = " + CircuitComponent.getVoltageText(@volts[0])
  
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
  
  return WireElm
