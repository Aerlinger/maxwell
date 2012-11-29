InductorElm.prototype = new CircuitElement();
InductorElm.prototype.constructor = InductorElm;

InductorElm.prototype.inductance = 0;

function InductorElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f);

    this.ind = new Inductor();

    if (st) {
        if (typeof st == 'string')
            st = st.split(" ");
        this.inductance = parseFloat(st[0]);
        this.current = parseFloat(st[1]);
    }

    this.ind.setup(this.inductance, this.current, this.flags);

}
;

InductorElm.prototype.draw = function () {

    this.doDots();

    var v1 = this.volts[0];
    var v2 = this.volts[1];
    var i;
    var hs = 8;

    this.setBboxPt(this.point1, this.point2, hs);
    this.draw2Leads();
    this.setPowerColor(false);
    this.drawCoil(8, this.lead1, this.lead2, v1, v2);

    if (Circuit.showValuesCheckItem) {
        var s = CircuitElement.getShortUnitText(this.inductance, "H");
        this.drawValues(s, hs);
    }

    this.drawPosts();
};

InductorElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.inductance + " " + this.current;
};

InductorElm.prototype.getDumpType = function () {
    return 'l';
};

InductorElm.prototype.startIteration = function () {
    this.ind.startIteration(this.volts[0] - this.volts[1]);
};

InductorElm.prototype.nonLinear = function () {
    return this.ind.nonLinear();
};

InductorElm.prototype.calculateCurrent = function () {
    var voltdiff = this.volts[0] - this.volts[1];
    this.current = this.ind.calculateCurrent(voltdiff);
};

InductorElm.prototype.doStep = function () {
    var voltdiff = this.volts[0] - this.volts[1];
    this.ind.doStep(voltdiff);
};


InductorElm.prototype.getInfo = function (arr) {
    arr[0] = "inductor";
    this.getBasicInfo(arr);
    arr[3] = "L = " + CircuitElement.getUnitText(this.inductance, "H");
    arr[4] = "P = " + CircuitElement.getUnitText(this.getPower(), "W");
};

InductorElm.prototype.reset = function () {
    this.current = this.volts[0] = this.volts[1] = this.curcount = 0;
    this.ind.reset();
};

InductorElm.prototype.getEditInfo = function (n) {
    if (n == 0)
        return new EditInfo("Inductance (H)", this.inductance, 0, 0);
    if (n == 1) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = 'Trapezoidal Approximation';// new Checkbox("Trapezoidal Approximation",	ind.isTrapezoidal());
        return ei;
    }
    return null;
};

InductorElm.prototype.setEditValue = function (n, ei) {
    // TODO Auto Generated method stub
    if (n == 0)
        this.inductance = ei.value;
    if (n == 1) {
        if (ei.checkbox.getState())
            this.flags &= ~Inductor.FLAG_BACK_EULER;
        else
            this.flags |= Inductor.FLAG_BACK_EULER;
    }

    this.ind.setup(this.inductance, this.current, this.flags);
};

InductorElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);
    this.calcLeads(32);
};

InductorElm.prototype.stamp = function () {
    this.ind.stamp(this.nodes[0], this.nodes[1]);
};