RailElm.prototype = new VoltageElm();
RailElm.prototype.constructor = RailElm;

RailElm.FLAG_CLOCK = 1;

function RailElm(xa, ya, xb, yb, f, st) {
    VoltageElm.call(this, xa, ya, xb, yb, f, st);
}
;

RailElm.prototype.getDumpType = function () {
    return 'R';
};

RailElm.prototype.getPostCount = function () {
    return 1;
};

RailElm.prototype.setPoints = function () {
    VoltageElm.prototype.setPoints.call(this);
    this.lead1 = AbstractCircuitComponent.interpPointPt(this.point1, this.point2, 1 - VoltageElm.circleSize / this.dn);
};

RailElm.prototype.draw = function () {

    this.setBboxPt(this.point1, this.point2, this.circleSize);
    var color = this.setVoltageColor(this.volts[0]);
    AbstractCircuitComponent.drawThickLinePt(this.point1, this.lead1, color);
    var clock = this.waveform == VoltageElm.WF_SQUARE && (this.flags & VoltageElm.FLAG_CLOCK) != 0;

    if (this.waveform == VoltageElm.WF_DC || this.waveform == VoltageElm.WF_VAR || clock) {
        //Font f = new Font("SansSerif", 0, 12);
        //g.setFont(f);
        color = (this.needsHighlight() ? Settings.selectColor : Settings.whiteColor);
        //this.setPowerColor(g, false);
        var v = this.getVoltage();
        var s = AbstractCircuitComponent.getShortUnitText(v, "V");
        if (Math.abs(v) < 1)
            s = /*showFormat.format(v)*/v + "V";
        if (this.getVoltage() > 0)
            s = "+" + s;
        if (this instanceof AntennaElm)
            s = "Ant";
        if (clock)
            s = "CLK";
        this.drawCenteredText(s, this.x2, this.y2, true);
    } else {
        this.drawWaveform(this.point2);
    }

    this.drawPosts();
    this.curcount = this.updateDotCount(-this.current, this.curcount);
    if (Circuit.dragElm != this)
        this.drawDots(this.point1, this.lead1, this.curcount);

};

RailElm.prototype.getVoltageDiff = function () {
    return this.volts[0];
};

RailElm.prototype.stamp = function () {
    if (this.waveform == VoltageElm.WF_DC)
        Circuit.stampVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
    else
        Circuit.stampVoltageSource(0, this.nodes[0], this.voltSource);
};

RailElm.prototype.doStep = function () {
    if (this.waveform != VoltageElm.WF_DC)
        Circuit.updateVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
};

RailElm.prototype.hasGroundConnection = function (n1) {
    return true;
};