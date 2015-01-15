(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var CurrentElm;
    CurrentElm = (function(_super) {
      __extends(CurrentElm, _super);

      function CurrentElm(xa, ya, xb, yb, f, st) {
        var e;
        CurrentElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        try {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.currentValue || (this.currentValue = parseFloat(st[0]));
        } catch (_error) {
          e = _error;
          this.currentValue = .01;
        }
      }

      CurrentElm.prototype.dump = function() {
        return CurrentElm.__super__.dump.call(this) + " " + this.currentValue;
      };

      CurrentElm.prototype.getDumpType = function() {
        return "i";
      };

      CurrentElm.prototype.setPoints = function() {
        var p2;
        CurrentElm.__super__.setPoints.call(this);
        this.calcLeads(26);
        this.ashaft1 = DrawHelper.interpPoint(this.lead1, this.lead2, .25);
        this.ashaft2 = DrawHelper.interpPoint(this.lead1, this.lead2, .6);
        this.center = DrawHelper.interpPoint(this.lead1, this.lead2, .5);
        p2 = DrawHelper.interpPoint(this.lead1, this.lead2, .75);
        return this.arrow = DrawHelper.calcArrow(this.center, p2, 4, 4);
      };

      CurrentElm.prototype.draw = function(renderContext) {
        var color, cr;
        cr = 12;
        this.draw2Leads(renderContext);
        color = DrawHelper.getVoltageColor((this.volts[0] + this.volts[1]) / 2);
        renderContext.drawCircle(this.center.x, this.center.y, cr);
        renderContext.drawCircle(this.ashaft1, this.ashaft2);
        renderContext.fillPolygon(this.arrow);
        renderContext.setBboxPt(this.point1, this.point2, cr);
        this.drawPosts(renderContext);
        return this.doDots(renderContext);
      };

      CurrentElm.prototype.stamp = function(stamper) {
        this.current = this.currentValue;
        return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.current);
      };

      CurrentElm.prototype.getInfo = function(arr) {
        CurrentElm.__super__.getInfo.call(this);
        arr[0] = "current source";
        return this.getBasicInfo(arr);
      };

      CurrentElm.prototype.getVoltageDiff = function() {
        return this.volts[1] - this.volts[0];
      };

      return CurrentElm;

    })(CircuitComponent);
    return CurrentElm;
  });

}).call(this);
