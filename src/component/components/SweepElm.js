function SweepElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f);

    if (st) {
        if (typeof st == 'string')
            st = st.split(" ");

        // Define defaults:
        this.minF = st[0] ? parseFloat(st[0]) : 20;
        this.maxF = st[1] ? parseFloat(st[1]) : 4e4;
        this.maxV = st[2] ? parseFloat(st[2]) : 5;
        this.sweepTime = st[3] ? parseFloat(st[3]) : 0.1;
    }

    this.reset();
}
;


SweepElm.FLAG_LOG = 1;
SweepElm.FLAG_BIDIR = 2;

SweepElm.prototype = new CircuitElement();
SweepElm.prototype.constructor = SweepElm;


SweepElm.prototype.getDumpType = function () {
    return 170;
};

SweepElm.prototype.getPostCount = function () {
    return 1;
};

SweepElm.prototype.circleSize = 17;

SweepElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.minF + " " + this.maxF + " " + this.maxV + " " +
        this.sweepTime;
};

SweepElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);

    this.lead1 = CircuitElement.interpPointPt(this.point1, this.point2, 1 - this.circleSize / this.dn);
};

SweepElm.prototype.draw = function () {

    this.setBboxPt(this.point1, this.point2, this.circleSize);
    var color = this.setVoltageColor(this.volts[0]);
    CircuitElement.drawThickLinePt(this.point1, this.lead1, color);

    this.setVoltageColor(this.needsHighlight() ? CircuitElement.selectColor : Color.GREY);

    var powerColor = this.setPowerColor(false);

    var xc = this.point2.x1;
    var yc = this.point2.y;
    CircuitElement.drawCircle(xc, yc, this.circleSize);

    var wl = 8;
    this.adjustBbox(xc - this.circleSize, yc - this.circleSize,
        xc + this.circleSize, yc + this.circleSize);
    var i;
    var xl = 10;
    var ox = -1, oy = -1;
    var tm = (new Date()).getTime();//System.currentTimeMillis();
    //double w = (this == mouseElm ? 3 : 2);
    tm %= 2000;
    if (tm > 1000)
        tm = 2000 - tm;
    var w = 1 + tm * .002;
    if (!Circuit.stoppedCheck)
        w = 1 + 2 * (this.frequency - this.minF) / (this.maxF - this.minF);
    for (i = -xl; i <= xl; i++) {
        var yy = yc + Math.floor(.95 * Math.sin(i * Math.PI * w / xl) * wl);
        if (ox != -1)
            CircuitElement.drawThickLine(ox, oy, xc + i, yy);
        ox = xc + i;
        oy = yy;
    }
    if (Circuit.showValuesCheckItem) {
        var s = CircuitElement.getShortUnitText(this.frequency, "Hz");
        if (this.dx == 0 || this.dy == 0)
            this.drawValues(s, this.circleSize);
    }

    this.drawPosts();
    this.curcount = this.updateDotCount(-this.current, this.curcount);

    if (Circuit.dragElm != this)
        this.drawDots(this.point1, this.lead1, this.curcount);
};

SweepElm.prototype.stamp = function () {
    Circuit.stampVoltageSource(0, this.nodes[0], this.voltSource);
};

SweepElm.prototype.fadd;
SweepElm.prototype.fmul;
SweepElm.prototype.freqTime;
SweepElm.prototype.savedTimeStep;
SweepElm.prototype.dir = 1;

SweepElm.prototype.setParams = function () {
    if (this.frequency < this.minF || this.frequency > this.maxF) {
        this.frequency = this.minF;
        this.freqTime = 0;
        this.dir = 1;
    }
    if ((this.flags & SweepElm.FLAG_LOG) == 0) {
        this.fadd = this.dir * Circuit.timeStep * (this.maxF - this.minF) / this.sweepTime;
        this.fmul = 1;
    } else {
        this.fadd = 0;
        this.fmul = Math.pow(this.maxF / this.minF, this.dir * Circuit.timeStep / this.sweepTime);
    }
    this.savedTimeStep = Circuit.timeStep;
};

