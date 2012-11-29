OpAmpElm.prototype = new CircuitElement();
OpAmpElm.prototype.constructor = OpAmpElm;

OpAmpElm.FLAG_SWAP = 1;
OpAmpElm.FLAG_SMALL = 2;
OpAmpElm.FLAG_LOWGAIN = 4;


function OpAmpElm(xa, ya, xb, yb, f, st) {

    CircuitElement.call(this, xa, ya, xb, yb, f);

    this.opsize = 0;
    this.opheight = 0;
    this.opwidth = 0;
    this.opaddtext = 0;

    this.maxOut = 0;
    this.minOut = 0;
    this.nOut = 0;
    this.gain = 1e6;
    this.gbw = 0;

    this.reset = false;
    ;

    this.in1p = [];
    this.in2p = [];
    this.textp = [];
    this.triangle;
    //Font plusFont;


    this.maxOut = 15;
    this.minOut = -15;

    // GBW has no effect in this version of the simulator, but we retain it to keep the file format the same
    this.gbw = 1e6;


    if (st && st.length > 0) {
        if (typeof st == 'string')
            st = st.split(' ');

        try {
            this.maxOut = parseFloat(st[0]);
            this.minOut = parseFloat(st[1]);
            this.gbw = parseFloat(st[2]);
        } catch (e) {
        }
    }

    this.noDiagonal = true;
    this.setSize((f & OpAmpElm.FLAG_SMALL) != 0 ? 1 : 2);
    this.setGain();
}
;

OpAmpElm.prototype.lastvd = 0;

OpAmpElm.prototype.setGain = function () {
    // gain of 100000 breaks e-amp-dfdx.txt
    // gain was 1000, but it broke amp-schmitt.txt
    this.gain = ((this.flags & OpAmpElm.FLAG_LOWGAIN) != 0) ? 1000 : 100000;
};

OpAmpElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.maxOut + " " + this.minOut + " " + this.gbw;
};

OpAmpElm.prototype.nonLinear = function () {
    return true;
};

OpAmpElm.prototype.draw = function () {
    this.setBboxPt(this.point1, this.point2, this.opheight * 2);
    var color = this.setVoltageColor(this.volts[0]);

    CircuitElement.drawThickLinePt(this.in1p[0], this.in1p[1], color);
    color = this.setVoltageColor(this.volts[1]);
    CircuitElement.drawThickLinePt(this.in2p[0], this.in2p[1], color);
    //g.setColor(this.needsHighlight() ? this.selectColor : this.lightGrayColor);
    this.setPowerColor(true);
    CircuitElement.drawThickPolygonP(this.triangle, this.needsHighlight() ? CircuitElement.selectColor : CircuitElement.lightGrayColor);
    //g.setFont(plusFont);

    //this.drawCenteredText("-", this.textp[0].x + 3, this.textp[0].y + 8, true).attr({'font-weight':'bold', 'font-size':17});
    //this.drawCenteredText("+", this.textp[1].x + 3, this.textp[1].y + 10, true).attr({'font-weight':'bold', 'font-size':14});

    color = this.setVoltageColor(this.volts[2]);
    CircuitElement.drawThickLinePt(this.lead2, this.point2, color);

    this.curcount = this.updateDotCount(this.current, this.curcount);
    this.drawDots(this.point2, this.lead2, this.curcount);
    this.drawPosts();
};

OpAmpElm.prototype.getPower = function () {
    return this.volts[2] * this.current;
};


OpAmpElm.prototype.setSize = function (s) {
    this.opsize = s;
    this.opheight = 8 * s;
    this.opwidth = 13 * s;
    this.flags = (this.flags & ~OpAmpElm.FLAG_SMALL) | ((s == 1) ? OpAmpElm.FLAG_SMALL : 0);
};

