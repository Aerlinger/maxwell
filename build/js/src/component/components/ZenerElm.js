(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!component/components/core/Diode', 'cs!component/components/DiodeElm', 'cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Diode, DiodeElm, Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var ZenerElm;
    return ZenerElm = (function(_super) {
      __extends(ZenerElm, _super);

      function ZenerElm(xa, ya, xb, yb, f, st) {
        ZenerElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.default_z_voltage = 5.6;
        this.zvoltage = st[0] || this.default_z_voltage;
        if ((f & DiodeElm.FLAG_FWDROP) > 0) {
          try {
            this.fwdrop = st[1];
          } catch (_error) {}
        }
        this.setup();
      }

      ZenerElm.prototype.setPoints = function() {
        var pa, _ref, _ref1;
        ZenerElm.__super__.setPoints.call(this);
        this.calcLeads(16);
        pa = CircuitComponent.newPointArray(2);
        this.wing = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, this.hs), pa[0] = _ref[0], pa[1] = _ref[1];
        _ref1 = DrawHelper.interpPoint2(this.lead1, this.lead2, 1, this.hs), this.cathode[0] = _ref1[0], this.cathode[1] = _ref1[1];
        this.wing[0] = DrawHelper.interpPoint(this.cathode[0], this.cathode[1], -0.2, -this.hs);
        this.wing[1] = DrawHelper.interpPoint(this.cathode[1], this.cathode[0], -0.2, -this.hs);
        return this.poly = DrawHelper.createPolygonFromArray([pa[0], pa[1], this.lead2]);
      };

      ZenerElm.prototype.draw = function(renderContext) {
        var color, v1, v2;
        this.setBboxPt(this.point1, this.point2, this.hs);
        v1 = this.volts[0];
        v2 = this.volts[1];
        this.draw2Leads(renderContext);
        color = DrawHelper.getVoltageColor(v1);
        renderContext.drawThickPolygonP(this.poly, color);
        renderContext.drawThickLinePt(this.cathode[0], this.cathode[1], v1);
        color = DrawHelper.getVoltageColor(v2);
        renderContext.drawThickLinePt(this.wing[0], this.cathode[0], color);
        renderContext.drawThickLinePt(this.wing[1], this.cathode[1], color);
        this.drawDots(this.point2, this.point1, renderContext);
        return this.drawPosts(renderContext);
      };

      ZenerElm.prototype.nonlinear = function() {
        return true;
      };

      ZenerElm.prototype.setup = function() {
        this.diode.leakage = 5e-6;
        return ZenerElm.__super__.setup.call(this);
      };

      ZenerElm.prototype.getDumpType = function() {
        return "z";
      };

      ZenerElm.prototype.dump = function() {
        return ZenerElm.__super__.dump.call(this) + " " + this.zvoltage;
      };

      ZenerElm.prototype.getInfo = function(arr) {
        ZenerElm.__super__.getInfo.call(this, arr);
        arr[0] = "Zener diode";
        return arr[5] = "Vz = " + DrawHelper.getVoltageText(zvoltage);
      };

      ZenerElm.prototype.getEditInfo = function() {};

      ZenerElm.prototype.setEditInfo = function() {};

      return ZenerElm;

    })(DiodeElm);
  });

}).call(this);
