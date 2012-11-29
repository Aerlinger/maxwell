//Inductor.FLAG_BACK_EULER = 2;
Diode.prototype.leakage = 1e-14;


function Diode() {
    this.nodes = new Array(2);

    this.vt = 0;
    this.vdcoef = 0;
    this.fwdrop = 0;
    this.zvoltage = 0;
    this.zoffset = 0;
    this.lastvoltdiff = 0;
    this.crit = 0;
}
;

Diode.prototype.setup = function (fw, zv) {

    this.fwdrop = fw;
    this.zvoltage = zv;

    this.vdcoef = Math.log(1 / this.leakage + 1) / this.fwdrop;
    this.vt = 1 / this.vdcoef;
    // critical voltage for limiting; current is vt/sqrt(2) at
    // this voltage
    this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
    if (this.zvoltage == 0)
        this.zoffset = 0;
    else {
        // calculate offset which will give us 5mA at zvoltage
        var i = -.005;
        this.zoffset = this.zvoltage - Math.log(-(1 + i / this.leakage)) / this.vdcoef;
    }
};

Diode.prototype.reset = function () {
    this.lastvoltdiff = 0;
};

Diode.prototype.limitStep = function (vnew, vold) {
    var arg;
    var oo = vnew;

    // check new voltage; has current changed by factor of e^2?
    if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
        if (vold > 0) {
            arg = 1 + (vnew - vold) / this.vt;
            if (arg > 0) {
                // adjust vnew so that the current is the same
                // as in linearized model from previous iteration.
                // current at vnew = old current * arg
                vnew = vold + this.vt * Math.log(arg);
                // current at v0 = 1uA
                var v0 = Math.log(1e-6 / this.leakage) * this.vt;
                vnew = Math.max(v0, vnew);
            } else {
                vnew = this.vcrit;
            }
        } else {
            // adjust vnew so that the current is the same
            // as in linearized model from previous iteration.
            // (1/vt = slope of load line)
            vnew = this.vt * Math.log(vnew / this.vt);
        }
        Circuit.converged = false;
        //console.log(vnew + " " + oo + " " + vold);
    } else if (vnew < 0 && this.zoffset != 0) {
        // for Zener breakdown, use the same logic but translate the values
        vnew = -vnew - this.zoffset;
        vold = -vold - this.zoffset;

        if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
            if (vold > 0) {
                arg = 1 + (vnew - vold) / this.vt;
                if (arg > 0) {
                    vnew = vold + this.vt * Math.log(arg);
                    var v0 = Math.log(1e-6 / this.leakage) * this.vt;
                    vnew = Math.max(v0, vnew);
                    //console.log(oo + " " + vnew);
                } else {
                    vnew = this.vcrit;
                }
            } else {
                vnew = this.vt * Math.log(vnew / this.vt);
            }
            Circuit.converged = false;
        }
        vnew = -(vnew + this.zoffset);
    }
    return vnew;
};

Diode.prototype.stamp = function (n0, n1) {
    this.nodes[0] = n0;
    this.nodes[1] = n1;
    Circuit.stampNonLinear(this.nodes[0]);
    Circuit.stampNonLinear(this.nodes[1]);
}

Diode.prototype.doStep = function (voltdiff) {
    // used to have .1 here, but needed .01 for peak detector
    if (Math.abs(voltdiff - Circuit.lastvoltdiff) > .01)
        Circuit.converged = false;
    voltdiff = this.limitStep(voltdiff, Circuit.lastvoltdiff);
    Circuit.lastvoltdiff = voltdiff;

    if (voltdiff >= 0 || this.zvoltage == 0) {
        // regular diode or forward-biased zener
        var eval = Math.exp(voltdiff * this.vdcoef);
        // make diode linear with negative voltages; aids convergence
        if (voltdiff < 0)
            eval = 1;
        var geq = this.vdcoef * this.leakage * eval;
        var nc = (eval - 1) * this.leakage - geq * voltdiff;
        Circuit.stampConductance(this.nodes[0], this.nodes[1], geq);
        Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
    } else {
        // Zener diode

        /*
         * I(Vd) = Is * (exp[Vd*C] - exp[(-Vd-Vz)*C] - 1 )
         *
         * geq is I'(Vd)
         * nc is I(Vd) + I'(Vd)*(-Vd)
         */
        var geq = this.leakage * this.vdcoef * (
            Math.exp(voltdiff * this.vdcoef) + Math.exp((-voltdiff - this.zoffset) * this.vdcoef)
            );

        var nc = this.leakage * (
            Math.exp(voltdiff * this.vdcoef)
                - Math.exp((-voltdiff - this.zoffset) * this.vdcoef)
                - 1
            ) + geq * (-voltdiff);

        Circuit.stampConductance(this.nodes[0], this.nodes[1], geq);
        Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
    }
};

Diode.prototype.calculateCurrent = function (voltdiff) {
    if (voltdiff >= 0 || this.zvoltage == 0)
        return this.leakage * (Math.exp(voltdiff * this.vdcoef) - 1);
    return this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1);
};
