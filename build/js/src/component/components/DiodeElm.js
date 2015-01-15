(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!component/components/core/Diode', 'cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Diode, Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var DiodeElm;
    DiodeElm = (function(_super) {
      __extends(DiodeElm, _super);

      DiodeElm.FLAG_FWDROP = 1;

      DiodeElm.DEFAULT_DROP = .805904783;

      function DiodeElm(xa, ya, xb, yb, f, st) {
        DiodeElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.hs = 8;
        this.poly;
        this.cathode = [];
        this.diode = new Diode(self);
        this.fwdrop = DiodeElm.DEFAULT_DROP;
        this.zvoltage = 0;
        if ((f & DiodeElm.FLAG_FWDROP) > 0) {
          try {
            this.fwdrop = parseFloat(st);
          } catch (_error) {}
        }
        this.setup();
      }

      DiodeElm.prototype.nonLinear = function() {
        return true;
      };

      DiodeElm.prototype.setup = function() {
        return this.diode.setup(this.fwdrop, this.zvoltage);
      };

      DiodeElm.prototype.getDumpType = function() {
        return "d";
      };

      DiodeElm.prototype.dump = function() {
        this.flags |= DiodeElm.FLAG_FWDROP;
        return CircuitComponent.prototype.dump.call(this) + " " + this.fwdrop;
      };

      DiodeElm.prototype.setPoints = function() {
        var pa, pb, _ref, _ref1;
        DiodeElm.__super__.setPoints.call(this);
        this.calcLeads(16);
        this.cathode = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, this.hs), pa = _ref[0], pb = _ref[1];
        _ref1 = DrawHelper.interpPoint2(this.lead1, this.lead2, 1, this.hs), this.cathode[0] = _ref1[0], this.cathode[1] = _ref1[1];
        return this.poly = DrawHelper.createPolygonFromArray([pa, pb, this.lead2]);
      };

      DiodeElm.prototype.draw = function(renderContext) {
        this.drawDiode(renderContext);
        this.drawDots(this.point1, this.point2, renderContext);
        return this.drawPosts(renderContext);
      };

      DiodeElm.prototype.reset = function() {
        this.diode.reset();
        return this.volts[0] = this.volts[1] = this.curcount = 0;
      };

      DiodeElm.prototype.drawDiode = function(renderContext) {
        var color, v1, v2;
        this.setBboxPt(this.point1, this.point2, this.hs);
        v1 = this.volts[0];
        v2 = this.volts[1];
        this.draw2Leads(renderContext);
        color = DrawHelper.getVoltageColor(v1);
        renderContext.drawThickPolygonP(this.poly, color);
        color = DrawHelper.getVoltageColor(v2);
        return renderContext.drawThickLinePt(this.cathode[0], this.cathode[1], color);
      };

      DiodeElm.prototype.stamp = function(stamper) {
        return this.diode.stamp(this.nodes[0], this.nodes[1], stamper);
      };

      DiodeElm.prototype.doStep = function(stamper) {
        return this.diode.doStep(this.volts[0] - this.volts[1], stamper);
      };

      DiodeElm.prototype.calculateCurrent = function() {
        return this.current = this.diode.calculateCurrent(this.volts[0] - this.volts[1]);
      };

      DiodeElm.prototype.getInfo = function(arr) {
        DiodeElm.__super__.getInfo.call(this);
        arr[0] = "diode";
        arr[1] = "I = " + DrawHelper.getCurrentText(this.getCurrent());
        arr[2] = "Vd = " + DrawHelper.getVoltageText(this.getVoltageDiff());
        arr[3] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
        return arr[4] = "Vf = " + DrawHelper.getVoltageText(this.fwdrop);
      };

      DiodeElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("Fwd Voltage @ 1A", this.fwdrop, 10, 1000);
        }
      };

      DiodeElm.prototype.setEditValue = function(n, ei) {
        this.fwdrop = ei.value;
        return this.setup();
      };

      DiodeElm.prototype.toString = function() {
        return "DiodeElm";
      };

      DiodeElm.prototype.needsShortcut = function() {
        return true;
      };

      return DiodeElm;

    })(CircuitComponent);
    return DiodeElm;
  });

}).call(this);
