MosfetElm.prototype = new CircuitElement();
MosfetElm.prototype.constructor = MosfetElm;

function MosfetElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f);

    this.pnp = ((f & MosfetElm.FLAG_PNP) != 0) ? -1 : 1;
    this.noDiagonal = true;
    this.vt = this.getDefaultThreshold();

    try {
        if (st && st.length > 0) {
            if (typeof st == 'string')
                st = st.split(' ');
            this.vt = st[0];
        }

    } catch (e) {
    }
}
;

MosfetElm.prototype.pnp;
MosfetElm.FLAG_PNP = 1;
MosfetElm.FLAG_SHOWVT = 2;
MosfetElm.FLAG_DIGITAL = 4;
MosfetElm.prototype.vt = 1.5;

MosfetElm.prototype.pcircler;
MosfetElm.prototype.src = []; // Array of points
MosfetElm.prototype.drn = []; // Array of points
MosfetElm.prototype.gate = [];
MosfetElm.prototype.pcircle = [];

MosfetElm.prototype.arrowPoly; // Polygon


MosfetElm.prototype.getDefaultThreshold = function () {
    return 1.5;
};

MosfetElm.prototype.getBeta = function () {
    return .02;
};

MosfetElm.prototype.nonLinear = function () {
    return true;
};

MosfetElm.prototype.drawDigital = function () {
    return (this.flags & MosfetElm.FLAG_DIGITAL) != 0;
};

MosfetElm.prototype.reset = function () {
    this.lastv1 = this.lastv2 = this.volts[0] = this.volts[1] = this.volts[2] = this.curcount = 0;
};

MosfetElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.vt;
}

MosfetElm.prototype.getDumpType = function () {
    return 'f';
};


MosfetElm.prototype.hs = 16;

MosfetElm.prototype.draw = function () {
    this.setBboxPt(this.point1, this.point2, this.hs);

    var color = this.setVoltageColor(this.volts[1]);
    CircuitElement.drawThickLinePt(this.src[0], this.src[1], color);
    color = this.setVoltageColor(this.volts[2]);
    CircuitElement.drawThickLinePt(this.drn[0], this.drn[1], color);
    var segments = 6;
    var i;
    this.setPowerColor(true);
    var segf = 1. / segments;

    for (i = 0; i != segments; i++) {
        var v = this.volts[1] + (this.volts[2] - this.volts[1]) * i / segments;
        color = this.setVoltageColor(v);
        CircuitElement.interpPoint(this.src[1], this.drn[1], CircuitElement.ps1, i * segf);
        CircuitElement.interpPoint(this.src[1], this.drn[1], CircuitElement.ps2, (i + 1) * segf);
        CircuitElement.drawThickLinePt(CircuitElement.ps1, CircuitElement.ps2, color);
    }

    color = this.setVoltageColor(this.volts[1]);
    CircuitElement.drawThickLinePt(this.src[1], this.src[2], color);
    color = this.setVoltageColor(this.volts[2]);
    CircuitElement.drawThickLinePt(this.drn[1], this.drn[2], color);

    if (!this.drawDigital()) {
        color = this.setVoltageColor(this.pnp == 1 ? this.volts[1] : this.volts[2]);
        CircuitElement.drawThickPolygonP(this.arrowPoly, color);
        //g.fillPolygon(arrowPoly);
    }

    if (Circuit.powerCheckItem) {
    }
    //g.setColor(Color.gray);
    color = this.setVoltageColor(this.volts[0]);
    CircuitElement.drawThickLinePt(this.point1, this.gate[1], color);
    CircuitElement.drawThickLinePt(this.gate[0], this.gate[2], color);

    if (this.drawDigital() && this.pnp == -1) {
    }
    //Main.getMainCanvas().drawThickCircle(pcircle.x, pcircle.y, pcircler, Settings.FG_COLOR);
    //drawThickCircle(g, pcircle.x, pcircle.y, pcircler);

    if ((this.flags & MosfetElm.FLAG_SHOWVT) != 0) {
        var s = "" + (this.vt * this.pnp);
        //g.setColor(whiteColor);
        //g.setFont(unitsFont);
        this.drawCenteredText(s, this.x2 + 2, this.y2, false);
    }

    if ((this.needsHighlight() || Circuit.dragElm == this) && this.dy == 0) {
        //g.setColor(Color.white);
        //g.setFont(unitsFont);
        var ds = sign(this.dx);
//        Main.getMainCanvas().drawString("G", gate[1].x - 10 * ds, gate[1].y - 5);
//        Main.getMainCanvas().drawString(pnp == -1 ? "D" : "S", src[0].x - 3 + 9 * ds, src[0].y + 4);
//        Main.getMainCanvas().drawString(pnp == -1 ? "S" : "D", drn[0].x - 3 + 9 * ds, drn[0].y + 4);
//
//        g.drawString("G", gate[1].x - 10 * ds, gate[1].y - 5);
//        g.drawString(pnp == -1 ? "D" : "S", src[0].x - 3 + 9 * ds, src[0].y + 4); // x+6 if ds=1, -12 if -1
//        g.drawString(pnp == -1 ? "S" : "D", drn[0].x - 3 + 9 * ds, drn[0].y + 4);
    }

    this.curcount = this.updateDotCount(-this.ids, this.curcount);
    this.drawDots(this.src[0], this.src[1], this.curcount);
    this.drawDots(this.src[1], this.drn[1], this.curcount);
    this.drawDots(this.drn[1], this.drn[0], this.curcount);
    this.drawPosts();
};


