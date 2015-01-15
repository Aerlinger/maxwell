(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var OutputElm;
    OutputElm = (function(_super) {
      __extends(OutputElm, _super);

      OutputElm.FLAG_VALUE = 1;

      function OutputElm(xa, ya, xb, yb, f, st) {
        OutputElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      }

      OutputElm.prototype.getDumpType = function() {
        return "O";
      };

      OutputElm.prototype.getPostCount = function() {
        return 1;
      };

      OutputElm.prototype.setPoints = function() {
        OutputElm.__super__.setPoints.call(this);
        return this.lead1 = new Point();
      };

      OutputElm.prototype.draw = function(renderContext) {
        var color, s, selected;
        selected = this.needsHighlight();
        color = (selected ? Settings.SELECT_COLOR : "#FFF");
        s = ((this.flags & OutputElm.FLAG_VALUE) !== 0 ? DrawHelper.getVoltageText(this.volts[0]) : "out");
        this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, 1 - (3 * s.length / 2 + 8) / this.dn);
        this.setBboxPt(this.point1, this.lead1, 0);
        this.drawCenteredText(s, this.x2, this.y2, true, renderContext);
        if (selected) {
          color = DrawHelper.getVoltageColor(this.volts[0]);
        } else {
          color = Settings.SELECT_COLOR;
        }
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        return this.drawPosts(renderContext);
      };

      OutputElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      OutputElm.prototype.getInfo = function(arr) {
        arr[0] = "output";
        return arr[1] = "V = " + DrawHelper.getVoltageText(this.volts[0]);
      };

      OutputElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Show Voltage";
          return ei;
        }
        return null;
      };

      OutputElm.prototype.stamp = function(stamper) {};

      OutputElm.prototype.toString = function() {
        return "OutputElm";
      };

      OutputElm.prototype.setEditValue = function(n, ei) {};

      return OutputElm;

    })(CircuitComponent);
    return OutputElm;
  });

}).call(this);
