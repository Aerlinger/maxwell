ResistorElm.prototype.resistance = 1000;
ResistorElm.prototype.ps3 = new Point(100, 50);
ResistorElm.prototype.ps4 = new Point(100, 150);

// Step 2: Prototype of DepthRectangle is Rectangle
ResistorElm.prototype = new CircuitElement();
// Step 3: Now we need to set the constructor to the DepthRectangle instead of Rectangle
ResistorElm.prototype.constructor = ResistorElm;


///////////////////////////////////////////////////////////////////////////////
// Constructor ////////////////////////////////////////////////////////////////
function ResistorElm(xa, ya, xb, yb, f, st) {

    CircuitElement.call(this, xa, ya, xb, yb, f, st);

    //var options = st.split(' ');
    if (st && st.length > 0) {
        this.resistance = parseFloat(st);
    } else
        this.resistance = 500;
}
;

//ResistorElm.prototype.setPoints = function() {
//	// Call super-method
//	CircuitElement.prototype.setPoints.call(this);
//	this.calcLeads(32);
//	this.ps3 = new Point(50, 50);
//	this.ps4 = new Point(50, 150);
//};

ResistorElm.prototype.draw = function () {

    // Always Draw dots first
    this.doDots();

    var segments = 16;
    var ox = 0;
    var hs = 6;
    var v1 = this.volts[0];
    var v2 = this.volts[1];

    this.setBboxPt(this.point1, this.point2, hs);
    this.draw2Leads();
    this.setPowerColor(true);
    var segf = 1 / segments;


    for (var i = 0; i < segments; ++i) {
        var nx = 0;
        switch (i & 3) {
            case 0:
                nx = 1;
                break;
            case 2:
                nx = -1;
                break;
            default:
                nx = 0;
                break;
        }

        var v = v1 + (v2 - v1) * i / segments;
        var color = this.setVoltageColor(v);

        CircuitElement.interpPoint(this.lead1, this.lead2, CircuitElement.ps1, i * segf, hs * ox);
        CircuitElement.interpPoint(this.lead1, this.lead2, CircuitElement.ps2, (i + 1) * segf, hs * nx);

        CircuitElement.drawThickLinePt(CircuitElement.ps1, CircuitElement.ps2, color);

        ox = nx;

    }


    if (Circuit.showValuesCheckItem) {
        var s = CircuitElement.getShortUnitText(this.resistance, "ohm");
        this.drawValues(s, hs);
    }


    this.drawPosts();
};

ResistorElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.resistance;
};

ResistorElm.prototype.getDumpType = function () {
    return 'r';
};

ResistorElm.prototype.getEditInfo = function (n) {
    if (n == 0)
        return new EditInfo("Resistance (ohms):", this.resistance, 0, 0);
    return null;
};

ResistorElm.prototype.setEditValue = function (n, ei) {
    if (ei.value > 0)
        this.resistance = ei.value;
};

ResistorElm.prototype.getInfo = function (arr) {
    arr[0] = "resistor";
    this.getBasicInfo(arr);
    arr[3] = "R = " + CircuitElement.getUnitText(this.resistance, Circuit.ohmString);
    arr[4] = "P = " + CircuitElement.getUnitText(this.getPower(), "W");
};

ResistorElm.prototype.needsShortcut = function () {
    return true;
};

ResistorElm.prototype.calculateCurrent = function () {
    this.current = (this.volts[0] - this.volts[1]) / this.resistance;
};

ResistorElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this)
    this.calcLeads(32);
    this.ps3 = new Point(0, 0);
    this.ps4 = new Point(0, 0);
};

ResistorElm.prototype.stamp = function () {
    Circuit.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
};

ResistorElm.prototype.toString = function () {
    return "ResistorElm";
};

