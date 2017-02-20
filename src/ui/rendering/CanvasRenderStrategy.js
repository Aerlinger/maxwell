let Settings = require("../../Settings");
let Color = require('../../util/Color.js');
let Util = require('../../util/Util.js');
let Point = require('../../geom/Point.js');

let lineShift = 0;

/**
 * A set of primitive rendering definitions responsible for drawing components of the circuit
 */
class CanvasRenderStrategy {
  constructor(context, fullScaleVRange) {
    this.context = context;
    this.fullScaleVRange = fullScaleVRange;
  }

  drawDots(ptA, ptB, component) {
    /**
     * Previous behavior was for current to not display when paused
     if (this.Circuit && this.Circuit.isStopped) {
      return
    }
     */

    this.context.save();

    var ds = Settings.CURRENT_SEGMENT_LENGTH;

    var dx = ptB.x - ptA.x;
    var dy = ptB.y - ptA.y;
    var dn = Math.sqrt((dx * dx) + (dy * dy));

    var newPos;

    if (typeof(component) == "number") {
      newPos = component
    } else {
      if (!component)
        return;
      newPos = component.curcount;
    }

    while (newPos < dn) {
      var xOffset = ptA.x + ((newPos * dx) / dn);
      var yOffset = ptA.y + ((newPos * dy) / dn);

      if (Settings.CURRENT_DISPLAY_TYPE === Settings.CURENT_TYPE_DOTS) {
        this.drawCircle(xOffset, yOffset, Settings.CURRENT_RADIUS, 1, Settings.CURRENT_COLOR);
      } else {
        var xOffset0 = xOffset - ((3 * dx) / dn);
        var yOffset0 = yOffset - ((3 * dy) / dn);

        var xOffset1 = xOffset + ((3 * dx) / dn);
        var yOffset1 = yOffset + ((3 * dy) / dn);

        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = Settings.CURRENT_COLOR;
        this.context.lineWidth = Settings.LINE_WIDTH + 0.5;
        this.context.moveTo(xOffset0, yOffset0);
        this.context.lineTo(xOffset1, yOffset1);
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
      }

      newPos += ds
    }

    this.context.restore();
  }

  drawInfoText(highlightedComponent) {
    if (highlightedComponent != null) {
      let summaryArr = highlightedComponent.getSummary();

      if (summaryArr) {
        for (let idx = 0; idx < summaryArr.length; ++idx) {
          this.drawText(summaryArr[idx], 730, 50 + (idx * 11) + 5, "#1b4e24");
        }
      }
    }
  }

  drawDebugOverlay(circuit) {
    if (!circuit) return;

    this.context.save();

    // Nodes
    let nodeIdx = 0;
    for (let node of circuit.getNodes()) {

      this.context.beginPath();
      this.context.arc(node.x, node.y, 1, 0, 2 * Math.PI, true);
      this.context.strokeStyle = "#ff00ab";
      this.context.stroke();
      this.context.fillText(nodeIdx, node.x + 5, node.y + 20);

      let yOffset = 30;
      for (let link of node.links) {
        //this.context.drawText(link.elm.getName(), node.x + 5, node.y + yOffset);

        yOffset += 10;
      }

      nodeIdx++;
    }

    this.context.restore();
  }

  drawDebugInfo(circuitApp, x = 1100, y = 50) {
    if (!circuitApp.Circuit || !circuitApp.context) return;

    let str = `UI: ${circuitApp.width}x${circuitApp.height}\n`;
    str += circuitApp.getMode() + "\n";

    str += "Highlighted Node: :" + circuitApp.highlightedNode + "\n";
    str += "Selected Node: :" + circuitApp.selectedNode + "\n";
    str += "Highlighted Component: " + circuitApp.highlightedComponent + "\n";
    // str += `Selection [${this.marquee || ""}]\n  - `;
    str += circuitApp.selectedComponents.join("\n  - ") + "\n";

    str += "\nCircuit:\n";

    // Name
    str += circuitApp.Circuit.toString();

    let lineHeight = 10;
    let nLines = 0;
    for (let line of str.split("\n")) {
      this.context.fillText(line, x, y + nLines * lineHeight);

      nLines++;
    }
  }

  drawBoldLines() {
    return this.boldLines = true;
  }

  drawDefaultLines() {
    return this.boldLines = false;
  }

