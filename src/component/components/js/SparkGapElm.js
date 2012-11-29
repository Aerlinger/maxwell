SparkGapElm.prototype = new CircuitElement();
SparkGapElm.prototype.constructor = SparkGapElm;

function SparkGapElm(xa, ya, xb, yb, f, st) {

    CircuitElement.call(this, xa, ya, xb, yb, f);

    this.resistance = 0;
    this.offresistance = 1e9;
    this.onresistance = 1e3;
    this.breakdown = 1e3;
    this.holdcurrent = 0.001;
    this.state = false;

    if (st) {
        if (typeof st == 'string')
            st = st.split(' ');

        if (st) this.onresistance = parseFloat(st.shift());
        if (st) this.offresistance = parseFloat(st.shift());
        if (st) this.breakdown = parseFloat(st.shift());
        if (st) this.holdcurrent = parseFloat(st.shift());
    }

}
;

SparkGapElm.prototype.nonLinear = function () {
    return true;
};

SparkGapElm.prototype.getDumpType = function () {
    return 187;
};

SparkGapElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.onresistance + " " + this.offresistance + " "
        + this.breakdown + " " + this.holdcurrent;
};

SparkGapElm.prototype.arrow1; // Polgons
SparkGapElm.prototype.arrow2;

SparkGapElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);
    var dist = 16;
    var alen = 8;
    this.calcLeads(dist + alen);
    var p1 = CircuitElement.interpPointPt(this.point1, this.point2, (this.dn - alen) / (2 * this.dn));
    this.arrow1 = CircuitElement.calcArrow(this.point1, p1, alen, alen);
    p1 = CircuitElement.interpPointPt(this.point1, this.point2, (this.dn + alen) / (2 * this.dn));
    this.arrow2 = CircuitElement.calcArrow(this.point2, p1, alen, alen);
};

SparkGapElm.prototype.draw = function () {
    var i;
    var v1 = this.volts[0];
    var v2 = this.volts[1];
    this.setBboxPt(this.point1, this.point2, 8);
    this.draw2Leads();
    this.setPowerColor(true);
    var color = this.setVoltageColor(this.volts[0]);
    CircuitElement.drawThickPolygonP(this.arrow1, color);

    color = this.setVoltageColor(this.volts[1]);
    CircuitElement.drawThickPolygonP(this.arrow2, color);
    if (this.state)
        this.doDots();
    this.drawPosts();
};

SparkGapElm.prototype.calculateCurrent = function () {
    var vd = this.volts[0] - this.volts[1];
    this.current = vd / this.resistance;
};

SparkGapElm.prototype.reset = function () {
    CircuitElement.prototype.reset.call(this);
    this.state = false;
};

SparkGapElm.prototype.startIteration = function () {
    if (Math.abs(this.current) < this.holdcurrent)
        this.state = false;
    var vd = this.volts[0] - this.volts[1];
    if (Math.abs(vd) > this.breakdown)
        this.state = true;
};

SparkGapElm.prototype.doStep = function () {
    this.resistance = (this.state) ? this.onresistance : this.offresistance;
    Circuit.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
};

SparkGapElm.prototype.stamp = function () {
    Circuit.stampNonLinear(this.nodes[0]);
    Circuit.stampNonLinear(this.nodes[1]);
};

SparkGapElm.prototype.getInfo = function (arr) {
    arr[0] = "spark gap";
    this.getBasicInfo(arr);
    arr[3] = this.state ? "on" : "off";
    arr[4] = "Ron = " + CircuitElement.getUnitText(this.onresistance, Circuit.ohmString);
    arr[5] = "Roff = " + CircuitElement.getUnitText(this.offresistance, Circuit.ohmString);
    arr[6] = "Vbreakdown = " + CircuitElement.getUnitText(this.breakdown, "V");
};

SparkGapElm.prototype.getEditInfo = function (n) {
    // ohmString doesn't work here on linux

    if (n == 0)
        return new EditInfo("On resistance (ohms)", this.onresistance, 0, 0);
    if (n == 1)
        return new EditInfo("Off resistance (ohms)", this.offresistance, 0, 0);
    if (n == 2)
        return new EditInfo("Breakdown voltage", this.breakdown, 0, 0);
    if (n == 3)
        return new EditInfo("Holding current (A)", this.holdcurrent, 0, 0);
    return null;

};

SparkGapElm.prototype.getEditInfo = function (n, ei) {
    if (ei.value > 0 && n == 0)
        onresistance = ei.value;
    if (ei.value > 0 && n == 1)
        offresistance = ei.value;
    if (ei.value > 0 && n == 2)
        breakdown = ei.value;
    if (ei.value > 0 && n == 3)
        holdcurrent = ei.value;
};

SparkGapElm.prototype.needsShortcut = function () {
    return false;
};