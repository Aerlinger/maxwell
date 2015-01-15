(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent', 'cs!util/MathUtils'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, MathUtils) {
    var OpAmpElm;
    OpAmpElm = (function(_super) {
      __extends(OpAmpElm, _super);

      OpAmpElm.FLAG_SWAP = 1;

      OpAmpElm.FLAG_SMALL = 2;

      OpAmpElm.FLAG_LOWGAIN = 4;

      function OpAmpElm(xa, ya, xb, yb, f, st) {
        OpAmpElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.opsize = 0;
        this.opwidth = 0;
        this.opaddtext = 0;
        this.maxOut = 15;
        this.minOut = -15;
        this.gain = 1e6;
        this.reset = false;
        this.in1p = [];
        this.in2p = [];
        this.textp = [];
        this.maxOut = 15;
        this.minOut = -15;
        this.gbw = 1e6;
        if (st && st.length > 0) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          try {
            this.maxOut || (this.maxOut = parseFloat(st[0]));
            this.minOut || (this.minOut = parseFloat(st[1]));
            this.gbw || (this.gbw = parseFloat(st[2]));
          } catch (_error) {}
        }
        this.noDiagonal = true;
        this.setSize((f & OpAmpElm.FLAG_SMALL) !== 0 ? 1 : 2);
        this.setGain();
      }

      OpAmpElm.prototype.setGain = function() {
        return this.gain = ((this.flags & OpAmpElm.FLAG_LOWGAIN) !== 0 ? 1000 : 100000);
      };

      OpAmpElm.prototype.dump = function() {
        return "" + (OpAmpElm.__super__.dump.call(this)) + " " + this.maxOut + " " + this.minOut + " " + this.gbw;
      };

      OpAmpElm.prototype.nonLinear = function() {
        return true;
      };

      OpAmpElm.prototype.draw = function(renderContext) {
        var color;
        this.setBboxPt(this.point1, this.point2, this.opheight * 2);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.in1p[0], this.in1p[1], color);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.in2p[0], this.in2p[1], color);
        renderContext.drawThickPolygonP(this.triangle, (this.needsHighlight() ? Settings.SELECT_COLOR : Settings.FG_COLOR));
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.lead2, this.point2, color);
        this.drawDots(this.point2, this.lead2, renderContext);
        return this.drawPosts(renderContext);
      };

      OpAmpElm.prototype.getPower = function() {
        return this.volts[2] * this.current;
      };

      OpAmpElm.prototype.setSize = function(s) {
        this.opsize = s;
        this.opheight = 8 * s;
        this.opwidth = 13 * s;
        return this.flags = (this.flags & ~OpAmpElm.FLAG_SMALL) | (s === 1 ? OpAmpElm.FLAG_SMALL : 0);
      };

      OpAmpElm.prototype.setPoints = function() {
        var hs, tris, ww, _ref, _ref1, _ref2, _ref3;
        OpAmpElm.__super__.setPoints.call(this);
        this.setSize(2);
        if (ww > this.dn / 2) {
          ww = Math.floor(this.dn / 2);
        } else {
          ww = Math.floor(this.opwidth);
        }
        this.calcLeads(ww * 2);
        hs = Math.floor(this.opheight * this.dsign);
        if ((this.flags & OpAmpElm.FLAG_SWAP) !== 0) {
          hs = -hs;
        }
        this.in1p = CircuitComponent.newPointArray(2);
        this.in2p = CircuitComponent.newPointArray(2);
        this.textp = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.point1, this.point2, 0, hs), this.in1p[0] = _ref[0], this.in2p[0] = _ref[1];
        _ref1 = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, hs), this.in1p[1] = _ref1[0], this.in2p[1] = _ref1[1];
        _ref2 = DrawHelper.interpPoint2(this.lead1, this.lead2, .2, hs), this.textp[0] = _ref2[0], this.textp[1] = _ref2[1];
        tris = CircuitComponent.newPointArray(2);
        _ref3 = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, hs * 2), tris[0] = _ref3[0], tris[1] = _ref3[1];
        return this.triangle = DrawHelper.createPolygonFromArray([tris[0], tris[1], this.lead2]);
      };

      OpAmpElm.prototype.getPostCount = function() {
        return 3;
      };

      OpAmpElm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.in1p[0];
        } else {
          if (n === 1) {
            return this.in2p[0];
          } else {
            return this.point2;
          }
        }
      };

      OpAmpElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      OpAmpElm.prototype.getInfo = function(arr) {
        var vo;
        OpAmpElm.__super__.getInfo.call(this);
        arr[0] = "op-amp";
        arr[1] = "V+ = " + DrawHelper.getVoltageText(this.volts[1]);
        arr[2] = "V- = " + DrawHelper.getVoltageText(this.volts[0]);
        vo = Math.max(Math.min(this.volts[2], this.maxOut), this.minOut);
        arr[3] = "Vout = " + DrawHelper.getVoltageText(vo);
        arr[4] = "Iout = " + DrawHelper.getCurrentText(this.getCurrent());
        return arr[5] = "range = " + DrawHelper.getVoltageText(this.minOut) + " to " + DrawHelper.getVoltageText(this.maxOut);
      };

      OpAmpElm.prototype.stamp = function(stamper) {
        var vn;
        vn = this.Circuit.numNodes() + this.voltSource;
        stamper.stampNonLinear(vn);
        return stamper.stampMatrix(this.nodes[2], vn, 1);
      };

      OpAmpElm.prototype.doStep = function(stamper) {
        var dx, vd, vn, x;
        vd = this.volts[1] - this.volts[0];
        if (Math.abs(this.lastvd - vd) > .1) {
          this.Circuit.converged = false;
        } else if (this.volts[2] > this.maxOut + .1 || this.volts[2] < this.minOut - .1) {
          this.Circuit.converged = false;
        }
        x = 0;
        vn = this.Circuit.numNodes() + this.voltSource;
        dx = 0;
        if (vd >= this.maxOut / this.gain && (this.lastvd >= 0 || MathUtils.getRand(4) === 1)) {
          dx = 1e-4;
          x = this.maxOut - dx * this.maxOut / this.gain;
        } else if (vd <= this.minOut / this.gain && (this.lastvd <= 0 || MathUtils.getRand(4) === 1)) {
          dx = 1e-4;
          x = this.minOut - dx * this.minOut / this.gain;
        } else {
          dx = this.gain;
        }
        stamper.stampMatrix(vn, this.nodes[0], dx);
        stamper.stampMatrix(vn, this.nodes[1], -dx);
        stamper.stampMatrix(vn, this.nodes[2], 1);
        stamper.stampRightSide(vn, x);
        return this.lastvd = vd;
      };

      OpAmpElm.prototype.getConnection = function(n1, n2) {
        return false;
      };

      OpAmpElm.prototype.toString = function() {
        return "OpAmpElm";
      };

      OpAmpElm.prototype.hasGroundConnection = function(n1) {
        return n1 === 2;
      };

      OpAmpElm.prototype.getVoltageDiff = function() {
        return this.volts[2] - this.volts[1];
      };

      OpAmpElm.prototype.getDumpType = function() {
        return "a";
      };

      OpAmpElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("Max Output (V)", this.maxOut, 1, 20);
        }
        if (n === 1) {
          return new EditInfo("Min Output (V)", this.minOut, -20, 0);
        }
        return null;
      };

      OpAmpElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.maxOut = ei.value;
        }
        if (n === 1) {
          return this.minOut = ei.value;
        }
      };

      return OpAmpElm;

    })(CircuitComponent);
    return OpAmpElm;
  });

}).call(this);
