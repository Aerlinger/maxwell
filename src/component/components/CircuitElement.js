// static members /////////////////////////////////////////////////

CircuitElement.voltageRange = 5;
CircuitElement.colorScaleCount = 32;
CircuitElement.colorScale = [];
CircuitElement.unitsFont = "Arial, Helvetica, sans-serif";

CircuitElement.currentMult = 0;
CircuitElement.powerMult = 10;

CircuitElement.ps1 = new Point(50, 0);
CircuitElement.ps2 = new Point(50, 0);

CircuitElement.whiteColor = Color.WHITE;
CircuitElement.selectColor = Color.ORANGE;
CircuitElement.drawColor = '#FFFFFF';
CircuitElement.lightGreyColor = 0;

CircuitElement.showFormat = 0;//showFormat:flash.globalization.NumberFormatter;
CircuitElement.shortFormat = 0;//flash.globalization.NumberFormatter;
CircuitElement.noCommaFormat = 0;//noCommaFormat:flash.globalization.NumberFormatter;

// non-static Member variables
CircuitElement.prototype.x1 = 0;
CircuitElement.prototype.y = 0;
CircuitElement.prototype.x2 = 0;
CircuitElement.prototype.y2 = 0;

CircuitElement.prototype.flags = 0;
CircuitElement.prototype.voltSource = 0;
CircuitElement.prototype.nodes = [];

CircuitElement.prototype.dx = 0;
CircuitElement.prototype.dy = 0;

CircuitElement.prototype.dsign = 0;

CircuitElement.prototype.dn = 0;
CircuitElement.prototype.dpx1 = 0;
CircuitElement.prototype.dpy1 = 0;

CircuitElement.prototype.point1 = new Point(50, 100);
CircuitElement.prototype.point2 = new Point(50, 150);
CircuitElement.prototype.lead1 = new Point(0, 100);
CircuitElement.prototype.lead2 = new Point(0, 150);

CircuitElement.prototype.volts = [0, 0];

CircuitElement.prototype.current = 0;
CircuitElement.prototype.curcount = 0;

CircuitElement.prototype.boundingBox;

CircuitElement.prototype.noDiagonal = false;
CircuitElement.prototype.selected = false;




// Constructor //////////////////////////////////////////////////////
function CircuitElement(xa, ya, xb, yb, f, st) {
    //TODO: Needs to be moved to sim
    //Cir.initClass();
    this.boundingBox = new Rectangle(0, 0, Math.abs(xa - xb), Math.abs(ya - yb));

    this.x1 = Circuit.snapGrid(xa) - 90;
    this.y = Circuit.snapGrid(ya) - 60;
    this.x2 = (isNaN(xb) ? this.x1 : Circuit.snapGrid(xb)) - 90;
    this.y2 = (isNaN(yb) ? this.y : Circuit.snapGrid(yb))  - 60;
    this.flags = isNaN(f) ? this.getDefaultFlags() : f;

    CircuitElement.lightGrayColor = Settings.LIGHT_GREY;
    CircuitElement.selectColor = Settings.SELECT_COLOR;
    CircuitElement.whiteColor = Color.WHITE;

    this.allocNodes();
    this.initBoundingBox();
}


CircuitElement.setColor = function (color) {
    if (typeof(color) == 'string')
        CircuitElement.drawColor = color;
    else
        CircuitElement.drawColor = Color.color2HexString(color);
};

///////////////////////////////////////////////////////////////////////
// Methods to be overridden by children: //////////////////////////////
CircuitElement.prototype.setPoints = function () {
    this.dx = this.x2 - this.x1;
    this.dy = this.y2 - this.y;
    this.dn = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

    this.dpx1 = this.dy / this.dn;
    this.dpy1 = -this.dx / this.dn;
    this.dsign = (this.dy == 0) ? sign(this.dx) : sign(this.dy);

    this.point1 = new Point(this.x1, this.y);
    this.point2 = new Point(this.x2, this.y2);
};