MosfetElm.prototype.getPost = function (n) {
    return (n == 0) ? this.point1 : (n == 1) ? this.src[0] : this.drn[0];
};

MosfetElm.prototype.getCurrent = function () {
    return this.ids;
}

MosfetElm.prototype.getPower = function () {
    return this.ids * (this.volts[2] - this.volts[1]);
}

MosfetElm.prototype.getPostCount = function () {
    return 3;
};

MosfetElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);

    // find the coordinates of the various points we need to draw
    // the MOSFET.
    var hs2 = this.hs * this.dsign;
    this.src = CircuitElement.newPointArray(3);
    this.drn = CircuitElement.newPointArray(3);
    CircuitElement.interpPoint2(this.point1, this.point2, this.src[0], this.drn[0], 1, -hs2);
    CircuitElement.interpPoint2(this.point1, this.point2, this.src[1], this.drn[1], 1 - 22 / this.dn, -hs2);
    CircuitElement.interpPoint2(this.point1, this.point2, this.src[2], this.drn[2], 1 - 22 / this.dn, -hs2 * 4 / 3);

    this.gate = CircuitElement.newPointArray(3);
    CircuitElement.interpPoint2(this.point1, this.point2, this.gate[0], this.gate[2], 1 - 28 / this.dn, hs2 / 2); // was 1-20/dn
    CircuitElement.interpPoint(this.gate[0], this.gate[2], this.gate[1], .5);

    if (!this.drawDigital()) {
        if (this.pnp == 1)
            this.arrowPoly = CircuitElement.calcArrow(this.src[1], this.src[0], 10, 4);
        else
            this.arrowPoly = CircuitElement.calcArrow(this.drn[0], this.drn[1], 12, 5);
    } else if (this.pnp == -1) {
        CircuitElement.interpPoint(this.point1, this.point2, this.gate[1], 1 - 36 / this.dn);
        var dist = (this.dsign < 0) ? 32 : 31;
        this.pcircle = this.interpPointPt(this.point1, this.point2, 1 - dist / this.dn);
        this.pcircler = 3;
    }
}

MosfetElm.prototype.lastv1 = 0;
MosfetElm.prototype.lastv2 = 0;
MosfetElm.prototype.ids = 0;
MosfetElm.prototype.mode = 0;
MosfetElm.prototype.gm = 0;

MosfetElm.prototype.stamp = function () {

    Circuit.stampNonLinear(this.nodes[1]);
    Circuit.stampNonLinear(this.nodes[2]);
};

