// Step 2: Prototype of SwitchElm is CircuitElement
SwitchElm.prototype = new CircuitElement();
// Step 3: Now we need to set the constructor to the DepthRectangle instead of Rectangle
SwitchElm.prototype.constructor = SwitchElm;


function SwitchElm(xa, ya, xb, yb, f, st) {

    CircuitElement.call(this, xa, ya, xb, yb, f, st);
    this.momentary = false;

    this.position = 0;
    this.posCount = 2;

    this.ps = new Point(0, 0);
    CircuitElement.ps2 = new Point(0, 0);

    if (st) {

        if (typeof st == 'string')
            st = st.split(' ');


        var str = st[0]

        if (str == ("true"))
            this.position = (this instanceof LogicInputElm) ? 0 : 1;
        else if (str == ("false"))
            this.position = (this instanceof LogicInputElm) ? 1 : 0;
        else
            this.position = parseInt(str);

        this.momentary = (st[1].toLowerCase() == "true");
    }
    this.posCount = 2;

}
;

SwitchElm.prototype.getDumpType = function () {
    return 's';
};

SwitchElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.position + " " + this.momentary;
};

SwitchElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);
    this.calcLeads(32);
    this.ps = new Point(0, 0);
    CircuitElement.ps2 = new Point(0, 0);
};

SwitchElm.prototype.draw = function () {
    var openhs = 16;
    var hs1 = (this.position == 1) ? 0 : 2;
    var hs2 = (this.position == 1) ? openhs : 2;
    this.setBboxPt(this.point1, this.point2, openhs);

    this.draw2Leads();

    if (this.position == 0)
        this.doDots();

    //if (!needsHighlight())
    //	g.beginFill(Color.WHITE);
    CircuitElement.interpPoint(this.lead1, this.lead2, this.ps, 0, hs1);
    CircuitElement.interpPoint(this.lead1, this.lead2, CircuitElement.ps2, 1, hs2);

    CircuitElement.drawThickLinePt(this.ps, CircuitElement.ps2, Settings.FG_COLOR);
    this.drawPosts();
};

SwitchElm.prototype.calculateCurrent = function () {
    if (this.position == 1)
        this.current = 0;
};

SwitchElm.prototype.stamp = function () {
    if (this.position == 0)
        Circuit.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
};

SwitchElm.prototype.getVoltageSourceCount = function () {
    return (this.position == 1) ? 0 : 1;
};

SwitchElm.mouseUp = function () {
    if (this.momentary)
        this.toggle();
};

SwitchElm.prototype.toggle = function () {
    this.position++;
    if (this.position >= this.posCount)
        this.position = 0;
};

SwitchElm.prototype.getInfo = function (arr) {
    arr[0] = (this.momentary) ? "push switch (SPST)" : "switch (SPST)";
    if (this.position == 1) {
        arr[1] = "open";
        arr[2] = "Vd = " + CircuitElement.getVoltageDText(this.getVoltageDiff());
    } else {
        arr[1] = "closed";
        arr[2] = "V = " + CircuitElement.getVoltageText(this.volts[0]);
        arr[3] = "I = " + CircuitElement.getCurrentDText(this.getCurrent());
    }
};

SwitchElm.prototype.getConnection = function (n1, n2) {
    return this.position == 0;
};

SwitchElm.prototype.isWire = function () {
    return true;
};

SwitchElm.prototype.getEditInfo = function (n) {
    // TODO: Implement
//    if (n == 0) {
//        var ei:EditInfo = new EditInfo("", 0, -1, -1);
//        //ei.checkbox = new Checkbox("Momentary Switch", momentary);
//        return ei;
//    }
//    return null;
};

SwitchElm.prototype.setEditValue = function (n, ei) {
    if (n == 0) {
    }
    //momentary = ei.checkbox.getState();
};

CapacitorElm.prototype.toString = function () {
    return "SwitchElm";
};