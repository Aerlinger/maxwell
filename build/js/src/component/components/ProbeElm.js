(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var ProbeElm;
    ProbeElm = (function(_super) {
      __extends(ProbeElm, _super);

      ProbeElm.FLAG_SHOWVOLTAGE = 1;

      function ProbeElm(xa, ya, xb, yb, f, st) {
        ProbeElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      }

      ProbeElm.prototype.getDumpType = function() {
        return "p";
      };

      ProbeElm.prototype.toString = function() {
        return "ProbeElm";
      };

      ProbeElm.prototype.setPoints = function() {
        var x;
        ProbeElm.__super__.setPoints.call(this);
        if (this.point2.y < this.point1.y) {
          x = this.point1;
          this.point1 = this.point2;
          this.point2 = this.x1;
        }
        return this.center = DrawHelper.interpPoint(this.point1, this.point2, .5);
      };

      ProbeElm.prototype.draw = function(renderContext) {
        var color, hs, len, unit_text;
        hs = 8;
        this.setBboxPt(this.point1, this.point2, hs);
        len = this.dn - 32;
        this.calcLeads(Math.floor(len));
        if (this.isSelected()) {
          color = Settings.SELECT_COLOR;
        } else {
          color = DrawHelper.getVoltageColor(this.volts[0]);
        }
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        if (this.isSelected()) {
          color = Settings.SELECT_COLOR;
        } else {
          color = DrawHelper.getVoltageColor(this.volts[1]);
        }
        renderContext.drawThickLinePt(this.lead2, this.point2, color);
        if (this.mustShowVoltage()) {
          unit_text = DrawHelper.getShortUnitText(this.volts[0], "V");
          this.drawValues(unit_text, 4, renderContext);
        }
        return this.drawPosts(renderContext);
      };

      ProbeElm.prototype.mustShowVoltage = function() {
        return (this.flags & ProbeElm.FLAG_SHOWVOLTAGE) !== 0;
      };

      ProbeElm.prototype.getInfo = function(arr) {
        arr[0] = "scope probe";
        return arr[1] = "Vd = " + DrawHelper.getVoltageText(this.getVoltageDiff());
      };

      ProbeElm.prototype.stamp = function(stamper) {};

      ProbeElm.prototype.getConnection = function(n1, n2) {
        return false;
      };

      ProbeElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Show Voltage", this.mustShowVoltage());
          return ei;
        }
        return null;
      };

      ProbeElm.prototype.setEditValue = function(n, ei) {
        var flags;
        if (n === 0) {
          if (ei.checkbox.getState()) {
            return flags = ProbeElm.FLAG_SHOWVOLTAGE;
          } else {
            return flags &= ~ProbeElm.FLAG_SHOWVOLTAGE;
          }
        }
      };

      return ProbeElm;

    })(CircuitComponent);
    return ProbeElm;
  });

}).call(this);
