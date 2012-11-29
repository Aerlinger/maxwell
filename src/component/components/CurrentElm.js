function CurrentElm(xa, ya, xb, yb, f, st) {

    CircuitElement.call(this, xa, ya, xb, yb, f);
    try {
        if (typeof st == 'string')
            st = st.split(' ');

        this.currentValue = parseFloat(st[0]);
    } catch (e) {
        this.currentValue = .01;
    }

}
;

CurrentElm.prototype = new CircuitElement();
CurrentElm.prototype.constructor = CurrentElm;

CurrentElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.currentValue;
};

CurrentElm.prototype.getDumpType = function () {
    return 'i';
};

CircuitElement.prototype.arrow;
CircuitElement.prototype.ashaft1;
CircuitElement.prototype.ashaft2;
CircuitElement.prototype.center;

CurrentElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);
    this.calcLeads(26);
    this.ashaft1 = CircuitElement.interpPointPt(this.lead1, this.lead2, .25);
    this.ashaft2 = CircuitElement.interpPointPt(this.lead1, this.lead2, .6);
    this.center = CircuitElement.interpPointPt(this.lead1, this.lead2, .5);
    var p2 = CircuitElement.interpPointPt(this.lead1, this.lead2, .75);
    this.arrow = CircuitElement.calcArrow(this.center, p2, 4, 4);
};

CurrentElm.prototype.draw = function () {
    var cr = 12;
    this.draw2Leads();
    this.setVoltageColor((this.volts[0] + this.volts[1]) / 2);
    this.setPowerColor(false);

    CircuitElement.drawCircle(this.center.x1, this.center.y, cr);
    CircuitElement.drawCircle(this.ashaft1, this.ashaft2);

    CircuitElement.fillPolygon(this.arrow);
    CircuitElement.setBboxPt(this.point1, this.point2, cr);

    this.doDots();
    if (Circuit.showValuesCheckItem) {
        var s = CircuitElement.getShortUnitText(this.currentValue, "A");
        if (this.dx == 0 || this.dy == 0)
            this.drawValues(s, cr);
    }
    this.drawPosts();
};

CurrentElm.prototype.stamp = function () {
    this.current = this.currentValue;
    Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], this.current);
};

CurrentElm.prototype.getEditInfo = function (n) {

    if (n == 0)
        return new EditInfo("Current (A)", this.currentValue, 0, .1);
    return null;

};

CurrentElm.prototype.setEditValue = function (n, ei) {
    this.currentValue = ei.value;
};

CurrentElm.prototype.getInfo = function (arr) {
    arr[0] = "current source";
    this.getBasicInfo(arr);
};

CurrentElm.prototype.getVoltageDiff = function () {
    return (this.volts[1] - this.volts[0]);
};