SweepElm.prototype.reset = function () {
    this.frequency = this.minF;
    this.freqTime = 0;
    this.dir = 1;
    this.setParams();
};

SweepElm.prototype.v;

SweepElm.prototype.startIteration = function () {
    // has timestep been changed?
    if (Circuit.timeStep != this.savedTimeStep)
        this.setParams();

    this.v = Math.sin(this.freqTime) * this.maxV;
    this.freqTime += this.frequency * 2 * Math.PI * Circuit.timeStep;
    this.frequency = this.frequency * this.fmul + this.fadd;

    if (this.frequency >= this.maxF && this.dir == 1) {
        if ((this.flags & SweepElm.FLAG_BIDIR) != 0) {
            this.fadd = -this.fadd;
            this.fmul = 1 / this.fmul;
            this.dir = -1;
        } else
            this.frequency = this.minF;
    }
    if (this.frequency <= this.minF && this.dir == -1) {
        this.fadd = -this.fadd;
        this.fmul = 1 / this.fmul;
        this.dir = 1;
    }
};

SweepElm.prototype.doStep = function () {
    Circuit.updateVoltageSource(0, this.nodes[0], this.voltSource, this.v);
};

SweepElm.prototype.getVoltageDiff = function () {
    return this.volts[0];
};

SweepElm.prototype.getVoltageSourceCount = function () {
    return 1;
};

SweepElm.prototype.hasGroundConnection = function (n1) {
    return true;
};

SweepElm.prototype.getInfo = function (arr) {
    arr[0] = "sweep " + (((this.flags & SweepElm.FLAG_LOG) == 0) ? "(linear)" : "(log)");
    arr[1] = "I = " + CircuitElement.getCurrentDText(this.getCurrent());
    arr[2] = "V = " + CircuitElement.getVoltageText(this.volts[0]);
    arr[3] = "f = " + CircuitElement.getUnitText(this.frequency, "Hz");
    arr[4] = "range = " + CircuitElement.getUnitText(this.minF, "Hz") + " .. " +
        CircuitElement.getUnitText(this.maxF, "Hz");
    arr[5] = "time = " + CircuitElement.getUnitText(this.sweepTime, "s");
};

SweepElm.prototype.getEditInfo = function (n) {
    if (n == 0)
        return new EditInfo("Min Frequency (Hz)", this.minF, 0, 0);
    if (n == 1)
        return new EditInfo("Max Frequency (Hz)", this.maxF, 0, 0);
    if (n == 2)
        return new EditInfo("Sweep Time (s)", this.sweepTime, 0, 0);
    if (n == 3) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = new Checkbox("Logarithmic", (this.flags & SweepElm.FLAG_LOG) != 0);
        return ei;
    }
    if (n == 4)
        return new EditInfo("Max Voltage", this.maxV, 0, 0);
    if (n == 5) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = new Checkbox("Bidirectional", (this.flags & SweepElm.FLAG_BIDIR) != 0);
        return ei;
    }
    return null;
};

SweepElm.prototype.setEditValue = function (n, ei) {
    var maxfreq = 1 / (8 * Circuit.timeStep);
    if (n == 0) {
        this.minF = ei.value;
        if (this.minF > maxfreq)
            this.minF = maxfreq;
    }
    if (n == 1) {
        this.maxF = ei.value;
        if (this.maxF > maxfreq)
            this.maxF = maxfreq;
    }
    if (n == 2)
        this.sweepTime = ei.value;
    if (n == 3) {
        this.flags &= ~SweepElm.FLAG_LOG;
        if (ei.checkbox.getState())
            this.flags |= SweepElm.FLAG_LOG;
    }
    if (n == 4)
        this.maxV = ei.value;
    if (n == 5) {
        this.flags &= ~SweepElm.FLAG_BIDIR;
        if (ei.checkbox.getState())
            this.flags |= SweepElm.FLAG_BIDIR;
    }
    this.setParams();
};