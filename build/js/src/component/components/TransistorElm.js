(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var TransistorElm;
    TransistorElm = (function(_super) {
      __extends(TransistorElm, _super);

      TransistorElm.FLAG_FLIP = 1;

      function TransistorElm(xa, ya, xb, yb, f, st) {
        var beta, lastvbc, lastvbe, pnp;
        TransistorElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.beta = 100;
        this.rect = [];
        this.coll = [];
        this.emit = [];
        this.base = new Point();
        this.pnp = 0;
        this.gmin = 0;
        this.ie = 0;
        this.ic = 0;
        this.ib = 0;
        this.rectPoly = 0;
        this.arrowPoly = 0;
        this.vt = .025;
        this.vdcoef = 1 / this.vt;
        this.rgain = .5;
        this.lastvbc = 0;
        this.lastvbe = 0;
        this.leakage = 1e-13;
        if (st && st.length > 0) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          pnp = st.shift();
          if (pnp) {
            this.pnp = parseInt(pnp);
          }
          lastvbe = st.shift();
          if (lastvbe) {
            this.lastvbe = parseFloat(lastvbe);
          }
          lastvbc = st.shift();
          if (lastvbc) {
            this.lastvbc = parseFloat(lastvbc);
          }
          beta = st.shift();
          if (beta) {
            this.beta = parseFloat(beta);
          }
        }
        this.volts[0] = 0;
        this.volts[1] = -this.lastvbe;
        this.volts[2] = -this.lastvbc;
        this.setup();
      }

      TransistorElm.prototype.setup = function() {
        this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
        this.fgain = this.beta / (this.beta + 1);
        return this.noDiagonal = true;
      };

      TransistorElm.prototype.nonLinear = function() {
        return true;
      };

      TransistorElm.prototype.reset = function() {
        this.volts[0] = this.volts[1] = this.volts[2] = 0;
        return this.lastvbc = this.lastvbe = this.curcount_c = this.curcount_e = this.curcount_b = 0;
      };

      TransistorElm.prototype.getDumpType = function() {
        return "t";
      };

      TransistorElm.prototype.dump = function() {
        return TransistorElm.__super__.dump.call(this) + " " + this.pnp + " " + (this.volts[0] - this.volts[1]) + " " + (this.volts[0] - this.volts[2]) + " " + this.beta;
      };

      TransistorElm.prototype.draw = function(renderContext) {
        var color;
        this.setBboxPt(this.point1, this.point2, 16);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.coll[0], this.coll[1], color);
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.emit[0], this.emit[1], color);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.base, color);
        this.drawDots(this.base, this.point1, renderContext);
        this.drawDots(this.coll[1], this.coll[0], renderContext);
        this.drawDots(this.emit[1], this.emit[0], renderContext);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickPolygonP(this.rectPoly, color);
        return this.drawPosts(renderContext);
      };

      TransistorElm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.point1;
        } else {
          if (n === 1) {
            return this.coll[0];
          } else {
            return this.emit[0];
          }
        }
      };

      TransistorElm.prototype.getPostCount = function() {
        return 3;
      };

      TransistorElm.prototype.getPower = function() {
        return (this.volts[0] - this.volts[2]) * this.ib + (this.volts[1] - this.volts[2]) * this.ic;
      };

      TransistorElm.prototype.setPoints = function(stamper) {
        var hs, hs2, pt, _ref, _ref1, _ref2, _ref3;
        TransistorElm.__super__.setPoints.call(this);
        hs = 16;
        if ((this.flags & TransistorElm.FLAG_FLIP) !== 0) {
          this.dsign = -this.dsign;
        }
        hs2 = hs * this.dsign * this.pnp;
        this.coll = CircuitComponent.newPointArray(2);
        this.emit = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.point1, this.point2, 1, hs2), this.coll[0] = _ref[0], this.emit[0] = _ref[1];
        this.rect = CircuitComponent.newPointArray(4);
        _ref1 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 16 / this.dn, hs), this.rect[0] = _ref1[0], this.rect[1] = _ref1[1];
        _ref2 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 13 / this.dn, hs), this.rect[2] = _ref2[0], this.rect[3] = _ref2[1];
        _ref3 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 13 / this.dn, 6 * this.dsign * this.pnp), this.coll[1] = _ref3[0], this.emit[1] = _ref3[1];
        this.base = new Point();
        this.base = DrawHelper.interpPoint(this.point1, this.point2, 1 - 16 / this.dn);
        this.rectPoly = DrawHelper.createPolygon(this.rect[0], this.rect[2], this.rect[3], this.rect[1]);
        if (this.pnp !== 1) {
          pt = DrawHelper.interpPoint(this.point1, this.point2, 1 - 11 / this.dn, -5 * this.dsign * this.pnp);
          return this.arrowPoly = DrawHelper.calcArrow(this.emit[0], pt, 8, 4);
        }
      };

      TransistorElm.prototype.limitStep = function(vnew, vold) {
        var arg, oo;
        arg = 0;
        oo = vnew;
        if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
          if (vold > 0) {
            arg = 1 + (vnew - vold) / this.vt;
            if (arg > 0) {
              vnew = vold + this.vt * Math.log(arg);
            } else {
              vnew = this.vcrit;
            }
          } else {
            vnew = this.vt * Math.log(vnew / this.vt);
          }
          this.getParentCircuit().converged = false;
        }
        return vnew;
      };

      TransistorElm.prototype.stamp = function(stamper) {
        stamper.stampNonLinear(this.nodes[0]);
        stamper.stampNonLinear(this.nodes[1]);
        return stamper.stampNonLinear(this.nodes[2]);
      };

      TransistorElm.prototype.doStep = function(stamper) {
        var expbc, expbe, gcc, gce, gec, gee, pcoef, subIterations, vbc, vbe;
        subIterations = this.getParentCircuit().Solver.subIterations;
        vbc = this.volts[0] - this.volts[1];
        vbe = this.volts[0] - this.volts[2];
        if (Math.abs(vbc - this.lastvbc) > .01 || Math.abs(vbe - this.lastvbe) > .01) {
          this.getParentCircuit.converged = false;
        }
        this.gmin = 0;
        if (subIterations > 100) {
          this.gmin = Math.exp(-9 * Math.log(10) * (1 - subIterations / 3000.0));
          if (this.gmin > .1) {
            this.gmin = .1;
          }
        }
        vbc = this.pnp * this.limitStep(this.pnp * vbc, this.pnp * this.lastvbc);
        vbe = this.pnp * this.limitStep(this.pnp * vbe, this.pnp * this.lastvbe);
        this.lastvbc = vbc;
        this.lastvbe = vbe;
        pcoef = this.vdcoef * this.pnp;
        expbc = Math.exp(vbc * pcoef);
        expbe = Math.exp(vbe * pcoef);
        if (expbe < 1) {
          expbe = 1;
        }
        this.ie = this.pnp * this.leakage * (-(expbe - 1) + this.rgain * (expbc - 1));
        this.ic = this.pnp * this.leakage * (this.fgain * (expbe - 1) - (expbc - 1));
        this.ib = -(this.ie + this.ic);
        gee = -this.leakage * this.vdcoef * expbe;
        gec = this.rgain * this.leakage * this.vdcoef * expbc;
        gce = -gee * this.fgain;
        gcc = -gec * (1 / this.rgain);
        stamper.stampMatrix(this.nodes[0], this.nodes[0], -gee - gec - gce - gcc + this.gmin * 2);
        stamper.stampMatrix(this.nodes[0], this.nodes[1], gec + gcc - this.gmin);
        stamper.stampMatrix(this.nodes[0], this.nodes[2], gee + gce - this.gmin);
        stamper.stampMatrix(this.nodes[1], this.nodes[0], gce + gcc - this.gmin);
        stamper.stampMatrix(this.nodes[1], this.nodes[1], -gcc + this.gmin);
        stamper.stampMatrix(this.nodes[1], this.nodes[2], -gce);
        stamper.stampMatrix(this.nodes[2], this.nodes[0], gee + gec - this.gmin);
        stamper.stampMatrix(this.nodes[2], this.nodes[1], -gec);
        stamper.stampMatrix(this.nodes[2], this.nodes[2], -gee + this.gmin);
        stamper.stampRightSide(this.nodes[0], -this.ib - (gec + gcc) * vbc - (gee + gce) * vbe);
        stamper.stampRightSide(this.nodes[1], -this.ic + gce * vbe + gcc * vbc);
        return stamper.stampRightSide(this.nodes[2], -this.ie + gee * vbe + gec * vbc);
      };

      TransistorElm.prototype.getInfo = function(arr) {
        var vbc, vbe, vce;
        arr[0] = "transistor (" + (this.pnp === -1 ? "PNP)" : "NPN)") + " beta=" + this.beta.toFixed(4);
        arr[0] = "";
        vbc = this.volts[0] - this.volts[1];
        vbe = this.volts[0] - this.volts[2];
        vce = this.volts[1] - this.volts[2];
        if (vbc * this.pnp > .2) {
          arr[1] = (vbe * this.pnp > .2 ? "saturation" : "reverse active");
        } else {
          arr[1] = (vbe * this.pnp > .2 ? "fwd active" : "cutoff");
        }
        arr[2] = "Ic = " + DrawHelper.getCurrentText(this.ic);
        arr[3] = "Ib = " + DrawHelper.getCurrentText(this.ib);
        arr[4] = "Vbe = " + DrawHelper.getVoltageText(vbe);
        arr[5] = "Vbc = " + DrawHelper.getVoltageText(vbc);
        return arr[6] = "Vce = " + DrawHelper.getVoltageText(vce);
      };

      TransistorElm.prototype.getScopeValue = function(x) {
        switch (x) {
          case Oscilloscope.VAL_IB:
            return this.ib;
          case Oscilloscope.VAL_IC:
            return this.ic;
          case Oscilloscope.VAL_IE:
            return this.ie;
          case Oscilloscope.VAL_VBE:
            return this.volts[0] - this.volts[2];
          case Oscilloscope.VAL_VBC:
            return this.volts[0] - this.volts[1];
          case Oscilloscope.VAL_VCE:
            return this.volts[1] - this.volts[2];
        }
        return 0;
      };

      TransistorElm.prototype.getScopeUnits = function(x) {
        switch (x) {
          case Oscilloscope.VAL_IB:
          case Oscilloscope.VAL_IC:
          case Oscilloscope.VAL_IE:
            return "A";
          default:
            return "V";
        }
      };

      TransistorElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Beta/hFE", this.beta, 10, 1000).setDimensionless();
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Swap E/C", (this.flags & TransistorElm.FLAG_FLIP) !== 0);
          return ei;
        }
        return null;
      };

      TransistorElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.beta = ei.value;
          this.setup();
        }
        if (n === 1) {
          if (ei.checkbox.getState()) {
            this.flags |= TransistorElm.FLAG_FLIP;
          } else {
            this.flags &= ~TransistorElm.FLAG_FLIP;
          }
          return this.setPoints();
        }
      };

      TransistorElm.prototype.canViewInScope = function() {
        return true;
      };

      return TransistorElm;

    })(CircuitComponent);
    return TransistorElm;
  });

}).call(this);
