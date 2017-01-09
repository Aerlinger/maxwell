let Observer = require('../util/observer.js');
let Settings = require('../settings/settings.js');
let Util = require('../util/util.js');
let Point = require('../geom/point.js');

class BaseRenderer extends Observer {
  drawInfo() {
    // TODO: Find where to show data; below circuit, not too high unless we need it
//    bottomTextOffset = 100
//    ybase = @getCircuitBottom() - (1 * 15) - bottomTextOffset
    this.context.fillText(`t = ${Util.longFormat(this.Circuit.time)} s`, 10, 10);
    return this.context.fillText(`F.T. = ${this.Circuit.frames}`, 10, 20);
  }

  drawWarning(context) {
    let msg = "";
    for (let warning of Array.from(warningStack)) {
      msg += warning + "\n";
    }
    return console.error(`Simulation Warning: ${msg}`);
  }

  drawError(context) {
    let msg = "";
    for (let error of Array.from(errorStack)) {
      msg += error + "\n";
    }
    return console.error(`Simulation Error: ${msg}`);
  }

  fillText(text, x, y, fillColor) {
    if (fillColor == null) { fillColor = Settings.TEXT_COLOR; }
    __guard__(this.context, x1 => x1.save());
    let origFillStyle = __guard__(this.context, x2 => x2.fillStyle);
    __guard__(this.context, x3 => x3.fillStyle = fillColor);
    __guard__(this.context, x4 => x4.fillText(text, x, y));
    __guard__(this.context, x5 => x5.fillStyle = origFillStyle);
    return __guard__(this.context, x6 => x6.restore());
  }

  fillCircle(x, y, radius, lineWidth, fillColor, lineColor) {
    if (lineWidth == null) { lineWidth = Settings.LINE_WIDTH; }
    if (fillColor == null) { fillColor = '#FFFF00'; }
    if (lineColor == null) { lineColor = null; }
    this.context.save();

    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI, true);

    if (lineColor) {
      this.context.lineWidth = lineWidth;
      this.context.strokeStyle = lineColor;
      this.context.stroke();
    }

    this.context.fillStyle = fillColor;
    this.context.fill();

    this.context.closePath();

    return this.context.restore();
  }


  drawCircle(x, y, radius, lineWidth, lineColor) {
    if (lineWidth == null) { lineWidth = Settings.LINE_WIDTH; }
    if (lineColor == null) { lineColor = "#000000"; }
    this.context.save();

    this.context.strokeStyle = lineColor;
    this.context.lineWidth = lineWidth;

    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
    this.context.stroke();
    this.context.closePath();

    return this.context.restore();
  }

  drawRect(x, y, width, height, lineWidth, lineColor) {
    if (lineWidth == null) { lineWidth = Settings.LINE_WIDTH; }
    if (lineColor == null) { lineColor = "#000000"; }
    this.context.strokeStyle = lineColor;
    this.context.lineJoin = 'miter';
    this.context.lineWidth = 0;
    this.context.strokeRect(x, y, width, height);
    return this.context.stroke();
  }

  drawLinePt(pa, pb, color) {
    if (color == null) { color = Settings.STROKE_COLOR; }
    return this.drawLine(pa.x, pa.y, pb.x, pb.y, color);
  }

  drawLine(x, y, x2, y2, color, lineWidth) {
    if (color == null) { color = Settings.STROKE_COLOR; }
    if (lineWidth == null) { lineWidth = Settings.LINE_WIDTH; }
    this.context.save();
    this.context.beginPath();

    if (this.boldLines) {
      this.context.lineWidth = Settings.BOLD_LINE_WIDTH;
      this.context.strokeStyle = Settings.SELECT_COLOR;
      this.context.moveTo(x, y);
      this.context.lineTo(x2, y2);
      this.context.stroke();

    } else {
      this.context.strokeStyle = color;
      this.context.lineWidth = lineWidth;
      this.context.moveTo(x, y);
      this.context.lineTo(x2, y2);
      this.context.stroke();
    }

    this.context.closePath();

    return this.context.restore();
  }

  drawThickPolygon(xlist, ylist, color, fill) {
    if (color == null) { color = Settings.STROKE_COLOR; }
    if (fill == null) { fill = Settings.FILL_COLOR; }
    this.context.save();

    this.context.fillStyle = fill;
    this.context.strokeStyle = color;
    this.context.beginPath();

    this.context.moveTo(xlist[0], ylist[0]);
    for (let i = 1, end = xlist.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      this.context.lineTo(xlist[i], ylist[i]);
    }

    this.context.closePath();
    this.context.stroke();
    if (color) {
      this.context.fill();
    }

    return this.context.restore();
  }

  drawThickPolygonP(polygon, color, fill) {
    if (color == null) { color = Settings.STROKE_COLOR; }
    if (fill == null) { fill = Settings.FILL_COLOR; }
    let numVertices = polygon.numPoints();

    this.context.save();

    this.context.fillStyle = fill;
    this.context.strokeStyle = color;
    this.context.beginPath();

    this.context.moveTo(polygon.getX(0), polygon.getY(0));
    for (let i = 0, end = numVertices, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      this.context.lineTo(polygon.getX(i), polygon.getY(i));
    }

    this.context.closePath();
    this.context.fill();
    this.context.stroke();
    return this.context.restore();
  }

  drawPolyLine(xList, yList, lineWidth, color) {
    if (lineWidth == null) { lineWidth = Settings.LINE_WIDTH; }
    if (color == null) { color = Settings.STROKE_COLOR; }
    this.context.save();

    this.context.beginPath();

    this.context.moveTo(xlist[0], ylist[0]);
    for (let i = 1, end = xlist.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      this.context.lineTo(xlist[i], ylist[i]);
    }

    return this.context.restore();
  }


  drawValue(x1, y1, circuitElm, str) {}

  drawCoil(point1, point2, vStart, vEnd, hs) {
    let color, cx, hsx, voltageLevel;
    if (hs == null) { hs = null; }
    hs = hs || 8;
    let segments = 40;

    let ps1 = new Point(0, 0);
    let ps2 = new Point(0, 0);

    ps1.x = point1.x;
    ps1.y = point1.y;

    return __range__(0, segments, false).map((i) =>
      (cx = ((((i + 1) * 8) / segments) % 2) - 1,
      hsx = Math.sqrt(1 - (cx * cx)),
      ps2 = Util.interpolate(point1, point2, i / segments, hsx * hs),

      voltageLevel = vStart + (((vEnd - vStart) * i) / segments),
      color = Util.getVoltageColor(voltageLevel),
      this.drawLinePt(ps1, ps2, color),

      ps1.x = ps2.x,
      ps1.y = ps2.y));
  }
}

module.exports = BaseRenderer;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}