OpAmpElm.prototype.setPoints = function () {

    CircuitElement.prototype.setPoints.call(this);
    if (this.dn > 150 && this == Circuit.dragElm)
        this.setSize(2);
    var ww = Math.floor(this.opwidth);
    if (ww > this.dn / 2)
        ww = Math.floor(this.dn / 2);
    this.calcLeads(ww * 2);
    var hs = Math.floor(this.opheight * this.dsign);
    if ((this.flags & OpAmpElm.FLAG_SWAP) != 0)
        hs = -hs;
    this.in1p = CircuitElement.newPointArray(2);
    this.in2p = CircuitElement.newPointArray(2);
    this.textp = CircuitElement.newPointArray(2);

    CircuitElement.interpPoint2(this.point1, this.point2, this.in1p[0], this.in2p[0], 0, hs);
    CircuitElement.interpPoint2(this.lead1, this.lead2, this.in1p[1], this.in2p[1], 0, hs);
    CircuitElement.interpPoint2(this.lead1, this.lead2, this.textp[0], this.textp[1], .2, hs);

    var tris = CircuitElement.newPointArray(2);
    CircuitElement.interpPoint2(this.lead1, this.lead2, tris[0], tris[1], 0, hs * 2);
    this.triangle = CircuitElement.createPolygon(tris[0], tris[1], this.lead2);
    //this.plusFont = new Font("SansSerif", 0, opsize == 2 ? 14 : 10);
};

OpAmpElm.prototype.getPostCount = function () {
    return 3;
};

OpAmpElm.prototype.getPost = function (n) {
    return (n == 0) ? this.in1p[0] : (n == 1) ? this.in2p[0] : this.point2;
};

OpAmpElm.prototype.getVoltageSourceCount = function () {
    return 1;
};

OpAmpElm.prototype.getInfo = function (arr) {

    arr[0] = "op-amp";
    arr[1] = "V+ = " + CircuitElement.getVoltageText(this.volts[1]);
    arr[2] = "V- = " + CircuitElement.getVoltageText(this.volts[0]);

    // sometimes the voltage goes slightly outside range, to make convergence easier.  so we hide that here.
    var vo = Math.max(Math.min(this.volts[2], this.maxOut), this.minOut);
    arr[3] = "Vout = " + CircuitElement.getVoltageText(vo);
    arr[4] = "Iout = " + CircuitElement.getCurrentText(this.getCurrent());
    arr[5] = "range = " + CircuitElement.getVoltageText(this.minOut) + " to " +
        CircuitElement.getVoltageText(this.maxOut);

};


OpAmpElm.prototype.stamp = function () {
    var vn = Circuit.nodeList.length + this.voltSource;
    Circuit.stampNonLinear(vn);
    Circuit.stampMatrix(this.nodes[2], vn, 1);
};

OpAmpElm.prototype.doStep = function () {
    var vd = this.volts[1] - this.volts[0];

    if (Math.abs(this.lastvd - vd) > .1)
        Circuit.converged = false;
    else if (this.volts[2] > this.maxOut + .1 || this.volts[2] < this.minOut - .1)
        Circuit.converged = false;

    var x = 0;
    var vn = Circuit.nodeList.length + this.voltSource;
    var dx = 0;

    if (vd >= this.maxOut / this.gain && (this.lastvd >= 0 || getRand(4) == 1)) {
        dx = 1e-4;
        x = this.maxOut - dx * this.maxOut / this.gain;
    } else if (vd <= this.minOut / this.gain && (this.lastvd <= 0 || getRand(4) == 1)) {
        dx = 1e-4;
        x = this.minOut - dx * this.minOut / this.gain;
    } else
        dx = this.gain;
    //console.log("opamp " + vd + " " + volts[2] + " " + dx + " "  + x + " " + lastvd + " " + sim.converged);

    // newton's method:
    Circuit.stampMatrix(vn, this.nodes[0], dx);
    Circuit.stampMatrix(vn, this.nodes[1], -dx);
    Circuit.stampMatrix(vn, this.nodes[2], 1);
    Circuit.stampRightSide(vn, x);

    this.lastvd = vd;
    /*if (sim.converged)
     console.log((volts[1]-volts[0]) + " " + volts[2] + " " + initvd);*/
};

// there is no current path through the op-amp inputs, but there is an indirect path through the output to ground.
OpAmpElm.prototype.getConnection = function (n1, n2) {
    return false;
};

OpAmpElm.prototype.hasGroundConnection = function (n1) {
    return (n1 == 2);
};

OpAmpElm.prototype.getVoltageDiff = function () {
    return this.volts[2] - this.volts[1];
};

OpAmpElm.prototype.getDumpType = function () {
    return 'a';
};

OpAmpElm.prototype.getEditInfo = function (n) {
    if (n == 0)
        return new EditInfo("Max Output (V)", this.maxOut, 1, 20);
    if (n == 1)
        return new EditInfo("Min Output (V)", this.minOut, -20, 0);
    return null;
};

OpAmpElm.prototype.setEditValue = function (n, ei) {
    if (n == 0)
        this.maxOut = ei.value;
    if (n == 1)
        this.minOut = ei.value;
};