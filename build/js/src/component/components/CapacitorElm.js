(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!component/CircuitComponent', 'cs!render/DrawHelper', 'cs!geom/Point'], function(CircuitComponent, DrawHelper, Point) {
    var CapacitorElm;
    CapacitorElm = (function(_super) {
      __extends(CapacitorElm, _super);

      CapacitorElm.FLAG_BACK_EULER = 2;

      function CapacitorElm(xa, ya, xb, yb, f, st) {
        CapacitorElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.capacitance = 5e-6;
        this.compResistance = 11;
        this.voltDiff = 10;
        this.plate1 = [];
        this.plate2 = [];
        this.curSourceValue = 0;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.capacitance = Number(st[0]);
          this.voltDiff = Number(st[1]);
        }
      }

      CapacitorElm.prototype.isTrapezoidal = function() {
        return (this.flags & CapacitorElm.FLAG_BACK_EULER) === 0;
      };

      CapacitorElm.prototype.nonLinear = function() {
        return false;
      };

      CapacitorElm.prototype.setNodeVoltage = function(n, c) {
        CapacitorElm.__super__.setNodeVoltage.call(this, n, c);
        return this.voltDiff = this.volts[0] - this.volts[1];
      };

      CapacitorElm.prototype.reset = function() {
        this.current = this.curcount = 0;
        return this.voltDiff = 1e-3;
      };

      CapacitorElm.prototype.getDumpType = function() {
        return "c";
      };

      CapacitorElm.prototype.dump = function() {
        return "" + CapacitorElm.__super__.dump.apply(this, arguments) + " " + this.capacitance + " " + this.voltDiff;
      };

      CapacitorElm.prototype.setPoints = function() {
        var f, _ref, _ref1;
        CapacitorElm.__super__.setPoints.call(this);
        f = (this.dn / 2 - 4) / this.dn;
        this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, f);
        this.lead2 = DrawHelper.interpPoint(this.point1, this.point2, 1 - f);
        this.plate1 = [new Point(), new Point()];
        this.plate2 = [new Point(), new Point()];
        _ref = DrawHelper.interpPoint2(this.point1, this.point2, f, 12), this.plate1[0] = _ref[0], this.plate1[1] = _ref[1];
        return _ref1 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - f, 12), this.plate2[0] = _ref1[0], this.plate2[1] = _ref1[1], _ref1;
      };

      CapacitorElm.prototype.draw = function(renderContext) {
        var color, hs;
        hs = 12;
        this.setBboxPt(this.point1, this.point2, hs);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        renderContext.drawThickLinePt(this.plate1[0], this.plate1[1], color);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.point2, this.lead2, color);
        renderContext.drawThickLinePt(this.plate2[0], this.plate2[1], color);
        this.drawDots(this.point1, this.lead1, renderContext);
        this.drawDots(this.lead2, this.point2, renderContext);
        return this.drawPosts(renderContext);
      };

      CapacitorElm.prototype.drawUnits = function() {
        var s;
        s = DrawHelper.getUnitText(this.capacitance, "F");
        return this.drawValues(s, hs);
      };

      CapacitorElm.prototype.doStep = function(stamper) {
        return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
      };

      CapacitorElm.prototype.stamp = function(stamper) {
        if (this.isTrapezoidal()) {
          this.compResistance = this.timeStep() / (2 * this.capacitance);
        } else {
          this.compResistance = this.timeStep() / this.capacitance;
        }
        stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
        stamper.stampRightSide(this.nodes[0]);
        stamper.stampRightSide(this.nodes[1]);
      };

      CapacitorElm.prototype.startIteration = function() {
        if (this.isTrapezoidal()) {
          this.curSourceValue = -this.voltDiff / this.compResistance - this.current;
        } else {
          this.curSourceValue = -this.voltDiff / this.compResistance;
        }
      };

      CapacitorElm.prototype.calculateCurrent = function() {
        var vdiff;
        vdiff = this.volts[0] - this.volts[1];
        if (this.compResistance > 0) {
          return this.current = vdiff / this.compResistance + this.curSourceValue;
        }
      };

      CapacitorElm.prototype.getInfo = function(arr) {
        var v;
        CapacitorElm.__super__.getInfo.call(this);
        arr[0] = "capacitor";
        this.getBasicInfo(arr);
        arr[3] = "C = " + DrawHelper.getUnitText(this.capacitance, "F");
        arr[4] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
        v = this.getVoltageDiff();
        return arr[4] = "U = " + DrawHelper.getUnitText(.5 * this.capacitance * v * v, "J");
      };

      CapacitorElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Capacitance (F)", this.capacitance, 0, 0);
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Trapezoidal Approximation";
          return ei;
        }
        return null;
      };

      CapacitorElm.prototype.setEditValue = function(n, ei) {
        if (n === 0 && ei.value > 0) {
          this.capacitance = ei.value;
        }
        if (n === 1) {
          if (ei.isChecked) {
            return this.flags &= ~CapacitorElm.FLAG_BACK_EULER;
          } else {
            return this.flags |= CapacitorElm.FLAG_BACK_EULER;
          }
        }
      };

      CapacitorElm.prototype.needsShortcut = function() {
        return true;
      };

      CapacitorElm.prototype.toString = function() {
        return "CapacitorElm";
      };

      return CapacitorElm;

    })(CircuitComponent);
    return CapacitorElm;
  });

}).call(this);
