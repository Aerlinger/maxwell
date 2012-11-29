// Prototypal inheritance
VoltageElm.prototype = new CircuitElement();
VoltageElm.prototype.constructor = VoltageElm;

VoltageElm.FLAG_COS = 2;

VoltageElm.WF_DC = 0;
VoltageElm.WF_AC = 1;
VoltageElm.WF_SQUARE = 2;
VoltageElm.WF_TRIANGLE = 3;
VoltageElm.WF_SAWTOOTH = 4;
VoltageElm.WF_PULSE = 5;
VoltageElm.WF_VAR = 6;

VoltageElm.prototype.waveform = VoltageElm.WF_DC;

VoltageElm.prototype.frequency = 40;
VoltageElm.prototype.maxVoltage = 5;
VoltageElm.prototype.freqTimeZero = 0;
VoltageElm.prototype.bias = 0;
VoltageElm.prototype.phaseShift = 0;
VoltageElm.prototype.dutyCycle = .5;

function VoltageElm(xa, ya, xb, yb, f, st) {

    CircuitElement.call(this, xa, ya, xb, yb, f, st);

    this.maxVoltage = 5;
    this.frequency = 40;
    this.waveform = VoltageElm.WF_DC;
    this.dutyCycle = 0.5;


    if (st) {
        if (typeof st == 'string')
            st = st.split(" ");

        this.waveform = st[0] ? Math.floor(parseInt(st[0])) : VoltageElm.WF_DC;
        this.frequency = st[1] ? parseFloat(st[1]) : 40;
        this.maxVoltage = st[2] ? parseFloat(st[2]) : 5;
        this.bias = st[3] ? parseFloat(st[3]) : 0;
        this.phaseShift = st[4] ? parseFloat(st[4]) : 0;
        this.dutyCycle = st[5] ? parseFloat(st[5]) : .5;
    }

    if (this.flags & VoltageElm.FLAG_COS != 0) {
        this.flags &= ~VoltageElm.FLAG_COS;

        this.phaseShift = Math.PI / 2;
    }

    this.reset();

}
;


VoltageElm.prototype.getDumpType = function () {
    return 'v';
};

VoltageElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.waveform + " " + this.frequency + " " +
        this.maxVoltage + " " + this.bias + " " + this.phaseShift + " " + this.dutyCycle;
};

VoltageElm.prototype.reset = function () {
    this.freqTimeZero = 0;
    this.curcount = 5;
};

VoltageElm.prototype.triangleFunc = function (x) {
    if (x < Math.PI)
        return x * (2 / Math.PI) - 1;

    return 1 - (x - Math.PI) * (2 / Math.PI);
};

VoltageElm.prototype.stamp = function () {
    if (this.waveform == VoltageElm.WF_DC)
        Circuit.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
    else
        Circuit.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource);
};

VoltageElm.prototype.doStep = function () {
    if (this.waveform != VoltageElm.WF_DC)
        Circuit.updateVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
};

VoltageElm.prototype.getVoltage = function () {
    var w = 2 * Math.PI * (Circuit.t - this.freqTimeZero) * this.frequency + this.phaseShift;

    switch (this.waveform) {
        case VoltageElm.WF_DC:
            return this.maxVoltage + this.bias;
        case VoltageElm.WF_AC:
            return Math.sin(w) * this.maxVoltage + this.bias;
        case VoltageElm.WF_SQUARE:
            return this.bias + ((w % (2 * Math.PI) > (2 * Math.PI * this.dutyCycle)) ?
                -this.maxVoltage : this.maxVoltage);
        case VoltageElm.WF_TRIANGLE:
            return this.bias + this.triangleFunc(w % (2 * Math.PI)) * this.maxVoltage;
        case VoltageElm.WF_SAWTOOTH:
            return this.bias + (w % (2 * Math.PI)) * (this.maxVoltage / Math.PI) - this.maxVoltage;
        case VoltageElm.WF_PULSE:
            return ((w % (2 * Math.PI)) < 1) ? this.maxVoltage + this.bias : this.bias;
        default:
            return 0;
    }
};

VoltageElm.circleSize = 17;

VoltageElm.prototype.setPoints = function () {
    CircuitElement.prototype.setPoints.call(this);
    this.calcLeads((this.waveform == VoltageElm.WF_DC || this.waveform == VoltageElm.WF_VAR) ? 8 : VoltageElm.circleSize * 2);
};

