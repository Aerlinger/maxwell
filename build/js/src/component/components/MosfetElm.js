(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var JFetElm, MosfetElm;
    JFetElm = (function() {
      function JFetElm() {}

      return JFetElm;

    })();
    MosfetElm = (function(_super) {
      __extends(MosfetElm, _super);

      MosfetElm.FLAG_PNP = 1;

      MosfetElm.FLAG_SHOWVT = 2;

      MosfetElm.FLAG_DIGITAL = 4;

      function MosfetElm(xa, ya, xb, yb, f, st) {
        MosfetElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.lastv1 = 0;
        this.lastv2 = 0;
        this.ids = 0;
        this.mode = 0;
        this.gm = 0;
        this.vt = 1.5;
        this.pcircler = 3;
        this.src = [];
        this.drn = [];
        this.gate = [];
        this.pcircle = [];
        this.pnp = ((f & MosfetElm.FLAG_PNP) !== 0 ? -1 : 1);
        this.noDiagonal = true;
        this.vt = this.getDefaultThreshold();
        this.hs = 16;
        if (st && st.length > 0) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.vt || (this.vt = st[0]);
        }
      }

      MosfetElm.prototype.getDefaultThreshold = function() {
        return 1.5;
      };

      MosfetElm.prototype.getBeta = function() {
        return .02;
      };

      MosfetElm.prototype.nonLinear = function() {
        return true;
      };

      MosfetElm.prototype.toString = function() {
        return "MosfetElm";
      };

      MosfetElm.prototype.drawDigital = function() {
        return (this.flags & MosfetElm.FLAG_DIGITAL) !== 0;
      };

      MosfetElm.prototype.reset = function() {
        return this.lastv1 = this.lastv2 = this.volts[0] = this.volts[1] = this.volts[2] = this.curcount = 0;
      };

      MosfetElm.prototype.dump = function() {
        return MosfetElm.__super__.dump.call(this) + " " + this.vt;
      };

      MosfetElm.prototype.getDumpType = function() {
        return "f";
      };

      MosfetElm.prototype.draw = function(renderContext) {
        var color, i, ps1, ps2, s, segf, segments, v, _i;
        this.setBboxPt(this.point1, this.point2, this.hs);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.src[0], this.src[1], color);
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.drn[0], this.drn[1], color);
        segments = 6;
        segf = 1.0 / segments;
        for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
          v = this.volts[1] + (this.volts[2] - this.volts[1]) * i / segments;
          color = DrawHelper.getVoltageColor(v);
          ps1 = DrawHelper.interpPoint(this.src[1], this.drn[1], i * segf);
          ps2 = DrawHelper.interpPoint(this.src[1], this.drn[1], (i + 1) * segf);
          renderContext.drawThickLinePt(ps1, ps2, color);
        }
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.src[1], this.src[2], color);
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.drn[1], this.drn[2], color);
        if (!this.drawDigital()) {
          color = DrawHelper.getVoltageColor((this.pnp === 1 ? this.volts[1] : this.volts[2]));
          renderContext.drawThickPolygonP(this.arrowPoly, color);
        }
        renderContext.drawThickPolygonP(this.arrowPoly);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.gate[1], color);
        renderContext.drawThickLinePt(this.gate[0], this.gate[2], color);
        this.drawDigital() && this.pnp === -1;
        if ((this.flags & MosfetElm.FLAG_SHOWVT) !== 0) {
          s = "" + (this.vt * this.pnp);
        }
        this.drawDots(this.src[0], this.src[1], renderContext);
        this.drawDots(this.src[1], this.drn[1], renderContext);
        this.drawDots(this.drn[1], this.drn[0], renderContext);
        return this.drawPosts(renderContext);
      };

      MosfetElm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.point1;
        } else {
          if (n === 1) {
            return this.src[0];
          } else {
            return this.drn[0];
          }
        }
      };

      MosfetElm.prototype.getCurrent = function() {
        return this.ids;
      };

      MosfetElm.prototype.getPower = function() {
        return this.ids * (this.volts[2] - this.volts[1]);
      };

      MosfetElm.prototype.getPostCount = function() {
        return 3;
      };

      MosfetElm.prototype.setPoints = function() {
        var dist, hs2, _ref, _ref1, _ref2, _ref3;
        MosfetElm.__super__.setPoints.call(this);
        hs2 = this.hs * this.dsign;
        this.src = CircuitComponent.newPointArray(3);
        this.drn = CircuitComponent.newPointArray(3);
        _ref = DrawHelper.interpPoint2(this.point1, this.point2, 1, -hs2), this.src[0] = _ref[0], this.drn[0] = _ref[1];
        _ref1 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 22 / this.dn, -hs2), this.src[1] = _ref1[0], this.drn[1] = _ref1[1];
        _ref2 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 22 / this.dn, -hs2 * 4 / 3), this.src[2] = _ref2[0], this.drn[2] = _ref2[1];
        this.gate = CircuitComponent.newPointArray(3);
        _ref3 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 28 / this.dn, hs2 / 2), this.gate[0] = _ref3[0], this.gate[2] = _ref3[1];
        this.gate[1] = DrawHelper.interpPoint(this.gate[0], this.gate[2], .5);
        console.log("GATE: " + this.gate[1]);
        if (!this.drawDigital()) {
          if (this.pnp === 1) {
            return this.arrowPoly = DrawHelper.calcArrow(this.src[1], this.src[0], 10, 4);
          } else {
            return this.arrowPoly = DrawHelper.calcArrow(this.drn[0], this.drn[1], 12, 5);
          }
        } else if (this.pnp === -1) {
          this.gate[1] = DrawHelper.interpPoint(this.point1, this.point2, 1 - 36 / this.dn);
          dist = (this.dsign < 0 ? 32 : 31);
          this.pcircle = DrawHelper.interpPoint(this.point1, this.point2, 1 - dist / this.dn);
          return this.pcircler = 3;
        }
      };

      MosfetElm.prototype.stamp = function(stamper) {
        stamper.stampNonLinear(this.nodes[1]);
        return stamper.stampNonLinear(this.nodes[2]);
      };

      MosfetElm.prototype.doStep = function(stamper) {
        var Gds, beta, drain_node, gate, realvds, realvgs, rs, source_node, vds, vgs, vs;
        vs = new Array(3);
        vs[0] = this.volts[0];
        vs[1] = this.volts[1];
        vs[2] = this.volts[2];
        if (vs[1] > this.lastv1 + .5) {
          vs[1] = this.lastv1 + .5;
        }
        if (vs[1] < this.lastv1 - .5) {
          vs[1] = this.lastv1 - .5;
        }
        if (vs[2] > this.lastv2 + .5) {
          vs[2] = this.lastv2 + .5;
        }
        if (vs[2] < this.lastv2 - .5) {
          vs[2] = this.lastv2 - .5;
        }
        source_node = 1;
        drain_node = 2;
        if (this.pnp * vs[1] > this.pnp * vs[2]) {
          source_node = 2;
          drain_node = 1;
        }
        gate = 0;
        vgs = vs[gate] - vs[source_node];
        vds = vs[drain_node] - vs[source_node];
        if (Math.abs(this.lastv1 - vs[1]) > .01 || Math.abs(this.lastv2 - vs[2]) > .01) {
          this.getParentCircuit().converged = false;
        }
        this.lastv1 = vs[1];
        this.lastv2 = vs[2];
        realvgs = vgs;
        realvds = vds;
        vgs *= this.pnp;
        vds *= this.pnp;
        this.ids = 0;
        this.gm = 0;
        Gds = 0;
        beta = this.getBeta();
        if (vgs > .5 && this instanceof JFetElm) {
          Circuit.halt("JFET is reverse biased!", this);
          return;
        }
        if (vgs < this.vt) {
          Gds = 1e-8;
          this.ids = vds * Gds;
          this.mode = 0;
        } else if (vds < vgs - this.vt) {
          this.ids = beta * ((vgs - this.vt) * vds - vds * vds * .5);
          this.gm = beta * vds;
          Gds = beta * (vgs - vds - this.vt);
          this.mode = 1;
        } else {
          this.gm = beta * (vgs - this.vt);
          Gds = 1e-8;
          this.ids = .5 * beta * (vgs - this.vt) * (vgs - this.vt) + (vds - (vgs - this.vt)) * Gds;
          this.mode = 2;
        }
        rs = -this.pnp * this.ids + Gds * realvds + this.gm * realvgs;
        stamper.stampMatrix(this.nodes[drain_node], this.nodes[drain_node], Gds);
        stamper.stampMatrix(this.nodes[drain_node], this.nodes[source_node], -Gds - this.gm);
        stamper.stampMatrix(this.nodes[drain_node], this.nodes[gate], this.gm);
        stamper.stampMatrix(this.nodes[source_node], this.nodes[drain_node], -Gds);
        stamper.stampMatrix(this.nodes[source_node], this.nodes[source_node], Gds + this.gm);
        stamper.stampMatrix(this.nodes[source_node], this.nodes[gate], -this.gm);
        stamper.stampRightSide(this.nodes[drain_node], rs);
        stamper.stampRightSide(this.nodes[source_node], -rs);
        if ((source_node === 2 && this.pnp === 1) || (source_node === 1 && this.pnp === -1)) {
          return this.ids = -this.ids;
        }
      };

      MosfetElm.prototype.getFetInfo = function(arr, n) {
        arr[0] = (this.pnp === -1 ? "p-" : "n-") + n;
        arr[0] += " (Vt = " + DrawHelper.getVoltageText(this.pnp * this.vt) + ")";
        arr[1] = (this.pnp === 1 ? "Ids = " : "Isd = ") + DrawHelper.getCurrentText(this.ids);
        arr[2] = "Vgs = " + DrawHelper.getVoltageText(this.volts[0] - this.volts[(this.pnp === -1 ? 2 : 1)]);
        arr[3] = (this.pnp === 1 ? "Vds = " : "Vsd = ") + DrawHelper.getVoltageText(this.volts[2] - this.volts[1]);
        arr[4] = (this.mode === 0 ? "off" : (this.mode === 1 ? "linear" : "saturation"));
        return arr[5] = "gm = " + DrawHelper.getUnitText(this.gm, "A/V");
      };

      MosfetElm.prototype.getInfo = function(arr) {
        return this.getFetInfo(arr, "MOSFET");
      };

      MosfetElm.prototype.canViewInScope = function() {
        return true;
      };

      MosfetElm.prototype.getVoltageDiff = function() {
        return this.volts[2] - this.volts[1];
      };

      MosfetElm.prototype.getConnection = function(n1, n2) {
        return !(n1 === 0 || n2 === 0);
      };

      return MosfetElm;

    })(CircuitComponent);
    return MosfetElm;
  });

}).call(this);