  // Draw Primitives
  drawZigZag(point1, point2, vStart, vEnd) {
    let context = this.context;
    context.save();
    context.beginPath();

    context.moveTo(point1.x, point1.y);
    context.lineJoin = 'bevel';

    let grad = context.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
    let voltColor0 = this.getVoltageColor(vStart);
    let voltColor1 = this.getVoltageColor(vEnd);

    grad.addColorStop(0, voltColor0);
    grad.addColorStop(1, voltColor1);

    context.strokeStyle = grad;

    if (this.boldLines) {
      context.lineWidth = Settings.BOLD_LINE_WIDTH;
      context.strokeStyle = Settings.SELECT_COLOR;
    } else {
      context.lineWidth = Settings.LINE_WIDTH + 1;
    }

    let numSegments = 8;
    let width = 5;
    let parallelOffset = 1 / numSegments;

    // Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
    let offsets = [1, -1];

    let startPosition = Util.interpolate(point1, point2, parallelOffset / 2, width);
    context.lineTo(startPosition.x + lineShift, startPosition.y + lineShift);

    // Draw resistor "zig-zags"
    for (let n = 1; n < numSegments; n++) {
      startPosition = Util.interpolate(point1, point2, n * parallelOffset + parallelOffset / 2, width * offsets[n % 2]);

      context.lineTo(startPosition.x + lineShift, startPosition.y + lineShift);
    }

    context.lineTo(point2.x + lineShift, point2.y + lineShift);

    context.stroke();

    context.closePath();
    context.restore();
  }

  drawCoil(point1, point2, vStart, vEnd, hs) {
    let color, cx, hsx, voltageLevel;
    hs = hs || 8;

    let segments = 40;

    let ps1 = new Point(0, 0);
    let ps2 = new Point(0, 0);

    ps1.x = point1.x;
    ps1.y = point1.y;

    this.context.save();

    this.context.beginPath();
    this.context.lineJoin = 'bevel';

    let grad = this.context.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
    grad.addColorStop(0, this.getVoltageColor(vStart));
    grad.addColorStop(1, this.getVoltageColor(vEnd));

    this.context.strokeStyle = grad;

    this.context.moveTo(ps1.x + lineShift, ps1.y + lineShift);

    if (this.boldLines) {
      this.context.lineWidth = Settings.BOLD_LINE_WIDTH;
      this.context.strokeStyle = Settings.SELECT_COLOR;
    } else {
      this.context.lineWidth = Settings.LINE_WIDTH + 1;
    }

    for (let i = 0; i < segments; ++i) {
      cx = (((i + 1) * 8 / segments) % 2) - 1;
      hsx = Math.sqrt(1 - cx * cx);

      ps2 = Util.interpolate(point1, point2, i / segments, hsx * hs);
      voltageLevel = vStart + (vEnd - vStart) * i / segments;
      color = this.getVoltageColor(voltageLevel);

      this.context.lineTo(ps2.x + lineShift, ps2.y + lineShift);

      ps1.x = ps2.x;
      ps1.y = ps2.y;
    }

    this.context.stroke();

    this.context.closePath();
    this.context.restore()
  }

  drawLeads(component) {
    if ((component.point1 != null) && (component.lead1 != null))
      this.drawLinePt(component.point1, component.lead1, this.getVoltageColor(component.volts[0]));

    if ((component.point2 != null) && (component.lead2 != null))
      this.drawLinePt(component.lead2, component.point2, this.getVoltageColor(component.volts[1]));
  }

  drawPosts(component, color = Settings.POST_COLOR) {
    let post;

    for (let i = 0; i < component.numPosts(); ++i) {
      post = component.getPost(i);
      this.drawPost(post.x, post.y, color);
    }
  }

  drawPost(x0, y0, fillColor = Settings.POST_COLOR, strokeColor = Settings.POST_OUTLINE_COLOR) {
    let oulineWidth = Settings.POST_OUTLINE_SIZE;

    if (this.boldLines) {
      strokeColor = Settings.POST_SELECT_OUTLINE_COLOR;
      fillColor = Settings.POST_SELECT_COLOR;
      oulineWidth += 3;
    }

    this.drawCircle(x0, y0, Settings.POST_RADIUS, oulineWidth, strokeColor, fillColor);
  }