VoltageElm.prototype.draw = function () {
    this.setBbox(this.x1, this.y, this.x2, this.y2);

    this.updateDotCount();
    if (Circuit.dragElm != this) {
        if (this.waveform == VoltageElm.WF_DC)
            this.drawDots(this.point1, this.point2, this.curcount);
        else {
            this.drawDots(this.point1, this.lead1, this.curcount);
            this.drawDots(this.point2, this.lead2, -this.curcount);
        }
    }

    this.draw2Leads();
    if (this.waveform == VoltageElm.WF_DC) {
        this.setPowerColor(false);
        var color = this.setVoltageColor(this.volts[0]);
        CircuitElement.interpPoint2(this.lead1, this.lead2, CircuitElement.ps1, CircuitElement.ps2, 0, 10);
        CircuitElement.drawThickLinePt(CircuitElement.ps1, CircuitElement.ps2, color);
        color = this.setVoltageColor(this.volts[1]);
        var hs = 16;
        this.setBboxPt(this.point1, this.point2, hs);
        CircuitElement.interpPoint2(this.lead1, this.lead2, CircuitElement.ps1, CircuitElement.ps2, 1, hs);
        CircuitElement.drawThickLinePt(CircuitElement.ps1, CircuitElement.ps2, color);
    } else {
        this.setBboxPt(this.point1, this.point2, VoltageElm.circleSize);
        CircuitElement.interpPoint(this.lead1, this.lead2, CircuitElement.ps1, .5);
        this.drawWaveform(CircuitElement.ps1);
    }

    this.drawPosts();
};

VoltageElm.prototype.drawWaveform = function (center) {

    var color = this.needsHighlight() ? CircuitElement.selectColor : Settings.FG_COLOR;

    //g.beginFill();
    this.setPowerColor(false);

    var xc = center.x1;
    var yc = center.y;


    // TODO:
    CircuitElement.drawCircle(xc, yc, VoltageElm.circleSize, color);
    //Main.getMainCanvas().drawThickCircle(xc, yc, circleSize, color);

    var wl = 8;
    this.adjustBbox(xc - VoltageElm.circleSize, yc - VoltageElm.circleSize, xc + VoltageElm.circleSize, yc + VoltageElm.circleSize);

    var xc2;
    switch (this.waveform) {
        case VoltageElm.WF_DC:
        {
            break;
        }
        case VoltageElm.WF_SQUARE:
            xc2 = Math.floor(wl * 2 * this.dutyCycle - wl + xc);
            xc2 = Math.max(xc - wl + 3, Math.min(xc + wl - 3, xc2));
            CircuitElement.drawThickLine(xc - wl, yc - wl, xc - wl, yc, color);
            CircuitElement.drawThickLine(xc - wl, yc - wl, xc2, yc - wl, color);
            CircuitElement.drawThickLine(xc2, yc - wl, xc2, yc + wl, color);
            CircuitElement.drawThickLine(xc + wl, yc + wl, xc2, yc + wl, color);
            CircuitElement.drawThickLine(xc + wl, yc, xc + wl, yc + wl, color);
            break;
        case VoltageElm.WF_PULSE:
            yc += wl / 2;
            CircuitElement.drawThickLine(xc - wl, yc - wl, xc - wl, yc, color);
            CircuitElement.drawThickLine(xc - wl, yc - wl, xc - wl / 2, yc - wl, color);
            CircuitElement.drawThickLine(xc - wl / 2, yc - wl, xc - wl / 2, yc, color);
            CircuitElement.drawThickLine(xc - wl / 2, yc, xc + wl, yc, color);
            break;
        case VoltageElm.WF_SAWTOOTH:
            CircuitElement.drawThickLine(xc, yc - wl, xc - wl, yc, color);
            CircuitElement.drawThickLine(xc, yc - wl, xc, yc + wl, color);
            CircuitElement.drawThickLine(xc, yc + wl, xc + wl, yc, color);
            break;
        case VoltageElm.WF_TRIANGLE:
        {
            var xl = 5;
            CircuitElement.drawThickLine(xc - xl * 2, yc, xc - xl, yc - wl, color);
            CircuitElement.drawThickLine(xc - xl, yc - wl, xc, yc, color);
            CircuitElement.drawThickLine(xc, yc, xc + xl, yc + wl, color);
            CircuitElement.drawThickLine(xc + xl, yc + wl, xc + xl * 2, yc, color);
            break;
        }
        case VoltageElm.WF_AC:
        {
            var i;
            var xl = 10;
            var ox = -1;
            var oy = -1;
            for (i = -xl; i <= xl; i++) {
                var yy = yc + Math.floor(.95 * Math.sin(i * Math.PI / xl) * wl);
                if (ox != -1)
                    CircuitElement.drawThickLine(ox, oy, xc + i, yy, color);
                ox = xc + i;
                oy = yy;
            }
            break;
        }
    }
    if (Circuit.showValuesCheckItem) {
        var s = CircuitElement.getShortUnitText(this.frequency, "Hz");
        if (this.dx == 0 || this.dy == 0)
            this.drawValues(s, VoltageElm.circleSize);
    }
};

