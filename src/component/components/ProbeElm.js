ProbeElm.prototype = new CircuitElement();
ProbeElm.prototype.constructor = ProbeElm;

function ProbeElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f);

}
;

ProbeElm.FLAG_SHOWVOLTAGE = 1;

ProbeElm.prototype.center;

ProbeElm.prototype.getDumpType = function () {
    return 'p';
};

ProbeElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);

    // swap points so that we subtract higher from lower
    if (this.point2.y < this.point1.y) {
        var x = this.point1;
        this.point1 = this.point2;
        this.point2 = this.x1;
    }
    this.center = CircuitElement.interpPointPt(this.point1, this.point2, .5);
};

ProbeElm.prototype.draw = function () {
    var hs = 8;

    CircuitElement.setBboxPt(this.point1, this.point2, hs);
    var selected = (this.needsHighlight() || Circuit.plotYElm == this);
    var len = (selected || Circuit.dragElm == this) ? 16 : this.dn - 32;

    CircuitElement.calcLeads(Math.floor(len));
    var color = this.setVoltageColor(this.volts[0]);

    if (selected)
        color = CircuitElement.selectColor;

    CircuitElement.drawThickLinePt(this.point1, this.lead1, color);

    color = this.setVoltageColor(this.volts[1]);
    if (selected)
        CircuitElement.setColor(this.selectColor);

    CircuitElement.drawThickLinePt(this.lead2, this.point2);
    var f = new Font("SansSerif", Font.BOLD, 14);

    CircuitElement.setFont(f);

    if (this == Circuit.plotXElm)
        CircuitElement.drawCenteredText("X", this.center.x1, this.center.y, color);
    if (this == Circuit.plotYElm)
        CircuitElement.drawCenteredText("Y", this.center.x1, this.center.y, color);
    if (this.mustShowVoltage()) {
        var s = CircuitElement.getShortUnitText(volts[0], "V");
        this.drawValues(s, 4);
    }

    this.drawPosts();
};


ProbeElm.prototype.mustShowVoltage = function () {
    return (this.flags & ProbeElm.FLAG_SHOWVOLTAGE) != 0;
};

ProbeElm.prototype.getInfo = function (arr) {
    arr[0] = "scope probe";
    arr[1] = "Vd = " + CircuitElement.getVoltageText(this.getVoltageDiff());
};

ProbeElm.prototype.getConnection = function (n1, n2) {
    return false;
};

ProbeElm.prototype.getEditInfo = function (n) {
    if (n == 0) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = new Checkbox("Show Voltage", this.mustShowVoltage());
        return ei;
    }
    return null;
};

ProbeElm.prototype.setEditValue = function (n, ei) {
    if (n == 0) {
        if (ei.checkbox.getState())
            flags = ProbeElm.FLAG_SHOWVOLTAGE;
        else
            flags &= ~ProbeElm.FLAG_SHOWVOLTAGE;
    }
};