  drawText(text, x, y, fillColor = Settings.TEXT_COLOR, size = Settings.TEXT_SIZE, strokeColor = 'rgba(255, 255, 255, 0.3)') {
    this.context.save();

    this.context.fillStyle = fillColor;
    this.context.strokeStyle = strokeColor;
    this.context.font = `${Settings.TEXT_STYLE} ${size}pt ${Settings.FONT}`;
    this.context.fillText(text, x, y);

    this.context.lineWidth = 0;
    this.context.strokeText(text, x, y);

    let textMetrics = this.context.measureText(text);

    this.context.restore();

    return textMetrics;
  }

  getVoltageColor(volts) {
    let fullScaleVRange = this.fullScaleVRange;

    let scale = Color.Gradients.voltage_default;
    let numColors = scale.length - 1;

    let value = Math.floor(((volts + fullScaleVRange) * numColors) / (2 * fullScaleVRange));

    if (value < 0) {
      value = 0;
    } else if (value >= numColors) {
      value = numColors - 1;
    }

    return scale[value];
  }

  drawValue(perpindicularOffset, parallelOffset, component, text = null, text_size = Settings.TEXT_SIZE) {
    let x, y;

    this.context.save();
    this.context.textAlign = "center";

    this.context.font = "bold 7pt Courier";

    let theta = Math.atan(component.dy() / component.dx());

    let stringWidth = this.context.measureText(text).width;
    let stringHeight = this.context.measureText(text).actualBoundingBoxAscent || 0;

    this.context.fillStyle = Settings.TEXT_COLOR;

    ({x} = component.getCenter()); //+ perpindicularOffset
    ({y} = component.getCenter()); //+ parallelOffset - stringHeight / 2.0

    this.context.translate(x, y);
    this.context.rotate(theta);
    this.drawText(text, parallelOffset, -perpindicularOffset, Settings.TEXT_COLOR, text_size);

    this.context.restore();
  }

  drawCircle(x, y, radius, lineWidth = Settings.LINE_WIDTH, lineColor = Settings.STROKE_COLOR, fillColor = Settings.FG_COLOR) {
    // this.context.save();

    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);

    if (lineColor && lineWidth > 0) {
      this.context.lineWidth = lineWidth;
      this.context.strokeStyle = lineColor;
      this.context.stroke();
    }

    if (fillColor) {
      this.context.fillStyle = fillColor;
      this.context.fill();
    }

    this.context.closePath();
    // this.context.restore();
  }

  drawRect(x, y, width, height, lineWidth = Settings.LINE_WIDTH, lineColor = Settings.STROKE_COLOR) {
    this.context.save();

    this.context.strokeStyle = lineColor;
    this.context.lineJoin = 'miter';
    this.context.lineWidth = lineWidth;
    this.context.strokeRect(x + lineShift, y + lineShift, width, height);
    this.context.stroke();

    this.context.restore();
  }

  drawLinePt(pa, pb, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) {
    this.drawLine(pa.x, pa.y, pb.x, pb.y, color, lineWidth);
  }

  drawLine(x, y, x2, y2, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) {
    this.context.save();

    this.context.lineCap = "round";

    if (!this.pathMode)
      this.context.beginPath();

    if (this.boldLines) {
      this.context.lineWidth = Settings.BOLD_LINE_WIDTH;
      this.context.strokeStyle = Settings.SELECT_COLOR;
    } else {
      this.context.lineWidth = lineWidth;
      this.context.strokeStyle = color;
    }

    if (!this.pathMode)
      this.context.moveTo(x + lineShift, y + lineShift);
    this.context.lineTo(x2 + lineShift, y2 + lineShift);
    this.context.stroke();

    if (!this.pathMode)
      this.context.closePath();

    this.context.restore();
  }

  drawPolygon(polygon, color = Settings.STROKE_COLOR, fill = Settings.FILL_COLOR, lineWidth = Settings.LINE_WIDTH) {
    let numVertices = polygon.numPoints();

    this.context.save();

    this.context.fillStyle = fill;
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.beginPath();

    this.context.moveTo(polygon.getX(0) + 0.5, polygon.getY(0) + 0.5);
    for (let i = 0; i < numVertices; ++i) {
      this.context.lineTo(polygon.getX(i) + 0.5, polygon.getY(i) + 0.5);
    }

    this.context.closePath();
    if (fill) {
      this.context.fill();
    }
    this.context.stroke();

    this.context.restore();
  }
}

module.exports = CanvasRenderStrategy;
