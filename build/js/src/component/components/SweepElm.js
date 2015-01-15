(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var SweepElm;
    return SweepElm = (function(_super) {
      __extends(SweepElm, _super);

      SweepElm.FLAG_LOG = 1;

      SweepElm.FLAG_BIDIR = 2;

      SweepElm.circleSize = 17;

      function SweepElm(xa, ya, xb, yb, f, st) {
        SweepElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.dir = 1;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.minF = (st[0] ? parseFloat(st[0]) : 20);
          this.maxF = (st[1] ? parseFloat(st[1]) : 4e4);
          this.maxV = (st[2] ? parseFloat(st[2]) : 5);
          this.sweepTime = (st[3] ? parseFloat(st[3]) : 0.1);
        }
        this.reset();
      }

      SweepElm.prototype.getDumpType = function() {
        return 170;
      };

      SweepElm.prototype.getPostCount = function() {
        return 1;
      };

      SweepElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.minF + " " + this.maxF + " " + this.maxV + " " + this.sweepTime;
      };

      SweepElm.prototype.setPoints = function() {
        CircuitComponent.prototype.setPoints.call(this);
        return this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, 1 - this.circleSize / this.dn);
      };

      SweepElm.prototype.draw = function() {
        var color, i, ox, oy, powerColor, s, tm, w, wl, xc, xl, yc, yy;
        this.setBboxPt(this.point1, this.point2, this.circleSize);
        color = this.setVoltageColor(this.volts[0]);
        CircuitComponent.drawThickLinePt(this.point1, this.lead1, color);
        this.setVoltageColor((this.needsHighlight() ? CircuitComponent.selectColor : Color.GREY));
        powerColor = this.setPowerColor(false);
        xc = this.point2.x1;
        yc = this.point2.y;
        CircuitComponent.drawCircle(xc, yc, this.circleSize);
        wl = 8;
        this.adjustBbox(xc - this.circleSize, yc - this.circleSize, xc + this.circleSize, yc + this.circleSize);
        i = void 0;
        xl = 10;
        ox = -1;
        oy = -1;
        tm = (new Date()).getTime();
        tm %= 2000;
        if (tm > 1000) {
          tm = 2000 - tm;
        }
        w = 1 + tm * .002;
        if (!Circuit.stoppedCheck) {
          w = 1 + 2 * (this.frequency - this.minF) / (this.maxF - this.minF);
        }
        i = -xl;
        while (i <= xl) {
          yy = yc + Math.floor(.95 * Math.sin(i * Math.PI * w / xl) * wl);
          if (ox !== -1) {
            CircuitComponent.drawThickLine(ox, oy, xc + i, yy);
          }
          ox = xc + i;
          oy = yy;
          i++;
        }
        if (Circuit.showValuesCheckItem) {
          s = CircuitComponent.getShortUnitText(this.frequency, "Hz");
          if (this.dx === 0 || this.dy === 0) {
            this.drawValues(s, this.circleSize);
          }
        }
        this.drawPosts();
        this.curcount = this.updateDotCount(-this.current, this.curcount);
        if (Circuit.dragElm !== this) {
          return this.drawDots(this.point1, this.lead1, this.curcount);
        }
      };

      SweepElm.prototype.stamp = function() {
        return Circuit.stampVoltageSource(0, this.nodes[0], this.voltSource);
      };

      SweepElm.prototype.setParams = function() {
        if (this.frequency < this.minF || this.frequency > this.maxF) {
          this.frequency = this.minF;
          this.freqTime = 0;
          this.dir = 1;
        }
        if ((this.flags & SweepElm.FLAG_LOG) === 0) {
          this.fadd = this.dir * Circuit.timeStep * (this.maxF - this.minF) / this.sweepTime;
          this.fmul = 1;
        } else {
          this.fadd = 0;
          this.fmul = Math.pow(this.maxF / this.minF, this.dir * Circuit.timeStep / this.sweepTime);
        }
        return this.savedTimeStep = Circuit.timeStep;
      };

      SweepElm.prototype.reset = function() {
        this.frequency = this.minF;
        this.freqTime = 0;
        this.dir = 1;
        return this.setParams();
      };

      SweepElm.prototype.startIteration = function() {
        if (Circuit.timeStep !== this.savedTimeStep) {
          this.setParams();
        }
        this.v = Math.sin(this.freqTime) * this.maxV;
        this.freqTime += this.frequency * 2 * Math.PI * Circuit.timeStep;
        this.frequency = this.frequency * this.fmul + this.fadd;
        if (this.frequency >= this.maxF && this.dir === 1) {
          if ((this.flags & SweepElm.FLAG_BIDIR) !== 0) {
            this.fadd = -this.fadd;
            this.fmul = 1 / this.fmul;
            this.dir = -1;
          } else {
            this.frequency = this.minF;
          }
        }
        if (this.frequency <= this.minF && this.dir === -1) {
          this.fadd = -this.fadd;
          this.fmul = 1 / this.fmul;
          return this.dir = 1;
        }
      };

      SweepElm.prototype.doStep = function(stamper) {
        return stamper.updateVoltageSource(0, this.nodes[0], this.voltSource, this.v);
      };

      SweepElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      SweepElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      SweepElm.prototype.hasGroundConnection = function(n1) {
        return true;
      };

      SweepElm.prototype.getInfo = function(arr) {
        arr[0] = "sweep " + ((this.flags & SweepElm.FLAG_LOG) === 0 ? "(linear)" : "(log)");
        arr[1] = "I = " + CircuitComponent.getCurrentDText(this.getCurrent());
        arr[2] = "V = " + CircuitComponent.getVoltageText(this.volts[0]);
        arr[3] = "f = " + CircuitComponent.getUnitText(this.frequency, "Hz");
        arr[4] = "range = " + CircuitComponent.getUnitText(this.minF, "Hz") + " .. " + CircuitComponent.getUnitText(this.maxF, "Hz");
        return arr[5] = "time = " + CircuitComponent.getUnitText(this.sweepTime, "s");
      };

      SweepElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Min Frequency (Hz)", this.minF, 0, 0);
        }
        if (n === 1) {
          return new EditInfo("Max Frequency (Hz)", this.maxF, 0, 0);
        }
        if (n === 2) {
          return new EditInfo("Sweep Time (s)", this.sweepTime, 0, 0);
        }
        if (n === 3) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Logarithmic", (this.flags & SweepElm.FLAG_LOG) !== 0);
          return ei;
        }
        if (n === 4) {
          return new EditInfo("Max Voltage", this.maxV, 0, 0);
        }
        if (n === 5) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Bidirectional", (this.flags & SweepElm.FLAG_BIDIR) !== 0);
          return ei;
        }
        return null;
      };

      SweepElm.prototype.setEditValue = function(n, ei) {
        var maxfreq;
        maxfreq = 1 / (8 * Circuit.timeStep);
        if (n === 0) {
          this.minF = ei.value;
          if (this.minF > maxfreq) {
            this.minF = maxfreq;
          }
        }
        if (n === 1) {
          this.maxF = ei.value;
          if (this.maxF > maxfreq) {
            this.maxF = maxfreq;
          }
        }
        if (n === 2) {
          this.sweepTime = ei.value;
        }
        if (n === 3) {
          this.flags &= ~SweepElm.FLAG_LOG;
          if (ei.checkbox.getState()) {
            this.flags |= SweepElm.FLAG_LOG;
          }
        }
        if (n === 4) {
          this.maxV = ei.value;
        }
        if (n === 5) {
          this.flags &= ~SweepElm.FLAG_BIDIR;
          if (ei.checkbox.getState()) {
            this.flags |= SweepElm.FLAG_BIDIR;
          }
        }
        return this.setParams();
      };

      return SweepElm;

    })(CircuitComponent);
  });

}).call(this);
