DiodeElm.FLAG_FWDROP = 1;
DiodeElm.DEFAULT_DROP = .805904783;

function DiodeElm(xa, ya, xb, yb, f, st) {
    AbstractCircuitComponent.call(this, xa, ya, xb, yb, f);

    this.diode = new Diode();

    this.fwdrop = DiodeElm.DEFAULT_DROP;

    this.zvoltage = 0;

    if ((f & DiodeElm.FLAG_FWDROP) > 0) {
        try {
            this.fwdrop = parseFloat(st);
        } catch (e) {
        }
    }

    this.setup();
}
;

DiodeElm.prototype = new AbstractCircuitComponent();
DiodeElm.prototype.constructor = DiodeElm;

DiodeElm.prototype.hs = 8;
DiodeElm.prototype.poly;
DiodeElm.prototype.cathode = [];

DiodeElm.prototype.nonLinear = function () {
    return true;
};

DiodeElm.prototype.setup = function () {
    this.diode.setup(this.fwdrop, this.zvoltage);
};

DiodeElm.prototype.getDumpType = function () {
    return 'd';
};

DiodeElm.prototype.dump = function () {
    this.flags |= DiodeElm.FLAG_FWDROP;
    return AbstractCircuitComponent.prototype.dump.call(this) + " " + this.fwdrop;
};


DiodeElm.prototype.setPoints = function () {
    AbstractCircuitComponent.prototype.setPoints.call(this);
    this.calcLeads(16);
    this.cathode = AbstractCircuitComponent.newPointArray(2);
    var pa = AbstractCircuitComponent.newPointArray(2);	// Point array
    AbstractCircuitComponent.interpPoint2(this.lead1, this.lead2, pa[0], pa[1], 0, this.hs);
    AbstractCircuitComponent.interpPoint2(this.lead1, this.lead2, this.cathode[0], this.cathode[1], 1, this.hs);
    this.poly = AbstractCircuitComponent.createPolygon(pa[0], pa[1], this.lead2);

};

DiodeElm.prototype.draw = function () {
    this.drawDiode();
    this.doDots();
    this.drawPosts();
};

DiodeElm.prototype.reset = function () {
    this.diode.reset();
    this.volts[0] = this.volts[1] = this.curcount = 0;
};

DiodeElm.prototype.drawDiode = function () {
    this.setBboxPt(this.point1, this.point2, this.hs);

    var v1 = this.volts[0];
    var v2 = this.volts[1];

    this.draw2Leads();

    // draw arrow
    //this.setPowerColor(true);
    var color = this.setVoltageColor(v1);

    AbstractCircuitComponent.drawThickPolygonP(this.poly, color);
    //g.fillPolygon(poly);

    // draw thing diode plate
    color = this.setVoltageColor(v2);
    AbstractCircuitComponent.drawThickLinePt(this.cathode[0], this.cathode[1], color);
};

DiodeElm.prototype.stamp = function () {
    this.diode.stamp(this.nodes[0], this.nodes[1]);
};

DiodeElm.prototype.doStep = function () {
    this.diode.doStep(this.volts[0] - this.volts[1]);
};

DiodeElm.prototype.calculateCurrent = function () {
    this.current = this.diode.calculateCurrent(this.volts[0] - this.volts[1]);
};

DiodeElm.prototype.getInfo = function (arr) {
    arr[0] = "diode";
    arr[1] = "I = " + AbstractCircuitComponent.getCurrentText(this.getCurrent());
    arr[2] = "Vd = " + AbstractCircuitComponent.getVoltageText(this.getVoltageDiff());
    arr[3] = "P = " + AbstractCircuitComponent.getUnitText(this.getPower(), "W");
    arr[4] = "Vf = " + AbstractCircuitComponent.getVoltageText(this.fwdrop);
};

DiodeElm.prototype.getEditInfo = function (n) {
    if (n == 0)
        return new EditInfo("Fwd Voltage @ 1A", this.fwdrop, 10, 1000);

    return null;
};

DiodeElm.prototype.setEditValue = function (n, ei) {
    this.fwdrop = ei.value;
    this.setup();
};

// TODO: fix
DiodeElm.prototype.needsShortcut = function () {
    //return getClass() == DiodeElm.class;
    return true;
};