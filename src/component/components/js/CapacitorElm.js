CapacitorElm.prototype = new CircuitElement();
CapacitorElm.prototype.constructor = CapacitorElm;

CapacitorElm.prototype.capacitance = 5e-6;
CapacitorElm.prototype.compResistance = 0;
CapacitorElm.prototype.voltDiff = 10;
CapacitorElm.prototype.plate1 = [];
CapacitorElm.prototype.plate2 = [];

CapacitorElm.FLAG_BACK_EULER = 2;


function CapacitorElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f);

    if (st) {
        if (typeof st == 'string')
            st = st.split(' ');
        this.capacitance = Number(st[0]);
        this.voltdiff = Number(st[1]);
    }
}
;

CapacitorElm.prototype.isTrapezoidal = function () {
    return (this.flags & CapacitorElm.FLAG_BACK_EULER) == 0;
};

CapacitorElm.prototype.setNodeVoltage = function (n, c) {
    CircuitElement.prototype.setNodeVoltage.call(this, n, c);
    this.voltdiff = this.volts[0] - this.volts[1];
};

CapacitorElm.prototype.reset = function () {
    this.current = this.curcount = 0;
    // put small charge on caps when reset to start oscillators
    this.voltdiff = 1e-3;
};

CapacitorElm.prototype.getDumpType = function () {
    return 'c';
};

CapacitorElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.capacitance + " " + this.voltdiff;
};

CapacitorElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);
    var f = (this.dn / 2 - 4) / this.dn;
    // calc leads
    this.lead1 = CircuitElement.interpPointPt(this.point1, this.point2, f);
    this.lead2 = CircuitElement.interpPointPt(this.point1, this.point2, 1 - f);
    // calc plates
    this.plate1 = CircuitElement.newPointArray(2);
    this.plate2 = CircuitElement.newPointArray(2);

    CircuitElement.interpPoint2(this.point1, this.point2, this.plate1[0], this.plate1[1], f, 12);
    CircuitElement.interpPoint2(this.point1, this.point2, this.plate2[0], this.plate2[1], 1 - f, 12);
};

CapacitorElm.prototype.draw = function (g) {
    var hs = 12;
    this.setBboxPt(this.point1, this.point2, hs);

    this.curcount = this.updateDotCount();
    if (Circuit.dragElm != this) {
        this.drawDots(this.point1, this.lead1, this.curcount);
        this.drawDots(this.point2, this.lead2, -this.curcount);
    }

    // draw first lead and plate
    var color = this.setVoltageColor(this.volts[0]);
    CircuitElement.drawThickLinePt(this.point1, this.lead1, color);
    this.setPowerColor(false);
    CircuitElement.drawThickLinePt(this.plate1[0], this.plate1[1], color);
    // TODO:
//    if (CirSim.powerCheckItem)
//        g.beginFill(Color.GRAY);

    // draw second lead and plate
    color = this.setVoltageColor(this.volts[1]);
    CircuitElement.drawThickLinePt(this.point2, this.lead2, color);
    this.setPowerColor(false);
    CircuitElement.drawThickLinePt(this.plate2[0], this.plate2[1], color);

    this.drawPosts();
    if (Circuit.showValuesCheckItem) {
        var s = CircuitElement.getShortUnitText(this.capacitance, "F");
        this.drawValues(s, hs);
    }
};

CapacitorElm.prototype.stamp = function () {
    // capacitor companion model using trapezoidal approximation (Norton equivalent) consists of a current source in
    // parallel with a resistor.  Trapezoidal is more accurate than Backward Euler but can cause oscillatory behavior
    // if RC is small relative to the timestep.
    if (this.isTrapezoidal())
        this.compResistance = Circuit.timeStep / (2 * this.capacitance);
    else
        this.compResistance = Circuit.timeStep / this.capacitance;

    Circuit.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
    Circuit.stampRightSide(this.nodes[0]);
    Circuit.stampRightSide(this.nodes[1]);
};

CapacitorElm.prototype.startIteration = function () {
    if (this.isTrapezoidal())
        this.curSourceValue = -this.voltdiff / this.compResistance - this.current;
    else
        this.curSourceValue = -this.voltdiff / this.compResistance;
    //console.log("cap " + compResistance + " " + curSourceValue + " " + current + " " + voltdiff);
};

CapacitorElm.prototype.calculateCurrent = function () {
    var voltdiff = this.volts[0] - this.volts[1];
    // we check compResistance because this might get called before stamp(), which sets compResistance, causing
    // infinite current
    if (this.compResistance > 0)
        this.current = voltdiff / this.compResistance + this.curSourceValue;
};

CapacitorElm.prototype.curSourceValue = 0;

CapacitorElm.prototype.doStep = function () {
    Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
};

CapacitorElm.prototype.getInfo = function (arr) {
    arr[0] = "capacitor";
    this.getBasicInfo(arr);
    arr[3] = "C = " + CircuitElement.getUnitText(this.capacitance, "F");
    arr[4] = "P = " + CircuitElement.getUnitText(this.getPower(), "W");
    var v = this.getVoltageDiff();
    arr[4] = "U = " + CircuitElement.getUnitText(.5 * this.capacitance * v * v, "J");
};

CapacitorElm.prototype.getEditInfo = function (n) {

    if (n == 0)
        return new EditInfo("Capacitance (F)", this.capacitance, 0, 0);
    if (n == 1) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = 'Trapezoidal Approximation';//new Checkbox("Trapezoidal Approximation", isTrapezoidal());
        return ei;
    }

    return null;
};

CapacitorElm.prototype.setEditValue = function (n, ei) {
    if (n == 0 && ei.value > 0)
        this.capacitance = ei.value;
    if (n == 1) {
        if (ei.isChecked)
            this.flags &= ~CapacitorElm.FLAG_BACK_EULER;
        else
            this.flags |= CapacitorElm.FLAG_BACK_EULER;
    }
};

CapacitorElm.prototype.needsShortcut = function () {
    return true;
};

CapacitorElm.prototype.toString = function () {
    return "CapacitorElm";
};