MosfetElm.prototype.doStep = function () {
    var vs = new Array(3);
    vs[0] = this.volts[0];
    vs[1] = this.volts[1];
    vs[2] = this.volts[2];

    if (vs[1] > this.lastv1 + .5)
        vs[1] = this.lastv1 + .5;
    if (vs[1] < this.lastv1 - .5)
        vs[1] = this.lastv1 - .5;
    if (vs[2] > this.lastv2 + .5)
        vs[2] = this.lastv2 + .5;
    if (vs[2] < this.lastv2 - .5)
        vs[2] = this.lastv2 - .5;

    var source = 1;
    var drain = 2;

    if (this.pnp * vs[1] > this.pnp * vs[2]) {
        source = 2;
        drain = 1;
    }

    var gate = 0;
    var vgs = vs[gate] - vs[source];
    var vds = vs[drain] - vs[source];

    if (Math.abs(this.lastv1 - vs[1]) > .01 ||
        Math.abs(this.lastv2 - vs[2]) > .01)
        Circuit.converged = false;

    this.lastv1 = vs[1];
    this.lastv2 = vs[2];

    var realvgs = vgs;
    var realvds = vds;

    vgs *= this.pnp;
    vds *= this.pnp;
    this.ids = 0;
    this.gm = 0;
    var Gds = 0;
    var beta = this.getBeta();

    if (vgs > .5 && this instanceof JFetElm) {
        Circuit.halt("JFET is reverse biased!", this);
        return;
    }
    if (vgs < this.vt) {
        // should be all zero, but that causes a singular matrix,
        // so instead we treat it as a large resistor
        Gds = 1e-8;
        this.ids = vds * Gds;
        this.mode = 0;
    } else if (vds < vgs - this.vt) {
        // linear
        this.ids = beta * ((vgs - this.vt) * vds - vds * vds * .5);
        this.gm = beta * vds;
        Gds = beta * (vgs - vds - this.vt);
        this.mode = 1;
    } else {
        // saturation; Gds = 0
        this.gm = beta * (vgs - this.vt);
        // use very small Gds to avoid nonconvergence
        Gds = 1e-8;
        this.ids = .5 * beta * (vgs - this.vt) * (vgs - this.vt) + (vds - (vgs - this.vt)) * Gds;
        this.mode = 2;
    }

    var rs = -this.pnp * this.ids + Gds * realvds + this.gm * realvgs;
    //console.log("M " + vds + " " + vgs + " " + ids + " " + gm + " "+ Gds + " " + volts[0] + " " + volts[1] + " " + volts[2] + " " + source + " " + rs + " " + this);
    Circuit.stampMatrix(this.nodes[drain], this.nodes[drain], Gds);
    Circuit.stampMatrix(this.nodes[drain], this.nodes[source], -Gds - this.gm);
    Circuit.stampMatrix(this.nodes[drain], this.nodes[gate], this.gm);

    Circuit.stampMatrix(this.nodes[source], this.nodes[drain], -Gds);
    Circuit.stampMatrix(this.nodes[source], this.nodes[source], Gds + this.gm);
    Circuit.stampMatrix(this.nodes[source], this.nodes[gate], -this.gm);

    Circuit.stampRightSide(this.nodes[drain], rs);
    Circuit.stampRightSide(this.nodes[source], -rs);

    if (source == 2 && this.pnp == 1 || source == 1 && this.pnp == -1)
        this.ids = -this.ids;
};

MosfetElm.prototype.getFetInfo = function (arr, n) {
    arr[0] = ((this.pnp == -1) ? "p-" : "n-") + n;
    arr[0] += " (Vt = " + CircuitElement.getVoltageText(this.pnp * this.vt) + ")";
    arr[1] = ((this.pnp == 1) ? "Ids = " : "Isd = ") + CircuitElement.getCurrentText(this.ids);
    arr[2] = "Vgs = " + CircuitElement.getVoltageText(this.volts[0] - this.volts[this.pnp == -1 ? 2 : 1]);
    arr[3] = ((this.pnp == 1) ? "Vds = " : "Vsd = ") + CircuitElement.getVoltageText(this.volts[2] - this.volts[1]);
    arr[4] = (this.mode == 0) ? "off" :
        (this.mode == 1) ? "linear" : "saturation";
    arr[5] = "gm = " + CircuitElement.getUnitText(this.gm, "A/V");
};

MosfetElm.prototype.getInfo = function (arr) {
    this.getFetInfo(arr, "MOSFET");
};

MosfetElm.prototype.canViewInScope = function () {
    return true;
};

MosfetElm.prototype.getVoltageDiff = function () {
    return this.volts[2] - this.volts[1];
};

MosfetElm.prototype.getConnection = function (n1, n2) {
    return !(n1 == 0 || n2 == 0);
};

MosfetElm.prototype.getEditInfo = function (n) {
    if (n == 0)
        return new EditInfo("Threshold Voltage", this.pnp * this.vt, .01, 5);
    if (n == 1) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = 'Digital Symbol';// new Checkbox("Digital Symbol", this.drawDigital());
        return ei;
    }

    return null;
};

MosfetElm.prototype.setEditValue = function (n, ei) {
    if (n == 0)
        this.vt = this.pnp * ei.value;
    if (n == 1) {
        this.flags = (ei.checkbox) ? (this.flags | MosfetElm.FLAG_DIGITAL) : (this.flags & ~MosfetElm.FLAG_DIGITAL);
        this.setPoints();
    }
};