CircuitElement.prototype.getDumpType = function () {
    return 0;
};
// END: Methods to be overridden by children: /////////////////////////
///////////////////////////////////////////////////////////////////////


CircuitElement.prototype.getDumpClass = function () {
    // TODO: Return class name
};

CircuitElement.prototype.toString = function () {
    return "Circuit Element";
};

CircuitElement.prototype.isSelected = function () {
    return Circuit.selected;
};

CircuitElement.initClass = function () {

    CircuitElement.unitsFont = "Arial, Helvetica, sans-serif";
//	var t = r.text(100, 100, 'test');
//	t.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif" });

    CircuitElement.colorScale = new Array(CircuitElement.colorScaleCount);

    for (var i = 0; i < CircuitElement.colorScaleCount; ++i) {
        var v = i * 2 / CircuitElement.colorScaleCount - 1;
        if (v < 0) {
            var n1 = Math.floor((128 * -v) + 127);
            var n2 = Math.floor(127 * (1 + v));
            // Color is red for a negative voltage:
            CircuitElement.colorScale[i] = new Color(n1, n2, n2);
        } else {
            n1 = Math.floor((128 * v) + 127);
            n2 = Math.floor(127 * (1 - v));
            // Color is green for a positive voltage
            CircuitElement.colorScale[i] = new Color(n2, n1, n2);
        }
    }

    CircuitElement.ps1 = new Point(0, 0);
    CircuitElement.ps2 = new Point(0, 0);

//			shortFormat = new flash.globalization.NumberFormatter(LocaleID.DEFAULT);
//			shortFormat.fractionalDigits = 1;
//			showFormat = new flash.globalization.NumberFormatter(LocaleID.DEFAULT);
//			showFormat.fractionalDigits = 2;
//			showFormat.leadingZero = true;
//			noCommaFormat = new flash.globalization.NumberFormatter(LocaleID.DEFAULT);
//			noCommaFormat.fractionalDigits = 10;
//			noCommaFormat.useGrouping = false;

};

CircuitElement.prototype.initBoundingBox = function () {
    this.boundingBox = new Rectangle(0, 0, 0, 0);

    this.boundingBox.x1 = Math.min(this.x1, this.x2);
    this.boundingBox.y = Math.min(this.y, this.y2);
    this.boundingBox.width = Math.abs(this.x2 - this.x1) + 1;
    this.boundingBox.height = Math.abs(this.y2 - this.y) + 1;
};

CircuitElement.prototype.allocNodes = function () {
    this.nodes = new Array(this.getPostCount() + this.getInternalNodeCount());
    this.volts = new Array(this.getPostCount() + this.getInternalNodeCount());

    this.nodes = zeroArray(this.nodes);
    this.volts = zeroArray(this.volts);
};

CircuitElement.prototype.dump = function () {
    return this.getDumpType() + " " + this.x1 + " " + this.y + " " + this.x2 + " " + this.y2 + " " + this.flags;
};

CircuitElement.prototype.reset = function () {
    var i;
    for (i = 0; i < this.getPostCount() + this.getInternalNodeCount(); ++i)
        this.volts[i] = 0;

    this.curcount = 0;
};

