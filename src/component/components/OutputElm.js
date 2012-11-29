OutputElm.prototype = new CircuitElement();
OutputElm.prototype.constructor = OutputElm;

function OutputElm(xa, ya, xb, yb, f, st) {
    // st not used for OutputElm
    CircuitElement.call(this, xa, ya, xb, yb, f);
}
;


OutputElm.FLAG_VALUE = 1;

OutputElm.prototype.getDumpType = function () {
    return 'O';
};

OutputElm.prototype.getPostCount = function () {
    return 1;
};

OutputElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);
    this.lead1 = new Point();
};

OutputElm.prototype.draw = function () {
    var selected = (this.needsHighlight() || Circuit.plotYElm == this);
    //Font f = new Font("SansSerif", selected ? Font.BOLD : 0, 14);
    //g.setFont(f);
    var color = selected ? CircuitElement.selectColor : CircuitElement.whiteColor;

    var s = (this.flags & OutputElm.FLAG_VALUE) != 0 ? CircuitElement.getVoltageText(this.volts[0]) : "out";

    //FontMetrics fm = g.getFontMetrics();
    if (this == Circuit.plotXElm)
        s = "X";
    if (this == Circuit.plotYElm)
        s = "Y";

    CircuitElement.interpPoint(this.point1, this.point2, this.lead1, 1 - (3 * s.length / 2 + 8) / this.dn);         //fm.stringWidth(s)
    this.setBboxPt(this.point1, this.lead1, 0);
    this.drawCenteredText(s, this.x2, this.y2, true);

    color = this.setVoltageColor(this.volts[0]);
    if (selected)
        color = Settings.SELECT_COLOR;

    CircuitElement.drawThickLinePt(this.point1, this.lead1, color);
    this.drawPosts();
};

OutputElm.prototype.getVoltageDiff = function () {
    return this.volts[0];
};

OutputElm.prototype.getInfo = function (arr) {
    arr[0] = "output";
    arr[1] = "V = " + CircuitElement.getVoltageText(this.volts[0]);
};

OutputElm.prototype.getEditInfo = function (n) {
    if (n == 0) {
        var ei = new EditInfo("", 0, -1, -1);
        //ei.checkbox = new Checkbox("Show Voltage", (flags & FLAG_VALUE) != 0);
        ei.checkbox = 'Show Voltage';
        return ei;
    }
    return null;
};

OutputElm.prototype.setEditValue = function (n, ei) {
    // Todo: fix
    //if (n == 0)
    //   this.flags = (ei.checkbox.getState()) ? (this.flags | OutputElm.FLAG_VALUE) : (this.flags & ~OutputElm.FLAG_VALUE);
};