VoltageElm.prototype.getVoltageSourceCount = function () {
    return 1;
};

VoltageElm.prototype.getPower = function () {
    return -this.getVoltageDiff() * this.current;
};

VoltageElm.prototype.getVoltageDiff = function () {
    return this.volts[1] - this.volts[0];
};

VoltageElm.prototype.getInfo = function (arr) {
    switch (this.waveform) {
        case VoltageElm.WF_DC:
        case VoltageElm.WF_VAR:
            arr[0] = "voltage source";
            break;
        case VoltageElm.WF_AC:
            arr[0] = "A/C source";
            break;
        case VoltageElm.WF_SQUARE:
            arr[0] = "square wave gen";
            break;
        case VoltageElm.WF_PULSE:
            arr[0] = "pulse gen";
            break;
        case VoltageElm.WF_SAWTOOTH:
            arr[0] = "sawtooth gen";
            break;
        case VoltageElm.WF_TRIANGLE:
            arr[0] = "triangle gen";
            break;
    }

    arr[1] = "I = " + CircuitElement.getCurrentText(this.getCurrent());
    arr[2] = ((this instanceof RailElm) ? "V = " : "Vd = ") +
        CircuitElement.getVoltageText(this.getVoltageDiff());

    if (this.waveform != VoltageElm.WF_DC && this.waveform != VoltageElm.WF_VAR) {
        arr[3] = "f = " + CircuitElement.getUnitText(this.frequency, "Hz");
        arr[4] = "Vmax = " + CircuitElement.getVoltageText(this.maxVoltage);
        var i = 5;
        if (this.bias != 0)
            arr[i++] = "Voff = " + this.getVoltageText(this.bias);
        else if (this.frequency > 500)
            arr[i++] = "wavelength = " +
                CircuitElement.getUnitText(2.9979e8 / this.frequency, "m");
        arr[i++] = "P = " + CircuitElement.getUnitText(this.getPower(), "W");
    }
};

VoltageElm.prototype.getEditInfo = function (n) {
    if (n == 0)
        return new EditInfo(this.waveform == VoltageElm.WF_DC ? "Voltage" :
            "Max Voltage", this.maxVoltage, -20, 20);
    if (n == 1) {
        var ei = new EditInfo("Waveform", this.waveform, -1, -1);
        ei.choice = new Array();
        ei.choice.push("D/C");
        ei.choice.push("A/C");
        ei.choice.push("Square Wave");
        ei.choice.push("Triangle");
        ei.choice.push("Sawtooth");
        ei.choice.push("Pulse");
        ei.choice.push(this.waveform);
        return ei;
    }
    if (this.waveform == VoltageElm.WF_DC)
        return null;
    if (n == 2)
        return new EditInfo("Frequency (Hz)", this.frequency, 4, 500);
    if (n == 3)
        return new EditInfo("DC Offset (V)", this.bias, -20, 20);
    if (n == 4)
        return new EditInfo("Phase Offset (degrees)", this.phaseShift * 180 / Math.PI, -180, 180).setDimensionless();
    if (n == 5 && this.waveform == VoltageElm.WF_SQUARE)
        return new EditInfo("Duty Cycle", this.dutyCycle * 100, 0, 100).setDimensionless();
    return null;
};

VoltageElm.prototype.setEditValue = function (n, ei) {
    if (n == 0)
        this.maxVoltage = ei.value;
    if (n == 3)
        this.bias = ei.value;
    if (n == 2) {
        // adjust time zero to maintain continuity in the waveform even though the frequency has changed.
        var oldfreq = this.frequency;
        this.frequency = ei.value;
        var maxfreq = 1 / (8 * Circuit.timeStep);
        if (this.frequency > maxfreq)
            this.frequency = maxfreq;
        var adj = this.frequency - oldfreq;
        this.freqTimeZero = Circuit.t - oldfreq * (Circuit.t - this.freqTimeZero) / this.frequency;
    }
    if (n == 1) {
        var ow = this.waveform;
        //waveform = ei.choice.getSelectedIndex();
        if (this.waveform == VoltageElm.WF_DC && ow != VoltageElm.WF_DC) {
            //ei.newDialog = true;
            this.bias = 0;
        } else if (this.waveform != VoltageElm.WF_DC && ow == VoltageElm.WF_DC) {
            //ei.newDialog = true;
        }
        if ((this.waveform == VoltageElm.WF_SQUARE || ow == VoltageElm.WF_SQUARE) && this.waveform != ow)
        //ei.newDialog = true;
            this.setPoints();
    }
    if (n == 4)
        this.phaseShift = ei.value * Math.PI / 180;
    if (n == 5)
        this.dutyCycle = ei.value * .01;
};

VoltageElm.prototype.toString = function () {
    return "VoltageElm";
};