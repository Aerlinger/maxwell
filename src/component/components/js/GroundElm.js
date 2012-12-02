// Step 2: Prototype of DepthRectangle is Rectangle
GroundElm.prototype = new AbstractCircuitComponent();
// Step 3: Now we need to set the constructor to the DepthRectangle instead of Rectangle
GroundElm.prototype.constructor = GroundElm;

function GroundElm(xa, ya, xb, yb, f, st) {
    AbstractCircuitComponent.call(this, xa, ya, xb, yb, f, st);
}
;

GroundElm.prototype.getDumpType = function () {
    return 'g';
};

GroundElm.prototype.getPostCount = function () {
    return 1;
};

GroundElm.prototype.draw = function () {
    var color = this.setVoltageColor(0);
    this.doDots();

    AbstractCircuitComponent.drawThickLinePt(this.point1, this.point2, color);
    var i;

    for (i = 0; i < 3; i++) {
        var a = 10 - i * 4;
        var b = i * 5; // -10;
        AbstractCircuitComponent.interpPoint2(this.point1, this.point2, AbstractCircuitComponent.ps1, AbstractCircuitComponent.ps2, 1 + b / this.dn, a);
        AbstractCircuitComponent.drawThickLinePt(AbstractCircuitComponent.ps1, AbstractCircuitComponent.ps2, color);
    }

    AbstractCircuitComponent.interpPoint(this.point1, this.point2, AbstractCircuitComponent.ps2, 1 + 11. / this.dn);
    this.setBboxPt(this.point1, AbstractCircuitComponent.ps2, 11);
    this.drawPost(this.x1, this.y, this.nodes[0]);
};

GroundElm.prototype.setCurrent = function (x, c) {
    this.current = -c;
};

GroundElm.prototype.stamp = function () {
    Circuit.stampVoltageSource(0, this.nodes[0], this.voltSource, 0);
};

GroundElm.prototype.getVoltageDiff = function () {
    return 0;
};

GroundElm.prototype.getVoltageSourceCount = function () {
    return 1;
};

GroundElm.prototype.getInfo = function (arr) {
    arr[0] = "ground";
    arr[1] = "I = " + AbstractCircuitComponent.getCurrentText(this.getCurrent());
};

GroundElm.prototype.hasGroundConnection = function (n1) {
    return true;
};

GroundElm.prototype.needsShortcut = function () {
    return true;
};

GroundElm.prototype.toString = function () {
    return "GroundElm";
};