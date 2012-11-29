TransistorElm.FLAG_FLIP = 1;

// Step 1: Prototype of DepthRectangle is Rectangle
TransistorElm.prototype = new CircuitElement();
// Step 2: Now we need to set the constructor to the DepthRectangle instead of Rectangle
TransistorElm.prototype.constructor = TransistorElm;


//TODO: Fully test transistor
function TransistorElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f);

    // Forward declarations:
    this.beta = 100;

    this.rect = [];             // Array of points
    this.coll = [];             // Array of points
    this.emit = [];             // Array of points
    this.base = new Point();    // Single point

    this.pnp = 0;
    this.fgain = 0;
    this.gmin = 0;

    this.ie = 0;
    this.ic = 0;
    this.ib = 0;
    this.curcount_c = 0;
    this.curcount_e = 0;
    this.curcount_b = 0;

    this.rectPoly = 0;
    this.arrowPoly = 0;

    this.vt = .025;
    this.vdcoef = 1 / this.vt;
    this.rgain = .5;
    this.vcrit = 0;
    this.lastvbc = 0;
    this.lastvbe = 0;
    this.leakage = 1e-13;


    if (st && st.length > 0) {
        if (typeof st == 'string')
            st = st.split(' ');

        var pnp = st.shift();
        if (pnp)
            this.pnp = parseInt(pnp);

        var lastvbe = st.shift();
        if (lastvbe)
            this.lastvbe = parseFloat(lastvbe);

        var lastvbc = st.shift();
        if (lastvbc)
            this.lastvbc = parseFloat(lastvbc);

        var beta = st.shift();
        if (beta)
            this.beta = parseFloat(beta);
    }

    this.volts[0] = 0;
    this.volts[1] = -this.lastvbe;
    this.volts[2] = -this.lastvbc;

    this.setup();

}

TransistorElm.prototype.setup = function () {
    this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
    this.fgain = this.beta / (this.beta + 1);
    this.noDiagonal = true;
};

TransistorElm.prototype.nonLinear = function () {
    return true;
};

TransistorElm.prototype.reset = function () {
    this.volts[0] = this.volts[1] = this.volts[2] = 0;
    this.lastvbc = this.lastvbe = this.curcount_c = this.curcount_e = this.curcount_b = 0;
};

TransistorElm.prototype.getDumpType = function () {
    return 't';
};

TransistorElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.pnp + " " + (this.volts[0] - this.volts[1]) + " " +
        (this.volts[0] - this.volts[2]) + " " + this.beta;
};


TransistorElm.prototype.draw = function () {

    this.setBboxPt(this.point1, this.point2, 16);
    this.setPowerColor(true);

    // draw collector
    var color = this.setVoltageColor(this.volts[1]);
    CircuitElement.drawThickLinePt(this.coll[0], this.coll[1], color);

    // draw emitter
    color = this.setVoltageColor(this.volts[2]);
    CircuitElement.drawThickLinePt(this.emit[0], this.emit[1], color);

    // draw arrow
    //g.setColor(lightGrayColor);
    CircuitElement.drawThickPolygonP(this.arrowPoly, Color.CYAN);

    // draw base
    color = this.setVoltageColor(this.volts[0]);

    if (Circuit.powerCheckItem)
        g.setColor(Color.gray);

    CircuitElement.drawThickLinePt(this.point1, this.base, color);

    // draw dots
    this.curcount_b = this.updateDotCount(-this.ib, this.curcount_b);
    this.drawDots(this.base, this.point1, this.curcount_b);
    this.curcount_c = this.updateDotCount(-this.ic, this.curcount_c);
    this.drawDots(this.coll[1], this.coll[0], this.curcount_c);
    this.curcount_e = this.updateDotCount(-this.ie, this.curcount_e);
    this.drawDots(this.emit[1], this.emit[0], this.curcount_e);

    // draw base rectangle
    color = this.setVoltageColor(this.volts[0]);

    this.setPowerColor(true);

    //g.fillPolygon(rectPoly);
    CircuitElement.drawThickPolygonP(this.rectPoly, color);

    if ((this.needsHighlight() || Circuit.dragElm == this) && this.dy == 0) {
        //g.setColor(Color.white);
        //g.setFont(this.unitsFont);

        CircuitElement.setColor(Color.white);

        var ds = sign(this.dx);
        this.drawCenteredText("B", this.base.x1 - 10 * ds, this.base.y - 5, Color.WHITE);
        this.drawCenteredText("C", this.coll[0].x1 - 3 + 9 * ds, this.coll[0].y + 4, Color.WHITE); // x+6 if ds=1, -12 if -1
        this.drawCenteredText("E", this.emit[0].x1 - 3 + 9 * ds, this.emit[0].y + 4, Color.WHITE);
    }

    this.drawPosts();
};