CircuitElement.prototype.draw = function () {
    paper.fillRect(this.boundingBox.x1, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
};

CircuitElement.prototype.setCurrent = function (x, c) {
    this.current = c;
};

CircuitElement.prototype.getCurrent = function () {
    return this.current;
};

CircuitElement.prototype.doStep = function () {
    // Extended by sub-classes
};

CircuitElement.prototype.destroy = function () {
    // Todo: implement
};

CircuitElement.prototype.startIteration = function () {
    // Todo: implement
};

CircuitElement.prototype.getPostVoltage = function (x) {
    return this.volts[x];
};

CircuitElement.prototype.setNodeVoltage = function (n, c) {
    this.volts[n] = c;
    this.calculateCurrent();
};

CircuitElement.prototype.calculateCurrent = function () {

};

CircuitElement.prototype.setPoints = function () {
    this.dx = this.x2 - this.x1;
    this.dy = this.y2 - this.y;
    this.dn = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

    this.dpx1 = this.dy / this.dn;
    this.dpy1 = -this.dx / this.dn;
    this.dsign = (this.dy == 0) ? sign(this.dx) : sign(this.dy);
    this.point1 = new Point(this.x1, this.y);
    this.point2 = new Point(this.x2, this.y2);
};

CircuitElement.prototype.calcLeads = function (len) {
    if (this.dn < len || len == 0) {
        this.lead1 = this.point1;
        this.lead2 = this.point2;
        return;
    }
    this.lead1 = CircuitElement.interpPointPt(this.point1, this.point2, (this.dn - len) / (2 * this.dn));
    this.lead2 = CircuitElement.interpPointPt(this.point1, this.point2, (this.dn + len) / (2 * this.dn));
};

CircuitElement.prototype.getDefaultFlags = function () {
    return 0;
};

CircuitElement.interpPointPt = function (a, b, f, g) {
    if (!f)
        Circuit.halt("no interpolation value (f) defined in interpPointPt");

    var p = new Point(0, 0);
    CircuitElement.interpPoint(a, b, p, f, g);
    return p;
};

CircuitElement.interpPoint = function (a, b, c, f, g) {
    var gx = 0;
    var gy = 0;

    if (g) {
        gx = b.y - a.y;
        gy = a.x1 - b.x1;
        g /= Math.sqrt(gx * gx + gy * gy);
    } else {
        g = 0;
    }

    c.x1 = Math.floor(a.x1 * (1 - f) + b.x1 * f + g * gx + .48);
    c.y = Math.floor(a.y * (1 - f) + b.y * f + g * gy + .48);

    return b;
};

CircuitElement.interpPoint2 = function (a, b, c, d, f, g) {
    var gx = 0;
    var gy = 0;

    if (g != 0) {
        gx = b.y - a.y;
        gy = a.x1 - b.x1;
        g /= Math.sqrt(gx * gx + gy * gy);
    } else {
        g = 0;
    }

    var offset = .48;

    c.x1 = Math.floor(a.x1 * (1 - f) + b.x1 * f + g * gx + offset);
    c.y = Math.floor(a.y * (1 - f) + b.y * f + g * gy + offset);
    d.x1 = Math.floor(a.x1 * (1 - f) + b.x1 * f - g * gx + offset);
    d.y = Math.floor(a.y * (1 - f) + b.y * f - g * gy + offset);
};

CircuitElement.prototype.draw2Leads = function () {
    var color = this.setVoltageColor(this.volts[0]);
    CircuitElement.drawThickLinePt(this.point1, this.lead1, color);

    color = this.setVoltageColor(this.volts[1]);
    CircuitElement.drawThickLinePt(this.lead2, this.point2, color);
};

CircuitElement.newPointArray = function (n) {
    var a = new Array(n);
    while (n > 0)
        a[--n] = new Point(0, 0);
    return a;
};

CircuitElement.prototype.drawDots = function (pa, pb, pos) {
    // If the sim is stopped or has dots disabled
    if (Circuit.stoppedCheck || pos == 0 || !Circuit.dotsCheckItem)
        return;

    var dx = pb.x1 - pa.x1;
    var dy = pb.y - pa.y;

    var dn = Math.sqrt(dx * dx + dy * dy);

    var ds = 16;
    pos %= ds;

    if (pos < 0)
        pos += ds;

    for (var di = pos; di < dn; di += ds) {
        var x0 = (pa.x1 + di * dx / dn);
        var y0 = (pa.y + di * dy / dn);

        // Draws each dot:
        // TODO CANVAS
        paper.beginPath();
            paper.strokeStyle   = Color.color2HexString(Settings.DOTS_OUTLINE);
            paper.fillStyle     = Color.color2HexString(Settings.DOTS_COLOR);
            paper.arc(x0, y0, Settings.CURRENT_RADIUS, 0, 2*Math.PI, true);
            paper.stroke();
            paper.fill();
        paper.closePath();
    }
};

CircuitElement.calcArrow = function (a, b, al, aw) {
    var poly = new Polygon();

    var p1 = new Point(0, 0);
    var p2 = new Point(0, 0);

    var adx = b.x1 - a.x1;
    var ady = b.y - a.y;

    var l = Math.sqrt(adx * adx + ady * ady);

    poly.addVertex(b.x1, b.y);
    CircuitElement.interpPoint2(a, b, p1, p2, 1 - al / l, aw);
    poly.addVertex(p1.x1, p1.y);
    poly.addVertex(p2.x1, p2.y);

    return poly;
};

CircuitElement.createPolygon = function (a, b, c, d) {
    var p = new Polygon();

    p.addVertex(a.x1, a.y);
    p.addVertex(b.x1, b.y);
    p.addVertex(c.x1, c.y);

    if (d)
        p.addVertex(d.x1, d.y);

    return p;
};

CircuitElement.createPolygonFromArray = function (a) {
    var p = new Polygon();

    for (var i = 0; i < a.length; ++i)
        p.addVertex(a[i].x1, a[i].y);

    return p;
};

CircuitElement.prototype.drag = function (xx, yy) {
    xx = Circuit.snapGrid(xx);
    yy = Circuit.snapGrid(yy);

    if (this.noDiagonal) {
        if (Math.abs(this.x1 - xx) < Math.abs(this.y - yy))
            xx = this.x1;
        else
            yy = this.y;
    }

    this.x2 = xx;
    this.y2 = yy;

    this.setPoints();
};

CircuitElement.prototype.move = function (dx, dy) {
    this.x1 += dx;
    this.y += dy;
    this.x2 += dx;
    this.y2 += dy;

    this.boundingBox.x1 += dx;
    this.boundingBox.y += dy;

    this.setPoints();
};

CircuitElement.prototype.allowMove = function (dx, dy) {

    var nx = this.x1 + dx;
    var ny = this.y + dy;

    var nx2 = this.x2 + dx;
    var ny2 = this.y2 + dy;

    for (var i = 0; i < Circuit.elementList.length; ++i) {
        var ce = Circuit.getElm(i);

        if (ce.x1 == nx && ce.y == ny && ce.x2 == nx2 && ce.y2 == ny2)
            return false;
        if (ce.x1 == nx2 && ce.y == ny2 && ce.x2 == nx && ce.y2 == ny)
            return false;
    }

    return true;

};

CircuitElement.prototype.movePoint = function (n, dx, dy) {
    if (n == 0) {
        this.x1 += dx;
        this.y += dy;
    } else {
        this.x2 += dx;
        this.y2 += dy;
    }

    this.setPoints();
};

CircuitElement.prototype.stamp = function () {
    // overridden in subclasses
};

CircuitElement.prototype.getVoltageSourceCount = function () {
    return 0;
};

CircuitElement.prototype.getInternalNodeCount = function () {
    return 0;
};

CircuitElement.prototype.setNode = function (p, n) {
    this.nodes[p] = n;
};

CircuitElement.prototype.setVoltageSource = function (n, v) {
    this.voltSource = v;
};

CircuitElement.prototype.getVoltageSource = function () {
    return this.voltSource;
};

CircuitElement.prototype.getVoltageDiff = function () {
    return this.volts[0] - this.volts[1];
};

CircuitElement.prototype.nonLinear = function () {
    return false;
};

CircuitElement.prototype.getPostCount = function () {
    return 2;
};

CircuitElement.prototype.getNode = function (n) {
    return this.nodes[n];
};

CircuitElement.prototype.getPost = function (n) {
    return (n == 0) ? this.point1 : (n == 1) ? this.point2 : null;
};

CircuitElement.prototype.setBbox = function (x1, y1, x2, y2) {

    if (x1 > x2) {
        var q = x1;
        x1 = x2;
        x2 = q;
    }
    if (y1 > y2) {
        var q = y1;
        y1 = y2;
        y2 = q;
    }

    this.boundingBox.x1 = x1;
    this.boundingBox.y = y1;
    this.boundingBox.width = x2 - x1 + 1;
    this.boundingBox.height = y2 - y1 + 1;
};

CircuitElement.prototype.setBboxPt = function (p1, p2, w) {
    this.setBbox(p1.x1, p1.y, p2.x1, p2.y)

    var dpx = (this.dpx1 * w);
    var dpy = (this.dpy1 * w);
    this.adjustBbox(p1.x1 + dpx, p1.y + dpy, p1.x1 - dpx, p1.y - dpy);
};

CircuitElement.prototype.adjustBbox = function (x1, y1, x2, y2) {
    if (x1 > x2) {
        var q = x1;
        x1 = x2;
        x2 = q;
    }
    if (y1 > y2) {
        var q = y1;
        y1 = y2;
        y2 = q;
    }
    x1 = Math.min(this.boundingBox.x1, x1);
    y1 = Math.min(this.boundingBox.y, y1);
    x2 = Math.max(this.boundingBox.x1 + this.boundingBox.width - 1, x2);
    y2 = Math.max(this.boundingBox.y + this.boundingBox.height - 1, y2);

    this.boundingBox.x1 = x1;
    this.boundingBox.y = y1;
    this.boundingBox.width = x2 - x1;
    this.boundingBox.height = y2 - y1;
};

CircuitElement.prototype.adjustBboxPt = function (p1, p2) {
    this.adjustBbox(p1.x1, p1.y, p2.x1, p2.y);
};

CircuitElement.prototype.isCenteredText = function () {
    return false;
};

/** Not yet implemented */
CircuitElement.prototype.drawCenteredText = function (s, x, y, cx) {
    // todo: test
    var fm;

    var text;
    var w = 10 * s.length;//fm.stringWidth(s);

    if (cx)
        x -= w / 2;

    var ascent = -10;//fm.getAscent() / 2;
    var descent = 5;//fm.getAscent() / 2;

    // TODO: CANVAS

        paper.fillStyle = Color.color2HexString(Settings.TEXT_COLOR);
        paper.fillText(s, x, y+ascent);

//    text = paper.text(x, y + ascent, s).attr({
//        cursor:"none",
//        'font-weight':'bold',
//        fill:Color.color2HexString(Settings.TEXT_COLOR)
//    });
    this.adjustBbox(x, y - ascent, x + w, y + ascent + descent);

    return text;
};

/** Not yet implemented */
CircuitElement.prototype.drawValues = function (s, hs) {

    if (s == null)
        return;

    var w = 100;//fm.stringWidth(s);


    var ya = -10;//fm.getAscent() / 2;
    var xc;
    var yc;

    if (this instanceof RailElm || this instanceof SweepElm) {
        xc = this.x2;
        yc = this.y2;
    } else {
        xc = (this.x2 + this.x1) / 2;
        yc = (this.y2 + this.y) / 2;
    }

    var dpx = Math.floor(this.dpx1 * hs);
    var dpy = Math.floor(this.dpy1 * hs);

    var offset = 20;

    var textLabel;

    paper.fillStyle = Color.color2HexString(Settings.TEXT_COLOR);

    if (dpx == 0) {
        // TODO: CANVAS

        paper.fillText(s, xc - w / 2+3*offset/2, yc - Math.abs(dpy) - offset/3);
//        textLabel = paper.text(xc - w / 2, yc - Math.abs(dpy) - offset, s).attr({
//            fill:Color.color2HexString(Settings.TEXT_COLOR),
//            'font-weight':'bold'
//        });
    } else {
        var xx = xc + Math.abs(dpx) + offset;

        if (this instanceof VoltageElm || (this.x1 < this.x2 && this.y > this.y2))
            xx = xc - (10 + Math.abs(dpx) + offset);

        // TODO: CANVAS
        paper.fillText(s, xx, yc + dpy + ya);
//        textLabel = paper.text(xx, yc + dpy + ya, s).attr({
//            'font-weight':'bold',
//            fill:Color.color2HexString(Settings.TEXT_COLOR)
//        });
    }

    return textLabel;

};

CircuitElement.prototype.drawCoil = function (hs, p1, p2, v1, v2) {
    // todo: implement
    var segments = 40;

    var segf = 1 / segments;

    CircuitElement.ps1.x1 = p1.x1;
    CircuitElement.ps1.y = p1.y;

    for (var i = 0; i < segments; ++i) {
        var cx = ( ((i + 1) * 8 * segf) % 2 ) - 1;
        var hsx = Math.sqrt(1 - cx * cx);
        if (hsx < 0)
            hsx = -hsx;
        CircuitElement.interpPoint(p1, p2, CircuitElement.ps2, i * segf, hsx * hs);
        var v = v1 + (v2 - v1) * i / segments;

        var color = this.setVoltageColor(v);
        CircuitElement.drawThickLinePt(CircuitElement.ps1, CircuitElement.ps2, color);

        CircuitElement.ps1.x1 = CircuitElement.ps2.x1;
        CircuitElement.ps1.y = CircuitElement.ps2.y;
    }
};

CircuitElement.drawCircle = function (x0, y0, r, color) {

    paper.beginPath();
        paper.strokeStyle = Color.color2HexString(color);
        paper.arc(x0, y0, r, 0, 2*Math.PI, true);
        paper.stroke();
    paper.closePath();

//    circ.attr({
//        stroke:Color.color2HexString(Settings.POST_COLOR),
//        'stroke-width':Settings.LINE_WIDTH
//        //'fill-opacity':0
//    });
//    return circ;
};

CircuitElement.drawThickLine = function (x, y, x2, y2, color) {

    paper.strokeStyle = (color) ? Color.color2HexString(color) : CircuitElement.color;
    paper.beginPath();
        paper.moveTo(x, y);
        paper.lineTo(x2, y2);
        paper.stroke();
    paper.closePath();

//    var pathName = "M " + x + " " + y + " l " + (x2 - x) + " " + (y2 - y);
//    var newLine = paper.path(pathName);
//    var line_color = (color) ? Color.color2HexString(color) : CircuitElement.color;
//    newLine.attr({
//        'stroke':Color.color2HexString(color),
//        'stroke-width':Settings.LINE_WIDTH
//    });
//    return newLine;
};

CircuitElement.drawThickLinePt = function (pa, pb, color) {
    return CircuitElement.drawThickLine(pa.x1, pa.y, pb.x1, pb.y, color);
};


CircuitElement.drawThickPolygon = function (xlist, ylist, c, color) {
    var i;
    for (i = 0; i < (c.length - 1); ++i)
        CircuitElement.drawThickLine(xlist[i], ylist[i], xlist[i + 1], ylist[i + 1], color);

    CircuitElement.drawThickLine(xlist[i], ylist[i], xlist[0], ylist[0], color);
};

CircuitElement.drawThickPolygonP = function (polygon, color) {
    var c = polygon.numPoints();
    var i;
    for (i = 0; i < (c - 1); ++i)
        CircuitElement.drawThickLine(polygon.getX(i), polygon.getY(i), polygon.getX(i + 1), polygon.getY(i + 1), color);

    CircuitElement.drawThickLine(polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color);
};


CircuitElement.prototype.drawPosts = function () {
    for (var i = 0; i < this.getPostCount(); ++i) {
        var p = this.getPost(i);
        this.drawPost(p.x1, p.y, this.nodes[i]);
    }
};

CircuitElement.prototype.drawPost = function (x0, y0, node) {
    if (node) {
        if (Circuit.dragElm == null && !this.needsHighlight() && Circuit.getCircuitNode(node).links.length == 2)
            return;
        if (Circuit.mouseMode == Circuit.MODE_DRAG_ROW || Circuit.mouseMode == Circuit.MODE_DRAG_COLUMN)
            return;
    }

    paper.beginPath();
        if(this.needsHighlight()) {
            paper.fillStyle = Color.color2HexString(Settings.POST_COLOR_SELECTED);
            paper.strokeStyle = Color.color2HexString(Settings.POST_COLOR_SELECTED);
        } else {
            paper.fillStyle = Color.color2HexString(Settings.POST_COLOR);
            paper.strokeStyle = Color.color2HexString(Settings.POST_COLOR);
        }

        paper.arc(x0, y0, Settings.POST_RADIUS, 0, 2*Math.PI, true);
        paper.stroke();
        paper.fill();
    paper.closePath();

    //var circ = paper.circle(x0, y0, Settings.POST_RADIUS);
    //circ.attr({
    //    stroke:Color.color2HexString(Settings.POST_COLOR),
    //    fill:Color.color2HexString(Settings.POST_COLOR)
    //});
};

CircuitElement.getVoltageDText = function (v) {
    return CircuitElement.getUnitText(Math.abs(v), "V");
};

CircuitElement.getVoltageText = function (v) {
    return CircuitElement.getUnitText(v, "V");
};

CircuitElement.getUnitText = function (v, u) {
    var va = Math.abs(v);
    if (va < 1e-14)
        return "0 " + u;
    if (va < 1e-9)
        return (v * 1e12).toFixed(2) + " p" + u;
    if (va < 1e-6)
        return (v * 1e9).toFixed(2) + " n" + u;
    if (va < 1e-3)
        return (v * 1e6).toFixed(2) + " " + Circuit.muString + u;
    if (va < 1)
        return (v * 1e3).toFixed(2) + " m" + u;
    if (va < 1e3)
        return (v).toFixed(2) + " " + u;
    if (va < 1e6)
        return (v * 1e-3).toFixed(2) + " k" + u;
    if (va < 1e9)
        return (v * 1e-6).toFixed(2) + " M" + u;
    return (v * 1e-9).toFixed(2) + " G" + u;
};

/** V is a number, u is  string */
CircuitElement.getShortUnitText = function (v, u) {

    var va = Math.abs(v);
    if (va < 1e-13)
        return null;
    if (va < 1e-9)
        return (v * 1e12).toFixed(1) + "p" + u;
    if (va < 1e-6)
        return (v * 1e9).toFixed(1) + "n" + u;
    if (va < 1e-3)
        return (v * 1e6).toFixed(1) + Circuit.muString + u;
    if (va < 1)
        return (v * 1e3).toFixed(1) + "m" + u;
    if (va < 1e3)
        return (v).toFixed(1) + u;
    if (va < 1e6)
        return (v * 1e-3).toFixed(1) + "k" + u;
    if (va < 1e9)
        return (v * 1e-6).toFixed(1) + "M" + u;
    return (v * 1e-9).toFixed(1) + "G" + u;

};

CircuitElement.getCurrentText = function (i) {
    return CircuitElement.getUnitText(i, "A");
};

CircuitElement.getCurrentDText = function (i) {
    return CircuitElement.getUnitText(Math.abs(i), "A");
};

CircuitElement.prototype.updateDotCount = function (cur, cc) {
    if (isNaN(cur))
        cur = this.current;
    if (isNaN(cc))
        cc = this.curcount;

    if (Circuit.stoppedCheck)
        return cc;
    var cadd = cur * CircuitElement.currentMult;

    cadd %= 8;
    this.curcount = cadd + cc;
    return cc + cadd;
};

CircuitElement.prototype.doDots = function () {
    this.curcount = this.updateDotCount();

    if (Circuit.dragElm != this)
        this.drawDots(this.point1, this.point2, this.curcount);

};

CircuitElement.prototype.getInfo = function (arr) {
    // Extended by subclasses
};

CircuitElement.prototype.getBasicInfo = function (arr) {
    arr[1] = "I = " + CircuitElement.getCurrentDText(this.getCurrent());
    arr[2] = "Vd = " + CircuitElement.getVoltageDText(this.getVoltageDiff());
    return 3;
};

CircuitElement.prototype.setVoltageColor = function (volts) {
    if (this.needsHighlight()) {
        return Settings.SELECT_COLOR
    }
    if (!Circuit.voltsCheckItem) {
        if (!Circuit.powerCheckItem) // && !conductanceCheckItem.getState())
            return CircuitElement.whiteColor;
    }
    var c = Math.floor((volts + CircuitElement.voltageRange) * (CircuitElement.colorScaleCount - 1) / (CircuitElement.voltageRange * 2));
    if (c < 0)
        c = 0;
    if (c >= CircuitElement.colorScaleCount)
        c = CircuitElement.colorScaleCount - 1;

    return Math.floor(CircuitElement.colorScale[c].getColor());
};


CircuitElement.prototype.setPowerColor = function (yellow) {

    if (!Circuit.powerCheckItem)
        return;

    var w0 = this.getPower();

    w0 *= CircuitElement.powerMult;
    //console.log(w);
    var w = (w0 < 0) ? -w0 : w0;

    if (w > 1)
        w = 1;

    var rg = 128 + Math.floor(w * 127);
    var b = Math.floor(128 * (1 - w));
    /*if (yellow)
     //g.setColor(new Color(rg, rg, b));
     else */

    //if (w0 > 0)
    //g.beginFill( (new Color(rg, b, b)).getColor() );
    //else
    //g.beginFill( (new Color(b, rg, b)).getColor() );
};

CircuitElement.prototype.getPower = function () {
    return this.getVoltageDiff() * this.current;
};

CircuitElement.prototype.getScopeValue = function (x) {
    return (x == 1) ? this.getPower() : this.getVoltageDiff();
};

CircuitElement.prototype.getScopeUnits = function (x) {
    return (x == 1) ? "W" : "V";
};

CircuitElement.prototype.getEditInfo = function (n) {
    return null;
}

CircuitElement.prototype.setEditValue = function (n, ei) {
};

CircuitElement.prototype.getConnection = function (n1, n2) {
    return true;
};

CircuitElement.prototype.hasGroundConnection = function (n1) {
    return false;
};

CircuitElement.prototype.isWire = function () {
    return false;
};

CircuitElement.prototype.canViewInScope = function () {
    return this.getPostCount() <= 2;
};

CircuitElement.prototype.comparePair = function (x1, x2, y1, y2) {
    return ((x1 == y1 && x2 == y2) || (x1 == y2 && x2 == y1));
};

CircuitElement.prototype.needsHighlight = function () {
    return (Circuit.mouseElm == this || this.selected);
};

CircuitElement.prototype.isSelected = function () {
    return this.selected;
};

CircuitElement.prototype.setSelected = function (selected) {
    this.selected = selected;
};

CircuitElement.prototype.selectRect = function (r) {
    this.selected = r.intersects(this.boundingBox);
};

CircuitElement.prototype.getBoundingBox = function () {
    return this.boundingBox;
};

CircuitElement.prototype.needsShortcut = function () {
    return false;
};

CircuitElement.prototype.toString = function () {
    return "Circuit Element";
};


