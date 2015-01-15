(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/components/VoltageElm', 'cs!component/components/AntennaElm', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, VoltageElm, AntennaElm, CircuitComponent) {
    var RailElm;
    RailElm = (function(_super) {
      __extends(RailElm, _super);

      RailElm.FLAG_CLOCK = 1;

      function RailElm(xa, ya, xb, yb, f, st) {
        RailElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      }

      RailElm.prototype.getDumpType = function() {
        return "R";
      };

      RailElm.prototype.getPostCount = function() {
        return 1;
      };

      RailElm.prototype.setPoints = function() {
        RailElm.__super__.setPoints.call(this);
        return this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, 1 - VoltageElm.circleSize / this.dn);
      };

      RailElm.prototype.draw = function(renderContext) {
        var clock, color, s, v;
        this.setBboxPt(this.point1, this.point2, this.circleSize);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        clock = this.waveform === VoltageElm.WF_SQUARE && (this.flags & VoltageElm.FLAG_CLOCK) !== 0;
        if (this.waveform === VoltageElm.WF_DC || this.waveform === VoltageElm.WF_VAR || clock) {
          color = (this.needsHighlight() ? Settings.SELECT_COLOR : "#FFFFFF");
          v = this.getVoltage();
          s = DrawHelper.getShortUnitText(v, "V");
          if (Math.abs(v) < 1) {
            s = v + "V";
          }
          if (this.getVoltage() > 0) {
            s = "+" + s;
          }
          if (this instanceof AntennaElm) {
            s = "Ant";
          }
          if (clock) {
            s = "CLK";
          }
          this.drawCenteredText(s, this.x2, this.y2, true, renderContext);
        } else {
          this.drawWaveform(this.point2, renderContext);
        }
        this.drawPosts(renderContext);
        return this.drawDots(this.point1, this.lead1, renderContext);
      };

      RailElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      RailElm.prototype.stamp = function(stamper) {
        if (this.waveform === VoltageElm.WF_DC) {
          return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
        } else {
          return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource);
        }
      };

      RailElm.prototype.doStep = function(stamper) {
        if (this.waveform !== VoltageElm.WF_DC) {
          return stamper.updateVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
        }
      };

      RailElm.prototype.hasGroundConnection = function(n1) {
        return true;
      };

      return RailElm;

    })(VoltageElm);
    return RailElm;
  });

}).call(this);