TransistorElm.prototype.getPost = function (n) {
    return (n == 0) ? this.point1 : (n == 1) ? this.coll[0] : this.emit[0];
};

TransistorElm.prototype.getPostCount = function () {
    return 3;
};

TransistorElm.prototype.getPower = function () {
    return (this.volts[0] - this.volts[2]) * this.ib + (this.volts[1] - this.volts[2]) * this.ic;
};


TransistorElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);
    var hs = 16;

    if ((this.flags & TransistorElm.FLAG_FLIP) != 0)
        this.dsign = -this.dsign;

    var hs2 = hs * this.dsign * this.pnp;

    // calc collector, emitter posts
    this.coll = CircuitElement.newPointArray(2);
    this.emit = CircuitElement.newPointArray(2);
    CircuitElement.interpPoint2(this.point1, this.point2, this.coll[0], this.emit[0], 1, hs2);

    // calc rectangle edges
    this.rect = CircuitElement.newPointArray(4);
    CircuitElement.interpPoint2(this.point1, this.point2, this.rect[0], this.rect[1], 1 - 16 / this.dn, hs);
    CircuitElement.interpPoint2(this.point1, this.point2, this.rect[2], this.rect[3], 1 - 13 / this.dn, hs);

    // calc points where collector/emitter leads contact rectangle
    CircuitElement.interpPoint2(this.point1, this.point2, this.coll[1], this.emit[1], 1 - 13 / this.dn, 6 * this.dsign * this.pnp);

    // calc point where base lead contacts rectangle
    this.base = new Point();
    CircuitElement.interpPoint(this.point1, this.point2, this.base, 1 - 16 / this.dn);

    // rectangle
    this.rectPoly = CircuitElement.createPolygon(this.rect[0], this.rect[2], this.rect[3], this.rect[1]);

    // arrow
    if (this.pnp == 1)
        this.arrowPoly = CircuitElement.calcArrow(this.emit[1], this.emit[0], 8, 4);
    else {
        var pt = CircuitElement.interpPoint(this.point1, this.point2, 1 - 11 / this.dn, -5 * this.dsign * this.pnp);
        this.arrowPoly = CircuitElement.calcArrow(this.emit[0], pt, 8, 4);
    }
};


TransistorElm.prototype.limitStep = function (vnew, vold) {
    var arg;
    var oo = vnew;

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
        Circuit.converged = false;
        //console.log(vnew + " " + oo + " " + vold);
    }
    return (vnew);
};

TransistorElm.prototype.stamp = function () {
    Circuit.stampNonLinear(this.nodes[0]);
    Circuit.stampNonLinear(this.nodes[1]);
    Circuit.stampNonLinear(this.nodes[2]);
};

