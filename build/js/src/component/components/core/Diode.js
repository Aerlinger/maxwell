(function() {
  define([], function() {
    var Diode;
    Diode = (function() {
      Diode.leakage = 1e-14;

      function Diode(circuit) {
        this.nodes = new Array(2);
        this.vt = 0;
        this.vdcoef = 0;
        this.fwdrop = 0;
        this.zvoltage = 0;
        this.zoffset = 0;
        this.lastvoltdiff = 0;
        this.crit = 0;
        this.circuit = circuit;
        this.leakage = 1e-14;
      }

      Diode.prototype.setup = function(fw, zv) {
        var i;
        this.fwdrop = fw;
        this.zvoltage = zv;
        this.vdcoef = Math.log(1 / this.leakage + 1) / this.fwdrop;
        this.vt = 1 / this.vdcoef;
        this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
        if (this.zvoltage !== 0) {
          i = -.005;
          return this.zoffset = this.zvoltage - Math.log(-(1 + i / this.leakage)) / this.vdcoef;
        }
      };

      Diode.prototype.reset = function() {
        return this.lastvoltdiff = 0;
      };

      Diode.prototype.limitStep = function(vnew, vold) {
        var arg, oo, v0;
        arg = void 0;
        oo = vnew;
        if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
          if (vold > 0) {
            arg = 1 + (vnew - vold) / this.vt;
            if (arg > 0) {
              vnew = vold + this.vt * Math.log(arg);
              v0 = Math.log(1e-6 / this.leakage) * this.vt;
              vnew = Math.max(v0, vnew);
            } else {
              vnew = this.vcrit;
            }
          } else {
            vnew = this.vt * Math.log(vnew / this.vt);
          }
          this.circuit.converged = false;
        } else if (vnew < 0 && this.zoffset !== 0) {
          vnew = -vnew - this.zoffset;
          vold = -vold - this.zoffset;
          if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
            if (vold > 0) {
              arg = 1 + (vnew - vold) / this.vt;
              if (arg > 0) {
                vnew = vold + this.vt * Math.log(arg);
                v0 = Math.log(1e-6 / this.leakage) * this.vt;
                vnew = Math.max(v0, vnew);
              } else {
                vnew = this.vcrit;
              }
            } else {
              vnew = this.vt * Math.log(vnew / this.vt);
            }
            this.circuit.converged = false;
          }
          vnew = -(vnew + this.zoffset);
        }
        return vnew;
      };

      Diode.prototype.stamp = function(n0, n1, stamper) {
        this.nodes[0] = n0;
        this.nodes[1] = n1;
        stamper.stampNonLinear(this.nodes[0]);
        return stamper.stampNonLinear(this.nodes[1]);
      };

      Diode.prototype.doStep = function(voltdiff, stamper) {
        var eval_, geq, nc;
        if (Math.abs(voltdiff - this.lastvoltdiff) > .01) {
          this.circuit.converged = false;
        }
        voltdiff = this.limitStep(voltdiff, this.lastvoltdiff);
        this.lastvoltdiff = voltdiff;
        if (voltdiff >= 0 || this.zvoltage === 0) {
          eval_ = Math.exp(voltdiff * this.vdcoef);
          if (voltdiff < 0) {
            eval_ = 1;
          }
          geq = this.vdcoef * this.leakage * eval_;
          nc = (eval_ - 1) * this.leakage - geq * voltdiff;
          stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
          return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
        } else {
          geq = this.leakage * this.vdcoef * (Math.exp(voltdiff * this.vdcoef) + Math.exp((-voltdiff - this.zoffset) * this.vdcoef));
          nc = this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1) + geq * (-voltdiff);
          stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
          return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
        }
      };

      Diode.prototype.calculateCurrent = function(voltdiff) {
        if (voltdiff >= 0 || this.zvoltage === 0) {
          return this.leakage * (Math.exp(voltdiff * this.vdcoef) - 1);
        }
        return this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1);
      };

      return Diode;

    })();
    return Diode;
  });

}).call(this);
