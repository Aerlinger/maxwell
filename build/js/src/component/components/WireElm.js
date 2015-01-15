(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var WireElm;
    WireElm = (function(_super) {
      __extends(WireElm, _super);

      function WireElm(xa, ya, xb, yb, f, st) {
        WireElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      }

      WireElm.prototype.toString = function() {
        return "WireElm";
      };

      WireElm.FLAG_SHOWCURRENT = 1;

      WireElm.FLAG_SHOWVOLTAGE = 2;

      WireElm.prototype.draw = function(renderContext) {
        var s;
        renderContext.drawThickLinePt(this.point1, this.point2, DrawHelper.getVoltageColor(this.volts[0]));
        this.setBboxPt(this.point1, this.point2, 3);
        if (this.mustShowCurrent()) {
          s = DrawHelper.getUnitText(Math.abs(this.getCurrent()), "A");
          this.drawValues(s, 4, renderContext);
        } else if (this.mustShowVoltage()) {
          s = DrawHelper.getUnitText(this.volts[0], "V");
        }
        this.drawValues(s, 4, renderContext);
        this.drawPosts(renderContext);
        return this.drawDots(this.point1, this.point2, renderContext);
      };

      WireElm.prototype.stamp = function(stamper) {
        console.log("\nStamping Wire Elm");
        return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
      };

      WireElm.prototype.mustShowCurrent = function() {
        return (this.flags & WireElm.FLAG_SHOWCURRENT) !== 0;
      };

      WireElm.prototype.mustShowVoltage = function() {
        return (this.flags & WireElm.FLAG_SHOWVOLTAGE) !== 0;
      };

      WireElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      WireElm.prototype.getInfo = function(arr) {
        WireElm.__super__.getInfo.call(this);
        arr[0] = "Wire";
        arr[1] = "I = " + DrawHelper.getCurrentDText(this.getCurrent());
        return arr[2] = "V = " + DrawHelper.getVoltageText(this.volts[0]);
      };

      WireElm.prototype.getEditInfo = function(n) {};

      WireElm.prototype.setEditValue = function(n, ei) {};

      WireElm.prototype.getDumpType = function() {
        return "w";
      };

      WireElm.prototype.getPower = function() {
        return 0;
      };

      WireElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      WireElm.prototype.isWire = function() {
        return true;
      };

      WireElm.prototype.needsShortcut = function() {
        return true;
      };

      return WireElm;

    })(CircuitComponent);
    return WireElm;
  });

}).call(this);