TransistorElm.prototype.doStep = function () {

    var vbc = this.volts[0] - this.volts[1]; // typically negative
    var vbe = this.volts[0] - this.volts[2]; // typically positive

    if (Math.abs(vbc - this.lastvbc) > .01 || // .01
        Math.abs(vbe - this.lastvbe) > .01)
        Circuit.converged = false;

    this.gmin = 0;

    if (Circuit.subIterations > 100) {
        // if we have trouble converging, put a conductance in parallel with all P-N junctions.
        // Gradually increase the conductance value for each iteration.
        this.gmin = Math.exp(-9 * Math.log(10) * (1 - Circuit.subIterations / 3000.));
        if (this.gmin > .1)
            this.gmin = .1;
    }
    //console.log("T " + vbc + " " + vbe + "\n");
    vbc = this.pnp * this.limitStep(this.pnp * vbc, this.pnp * this.lastvbc);
    vbe = this.pnp * this.limitStep(this.pnp * vbe, this.pnp * this.lastvbe);

    this.lastvbc = vbc;
    this.lastvbe = vbe;

    var pcoef = this.vdcoef * this.pnp;
    var expbc = Math.exp(vbc * pcoef);
    /*if (expbc > 1e13 || Double.isInfinite(expbc))
     expbc = 1e13;*/
    var expbe = Math.exp(vbe * pcoef);
    if (expbe < 1)
        expbe = 1;
    /*if (expbe > 1e13 || Double.isInfinite(expbe))
     expbe = 1e13;*/
    this.ie = this.pnp * this.leakage * (-(expbe - 1) + this.rgain * (expbc - 1));
    this.ic = this.pnp * this.leakage * (this.fgain * (expbe - 1) - (expbc - 1));
    this.ib = -(this.ie + this.ic);
    //console.log("gain " + ic/ib);
    //console.log("T " + vbc + " " + vbe + " " + ie + " " + ic + "\n");
    var gee = -this.leakage * this.vdcoef * expbe;
    var gec = this.rgain * this.leakage * this.vdcoef * expbc;
    var gce = -gee * this.fgain;
    var gcc = -gec * (1 / this.rgain);

    /*console.log("gee = " + gee + "\n");
     console.log("gec = " + gec + "\n");
     console.log("gce = " + gce + "\n");
     console.log("gcc = " + gcc + "\n");
     console.log("gce+gcc = " + (gce+gcc) + "\n");
     console.log("gee+gec = " + (gee+gec) + "\n");*/

    // stamps from page 302 of Pillage.  Node 0 is the base, node 1 the collector, node 2 the emitter.  Also stamp
    // minimum conductance (gmin) between b,e and b,c
    Circuit.stampMatrix(this.nodes[0], this.nodes[0], -gee - gec - gce - gcc + this.gmin * 2);
    Circuit.stampMatrix(this.nodes[0], this.nodes[1], gec + gcc - this.gmin);
    Circuit.stampMatrix(this.nodes[0], this.nodes[2], gee + gce - this.gmin);
    Circuit.stampMatrix(this.nodes[1], this.nodes[0], gce + gcc - this.gmin);
    Circuit.stampMatrix(this.nodes[1], this.nodes[1], -gcc + this.gmin);
    Circuit.stampMatrix(this.nodes[1], this.nodes[2], -gce);
    Circuit.stampMatrix(this.nodes[2], this.nodes[0], gee + gec - this.gmin);
    Circuit.stampMatrix(this.nodes[2], this.nodes[1], -gec);
    Circuit.stampMatrix(this.nodes[2], this.nodes[2], -gee + this.gmin);

    // we are solving for v(k+1), not delta v, so we use formula
    // 10.5.13, multiplying J by v(k)
    Circuit.stampRightSide(this.nodes[0], -this.ib - (gec + gcc) * vbc - (gee + gce) * vbe);
    Circuit.stampRightSide(this.nodes[1], -this.ic + gce * vbe + gcc * vbc);
    Circuit.stampRightSide(this.nodes[2], -this.ie + gee * vbe + gec * vbc);
};

TransistorElm.prototype.getInfo = function (arr) {
    arr[0] = "transistor (" + ((this.pnp == -1) ? "PNP)" : "NPN)") + " beta=" + showFormat.format(this.beta);
    var vbc = this.volts[0] - this.volts[1];
    var vbe = this.volts[0] - this.volts[2];
    var vce = this.volts[1] - this.volts[2];

    if (vbc * this.pnp > .2)
        arr[1] = vbe * this.pnp > .2 ? "saturation" : "reverse active";
    else
        arr[1] = vbe * this.pnp > .2 ? "fwd active" : "cutoff";

    arr[2] = "Ic = " + this.getCurrentText(this.ic);
    arr[3] = "Ib = " + this.getCurrentText(this.ib);
    arr[4] = "Vbe = " + this.getVoltageText(vbe);
    arr[5] = "Vbc = " + this.getVoltageText(vbc);
    arr[6] = "Vce = " + this.getVoltageText(vce);
};

TransistorElm.prototype.getScopeValue = function (x) {
    switch (x) {
        case Scope.VAL_IB:
            return this.ib;
        case Scope.VAL_IC:
            return this.ic;
        case Scope.VAL_IE:
            return this.ie;
        case Scope.VAL_VBE:
            return this.volts[0] - this.volts[2];
        case Scope.VAL_VBC:
            return this.volts[0] - this.volts[1];
        case Scope.VAL_VCE:
            return this.volts[1] - this.volts[2];
    }
    return 0;
};

TransistorElm.prototype.getScopeUnits = function (x) {
    switch (x) {
        case Scope.VAL_IB:
        case Scope.VAL_IC:
        case Scope.VAL_IE:
            return "A";
        default:
            return "V";
    }
};

TransistorElm.prototype.getEditInfo = function (n) {
    if (n == 0)
        return new EditInfo("Beta/hFE", this.beta, 10, 1000).
            setDimensionless();
    if (n == 1) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = new Checkbox("Swap E/C", (this.flags & TransistorElm.FLAG_FLIP) != 0);
        return ei;
    }
    return null;
};

TransistorElm.prototype.setEditValue = function (n, ei) {
    if (n == 0) {
        this.beta = ei.value;
        this.setup();
    }
    if (n == 1) {
        if (ei.checkbox.getState())
            this.flags |= TransistorElm.FLAG_FLIP;
        else
            this.flags &= ~TransistorElm.FLAG_FLIP;
        this.setPoints();
    }
};

TransistorElm.prototype.canViewInScope = function () {
    return true;
};