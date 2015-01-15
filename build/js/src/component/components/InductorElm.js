(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var InductorElm;
    InductorElm = (function(_super) {
      __extends(InductorElm, _super);

      InductorElm.FLAG_BACK_EULER = 2;

      function InductorElm(xa, ya, xb, yb, f, st) {
        InductorElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.inductance = 0;
        this.nodes = new Array(2);
        this.flags = 0;
        this.compResistance = 0;
        this.current = 0;
        this.curSourceValue = 0;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.inductance = parseFloat(st[0]);
          this.current = parseFloat(st[1]);
        }
      }

      InductorElm.prototype.stamp = function(stamper) {
        var ts;
        ts = this.getParentCircuit().timeStep();
        console.log(ts);
        console.log(this.inductance);
        if (this.isTrapezoidal()) {
          this.compResistance = 2 * this.inductance / ts;
        } else {
          this.compResistance = this.inductance / ts;
        }
        stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
        stamper.stampRightSide(this.nodes[0]);
        return stamper.stampRightSide(this.nodes[1]);
      };

      InductorElm.prototype.doStep = function(stamper) {
        return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
      };

      InductorElm.prototype.draw = function(renderContext) {
        var hs, unit_text, v1, v2;
        v1 = this.volts[0];
        v2 = this.volts[1];
        hs = 8;
        this.setBboxPt(this.point1, this.point2, hs);
        this.draw2Leads(renderContext);
        DrawHelper.drawCoil(8, this.lead1, this.lead2, v1, v2, renderContext);
        unit_text = DrawHelper.getUnitText(this.inductance, "H");
        this.drawValues(unit_text, hs, renderContext);
        this.drawPosts(renderContext);
        return this.drawDots(this.point1, this.point2, renderContext);
      };

      InductorElm.prototype.dump = function() {
        return "" + (InductorElm.__super__.dump.call(this)) + " " + this.inductance + " " + this.current;
      };

      InductorElm.prototype.getDumpType = function() {
        return "l";
      };

      InductorElm.prototype.startIteration = function() {
        if (this.isTrapezoidal()) {
          return this.curSourceValue = this.getVoltageDiff() / this.compResistance + this.current;
        } else {
          return this.curSourceValue = this.current;
        }
      };

      InductorElm.prototype.nonLinear = function() {
        return false;
      };

      InductorElm.prototype.isTrapezoidal = function() {
        return (this.flags & InductorElm.FLAG_BACK_EULER) === 0;
      };

      InductorElm.prototype.calculateCurrent = function() {
        if (this.compResistance > 0) {
          this.current = this.getVoltageDiff() / this.compResistance + this.curSourceValue;
        }
        return this.current;
      };

      InductorElm.prototype.getInfo = function(arr) {
        arr[0] = "inductor";
        this.getBasicInfo(arr);
        arr[3] = "L = " + DrawHelper.getUnitText(this.inductance, "H");
        return arr[4] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
      };

      InductorElm.prototype.reset = function() {
        this.current = 0;
        this.volts[0] = 0;
        this.volts[1] = 0;
        return this.curcount = 0;
      };

      InductorElm.prototype.getVoltageDiff = function() {
        return this.volts[0] - this.volts[1];
      };

      InductorElm.prototype.toString = function() {
        return "InductorElm";
      };

      InductorElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Inductance (H)", this.inductance, 0, 0);
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Trapezoidal Approximation";
          return ei;
        }
        return null;
      };

      InductorElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.inductance = ei.value;
        }
        if (n === 1) {
          if (ei.checkbox.getState()) {
            return this.flags &= ~Inductor.FLAG_BACK_EULER;
          } else {
            return this.flags |= Inductor.FLAG_BACK_EULER;
          }
        }
      };

      InductorElm.prototype.setPoints = function() {
        InductorElm.__super__.setPoints.call(this);
        return this.calcLeads(32);
      };

      return InductorElm;

    })(CircuitComponent);
    return InductorElm;
  });

}).call(this);
