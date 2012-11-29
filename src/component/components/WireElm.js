// Step 2: Prototype of DepthRectangle is Rectangle
WireElm.prototype = new CircuitElement();
// Step 3: Now we need to set the constructor to the DepthRectangle instead of Rectangle
WireElm.prototype.constructor = WireElm;

WireElm.FLAG_SHOWCURRENT = 1;
WireElm.FLAG_SHOWVOLTAGE = 2;


function WireElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f, st);
}
;

WireElm.prototype.draw = function () {
    var color = this.setVoltageColor(this.volts[0]);

    this.doDots();

    CircuitElement.drawThickLinePt(this.point1, this.point2, color);
    this.setBboxPt(this.point1, this.point2, 3);

    if (this.mustShowCurrent()) {
        var s = CircuitElement.getShortUnitText(Math.abs(this.getCurrent()), "A");
        this.drawValues(s, 4);
    } else if (this.mustShowVoltage()) {
        var s = CircuitElement.getShortUnitText(this.volts[0], "V");
        this.drawValues(s, 4);
    }

    this.drawPosts();

};

WireElm.prototype.stamp = function () {
    Circuit.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
};

WireElm.prototype.mustShowCurrent = function () {
    return (this.flags & WireElm.FLAG_SHOWCURRENT) != 0;
};

WireElm.prototype.mustShowVoltage = function () {
    return (this.flags & WireElm.FLAG_SHOWVOLTAGE) != 0;
};

WireElm.prototype.getVoltageSourceCount = function () {
    return 1;
};

WireElm.prototype.getInfo = function (arr) {
    arr[0] = "Wire";

    arr[1] = "I = " + CircuitElement.getCurrentDText(this.getCurrent());
    arr[2] = "V = " + CircuitElement.getVoltageText(this.volts[0]);
};

WireElm.prototype.getEditInfo = function (n) {
    // TODO:
//    if(n==0) {
//        var ei:EditInfo = new EditInfo("", 0, -1, -1);
//        //ei.checkbox = new Checkbox("Show Current", mustShowCurrent());
//        return ei;
//    }
//    if( n==1) {
//        var ei:EditInfo = new EditInfo("", 0, -1, -1);
//        //ei.checkbox = new Checkbox("Show Voltage", mustShowVoltage());
//        return ei;
//    }
//    return null;
};

WireElm.prototype.setEditValue = function (n, ei) {
    // TODO:
//    if(n==0) {
//        if(ei.isChecked)
//            flags = FLAG_SHOWCURRENT;
//        else
//            flags &= ~FLAG_SHOWCURRENT;
//    }
//    if( n==1 ) {
//        if(ei.isChecked)
//            flags = FLAG_SHOWVOLTAGE;
//        else
//            flags &- ~FLAG_SHOWVOLTAGE;
//    }
};

WireElm.prototype.getDumpType = function () {
    return 'w';
};

WireElm.prototype.getPower = function () {
    return 0;
};

WireElm.prototype.getVoltageDiff = function () {
    return this.volts[0];
};

WireElm.prototype.isWire = function () {
    return true;
};

WireElm.prototype.needsShortcut = function () {
    return true;
};