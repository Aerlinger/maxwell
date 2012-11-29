/** Todo: Click functionality does not work */

Switch2Elm.prototype = new SwitchElm();
Switch2Elm.prototype.constructor = Switch2Elm;

function Switch2Elm(xa, ya, xb, yb, f, st) {
    SwitchElm.call(this, xa, ya, xb, yb, f, st);

    this.link = 0;

    if (st && st[0])
        this.link = parseInt(st[0]);

    this.noDiagonal = true;
}
;

Switch2Elm.FLAG_CENTER_OFF = 1;

Switch2Elm.prototype.getDumpType = function () {
    return 'S';
};

Switch2Elm.prototype.dump = function () {
    SwitchElm.prototype.dump.call(this) + this.link;
};

Switch2Elm.prototype.openhs = 16;
Switch2Elm.prototype.swposts = new Array();
Switch2Elm.prototype.swpoled = new Array();

Switch2Elm.prototype.setPoints = function () {
    SwitchElm.prototype.setPoints.call(this);
    this.calcLeads(32);
    this.swposts = CircuitElement.newPointArray(2);
    this.swpoles = CircuitElement.newPointArray(3);
    CircuitElement.interpPoint2(this.lead1, this.lead2, this.swpoles[0], this.swpoles[1], 1, this.openhs);
    this.swpoles[2] = this.lead2;
    CircuitElement.interpPoint2(this.point1, this.point2, this.swposts[0], this.swposts[1], 1, this.openhs);
    this.posCount = this.hasCenterOff() ? 3 : 2;
};


Switch2Elm.prototype.draw = function () {
    this.setBbox(this.point1, this.point2, this.openhs);

    // draw first lead
    var color = this.setVoltageColor(this.volts[0]);
    CircuitElement.drawThickLinePt(this.point1, this.lead1, color);

    // draw second lead
    var color = this.setVoltageColor(this.volts[1]);
    CircuitElement.drawThickLinePt(this.swpoles[0], this.swposts[0], color);

    // draw third lead
    this.setVoltageColor(this.volts[2], color);
    CircuitElement.drawThickLinePt(this.swpoles[1], this.swposts[1], color);

    // draw switch
    if (!this.needsHighlight())
        color = Settings.SELECT_COLOR;


    CircuitElement.drawThickLinePt(this.lead1, this.swpoles[this.position], color);

    this.updateDotCount();
    this.drawDots(this.point1, this.lead1, this.curcount);

    if (this.position != 2)
        this.drawDots(this.swpoles[this.position], this.swposts[this.position], this.curcount);

    this.drawPosts();
};


Switch2Elm.prototype.getPost = function (n) {
    return (n == 0) ? this.point1 : this.swposts[n - 1];
};

Switch2Elm.prototype.getPostCount = function () {
    return 3;
};

Switch2Elm.prototype.calculateCurrent = function () {
    if (this.position == 2)
        this.current = 0;
};

Switch2Elm.stamp = function () {
    if (this.position == 2) // in center?
        return;
    Circuit.stampVoltageSource(this.nodes[0], this.nodes[this.position + 1], this.voltSource, 0);
};

Switch2Elm.getVoltageSourceCount = function () {
    return (this.position == 2) ? 0 : 1;
};

Switch2Elm.toggle = function () {
    Switch2Elm.prototype.toggle();
    if (this.link != 0) {
        var i;
        for (i = 0; i != Circuit.elementList.length; i++) {
            var o = Circuit.elementList.elementAt(i);
            if (o instanceof Switch2Elm) {
                var s2 = o;
                if (s2.link == this.link)
                    s2.position = this.position;
            }
        }
    }
}

Switch2Elm.prototype.getConnection = function (n1, n2) {
    if (this.position == 2)
        return false;
    return this.comparePair(n1, n2, 0, 1 + this.position);
};

Switch2Elm.prototype.getInfo = function (arr) {
    arr[0] = (this.link == 0) ? "switch (SPDT)" : "switch (DPDT)";
    arr[1] = "I = " + this.getCurrentDText(this.getCurrent());
};

Switch2Elm.getEditInfo = function (n) {
    if (n == 1) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = new Checkbox("Center Off", this.hasCenterOff());
        return ei;
    }
    return SwitchElm.prototype.getEditInfo.call(this, n);
};

Switch2Elm.prototype.setEditValue = function (n, ei) {
    if (n == 1) {
        this.flags &= ~Switch2Elm.FLAG_CENTER_OFF;
        if (ei.checkbox.getState())
            this.flags |= Switch2Elm.FLAG_CENTER_OFF;
        if (this.hasCenterOff())
            this.momentary = false;
        this.setPoints();
    } else
        Switch2Elm.prototype.setEditValue.call(this, n, ei);
};

Switch2Elm.prototype.hasCenterOff = function () {
    return (this.flags & Switch2Elm.FLAG_CENTER_OFF) != 0;
};

