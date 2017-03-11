/**
 * A set of primitive rendering definitions responsible for drawing components of the circuit
 */
module.exports = function CanvasRenderStrategy(context, config, fullScaleVRange) {
  Object.assign(this, config);

  let Color = require('../../util/Color');
  let Util = require('../../util/Util');
  let Point = require('../../geom/Point');

  let boldLines = false;
  let lineShift = 0;

  this.withMargin = function (marginLeft, marginTop, block) {
    clearCanvas();

    context.save();
    context.translate(marginLeft, marginTop);

    block();

    context.restore();
  };

  this.drawComponents = function(circuit, selectedComponents) {
    for (let component of circuit.getElements()) {
      if (component && selectedComponents.includes(component))
        drawBoldLines();
      else
        drawDefaultLines();

      component.draw(this, config);
    }

    drawDefaultLines();
  };

  this.drawHighlightedNode = function (highlightedNode) {
    if (highlightedNode)
      this.drawCircle(highlightedNode.x, highlightedNode.y, config.POST_RADIUS + 4, 0, '#0F0', config.HIGHLIGHT_COLOR);
  };

  this.drawSelectedNodes = function (selectedNode) {
    if (selectedNode)
      this.drawRect(selectedNode.x - 10 + 0.5, selectedNode.y - 10 + 0.5, 21, 21, {lineWidth: 1, lineColor: '#0FF'});
  };

  this.drawHighlightedComponent = function (highlightedComponent) {
    if (highlightedComponent) {
      highlightedComponent.draw(this, config);

      context.fillStyle = config.HIGHLIGHT_COLOR;

      for (let i = 0; i < highlightedComponent.numPosts(); ++i) {
        let post = highlightedComponent.getPost(i);

        context.fillRect(post.x - config.POST_RADIUS - 1, post.y - config.POST_RADIUS - 1, 2 * config.POST_RADIUS + 2, 2 * config.POST_RADIUS + 2);
      }

      // if (highlightedComponent.x2())
      //   context.fillRect(highlightedComponent.x2() - 2 * config.POST_RADIUS, highlightedComponent.y2() - 2 * config.POST_RADIUS, 4 * config.POST_RADIUS, 4 * config.POST_RADIUS);
    }
  };

  this.drawScopes = function (scopes) {
    for (let scopeElm of scopes) {
      let scopeCanvas = scopeElm.getCanvas();

      if (scopeCanvas) {
        let center = scopeElm.circuitElm.getCenter();

        context.setLineDash([5, 5]);
        context.strokeStyle = '#FFA500';
        context.lineWidth = 1;
        context.moveTo(center.x, center.y);
        context.lineTo(scopeCanvas.x(), scopeCanvas.y() + scopeCanvas.height() / 2);

        context.stroke();
      }
    }
  };

  this.drawInfoText = function (circuit, highlightedComponent) {
    this.drawText('Time elapsed: ' + Util.getUnitText(circuit.time, 's'), 10, 5, '#bf4f00', 1.2 * config.TEXT_SIZE);
    this.drawText('Frame Time: ' + Math.floor(circuit.lastFrameTime) + 'ms', 600, 8, '#000968', 1.1 * config.TEXT_SIZE);

    if (highlightedComponent != null) {
      let summaryArr = highlightedComponent.getSummary();

      if (summaryArr) {
        for (let idx = 0; idx < summaryArr.length; ++idx) {
          this.drawText(summaryArr[idx], 730, 50 + (idx * 11) + 5, "#1b4e24");
        }
      }
    }
  };

  this.drawMarquee = function (marquee) {
    if (!marquee) return;

    let lineWidth = 0.1;
    let lineShift = 0.5;

    if ((marquee.x != null) && (marquee.x != null) && (marquee.height != null) && (marquee.width != null)) {
      this.drawLine(marquee.x1() + lineShift, marquee.y1() + lineShift, marquee.x2() + lineShift, marquee.y1() + lineShift, config.SELECTION_MARQUEE_COLOR, 1);
      this.drawLine(marquee.x1() + lineShift, marquee.y2() + lineShift, marquee.x2() + lineShift, marquee.y2() + lineShift, config.SELECTION_MARQUEE_COLOR, 1);

      this.drawLine(marquee.x1() + lineShift, marquee.y1() + lineShift, marquee.x1() + lineShift, marquee.y2() + lineShift, config.SELECTION_MARQUEE_COLOR, 1);
      this.drawLine(marquee.x2() + lineShift, marquee.y1() + lineShift, marquee.x2() + lineShift, marquee.y2() + lineShift, config.SELECTION_MARQUEE_COLOR, 1);
    }
  };

  this.drawDebugInfo = function (circuitApp, x = 1100, y = 50) {
    let circuit = circuitApp.Circuit;

    if (!circuit || !circuit.debugModeEnabled()) return;

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
      context.fillText(line, x, y + nLines * lineHeight);

      nLines++;
    }

    drawDebugOverlay(circuit);

    for (let nodeIdx = 0; nodeIdx < circuit.numNodes(); ++nodeIdx) {
      let voltage = Util.singleFloat(circuit.getVoltageForNode(nodeIdx));
      let node = circuit.getNode(nodeIdx);

      context.fillText(`${nodeIdx}:${voltage}`, node.x + 10, node.y - 10, '#FF8C00');
    }
  };

  // Private

  function clearCanvas() {
    let {canvas} = context;

    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
  }

  this.drawDots = function (ptA, ptB, component) {
    // if (component.Circuit && component.Circuit.isStopped)
    //   return;

    var ds = config.CURRENT_SEGMENT_LENGTH;

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

      if (config.CURRENT_DISPLAY_TYPE === config.CURRENT_TYPE_DOTS) {
        this.drawCircle(xOffset, yOffset, config.CURRENT_RADIUS, 1, config.CURRENT_COLOR);
      } else {
        var xOffset0 = xOffset - ((3 * dx) / dn);
        var yOffset0 = yOffset - ((3 * dy) / dn);

        var xOffset1 = xOffset + ((3 * dx) / dn);
        var yOffset1 = yOffset + ((3 * dy) / dn);

        context.beginPath();
        context.strokeStyle = config.CURRENT_COLOR;
        context.lineWidth = config.LINE_WIDTH + 0.5;
        context.moveTo(xOffset0, yOffset0);
        context.lineTo(xOffset1, yOffset1);
        context.stroke();
        context.closePath();
      }

      newPos += ds
    }
  };

  function drawDebugOverlay(circuit) {
    if (!circuit) return;

    // Nodes
    let nodeIdx = 0;
    for (let node of circuit.getNodes()) {
      context.beginPath();
      context.arc(node.x, node.y, 1, 0, 2 * Math.PI, true);
      context.strokeStyle = "#ff00ab";
      context.stroke();
      context.fillText(nodeIdx, node.x + 5, node.y + 20);

      let yOffset = 30;
      for (let link of node.links) {
        //context.drawText(link.elm.getName(), node.x + 5, node.y + yOffset);

        yOffset += 10;
      }

      nodeIdx++;
    }
  }

  function drawBoldLines() {
    boldLines = true;
  }

  function drawDefaultLines() {
    boldLines = false;
  }

  // Draw Primitives
  this.drawZigZag = function (point1, point2, vStart, vEnd) {
    context.beginPath();

    context.moveTo(point1.x, point1.y);
    context.lineJoin = 'bevel';

    let grad = context.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
    let voltColor0 = this.getVoltageColor(vStart);
    let voltColor1 = this.getVoltageColor(vEnd);

    grad.addColorStop(0, voltColor0);
    grad.addColorStop(1, voltColor1);

    context.strokeStyle = grad;

    if (boldLines) {
      context.lineWidth = config.BOLD_LINE_WIDTH;
      context.strokeStyle = config.SELECT_COLOR;
    } else {
      context.lineWidth = config.LINE_WIDTH + 0.5;
    }

    let numSegments = 8;
    let width = 4;
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
  };

  this.drawCoil = function (point1, point2, vStart, vEnd, hs = 6) {
    let color, cx, hsx, voltageLevel;

    let segments = 40;

    let ps1 = new Point(0, 0);
    let ps2 = new Point(0, 0);

    ps1.x = point1.x;
    ps1.y = point1.y;

    context.beginPath();
    context.lineJoin = 'bevel';

    let grad = context.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
    grad.addColorStop(0, this.getVoltageColor(vStart));
    grad.addColorStop(1, this.getVoltageColor(vEnd));

    context.strokeStyle = grad;

    context.moveTo(ps1.x + lineShift, ps1.y + lineShift);

    if (boldLines) {
      context.lineWidth = config.BOLD_LINE_WIDTH;
      context.strokeStyle = config.SELECT_COLOR;
    } else {
      context.lineWidth = config.LINE_WIDTH + 0.5;
    }

    for (let i = 0; i < segments; ++i) {
      cx = (((i + 1) * 8 / segments) % 2) - 1;
      hsx = Math.sqrt(1 - cx * cx);

      ps2 = Util.interpolate(point1, point2, i / segments, hsx * hs);
      voltageLevel = vStart + (vEnd - vStart) * i / segments;
      color = this.getVoltageColor(voltageLevel);

      context.lineTo(ps2.x + lineShift, ps2.y + lineShift);

      ps1.x = ps2.x;
      ps1.y = ps2.y;
    }

    context.stroke();

    context.closePath();
  };

  this.drawLeads = function (component) {
    if ((component.point1 != null) && (component.lead1 != null))
      this.drawLinePt(component.point1, component.lead1, this.getVoltageColor(component.volts[0]));

    if ((component.point2 != null) && (component.lead2 != null))
      this.drawLinePt(component.lead2, component.point2, this.getVoltageColor(component.volts[1]));
  };

  this.drawPosts = function (component, color = config.POST_COLOR, radius = config.POST_RADIUS) {
    let post;

    for (let i = 0; i < component.numPosts(); ++i) {
      post = component.getPost(i);
      this.drawPost(post.x, post.y, color, config.POST_OUTLINE_COLOR, radius);
    }
  };

  this.drawPost = function (x0, y0, fillColor = config.POST_COLOR, strokeColor = config.POST_OUTLINE_COLOR, radius = config.POST_RADIUS) {
    let oulineWidth = config.POST_OUTLINE_SIZE;

    if (boldLines) {
      strokeColor = config.POST_SELECT_OUTLINE_COLOR;
      fillColor = config.POST_SELECT_COLOR;
      oulineWidth += 3;
    }

    this.drawCircle(x0, y0, radius, oulineWidth, strokeColor, fillColor);
  };

  this.drawText = function (text, x, y, fillColor = config.TEXT_COLOR, size = config.TEXT_SIZE, strokeColor = 'rgba(255, 255, 255, 0.3)') {
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;
    context.font = `${config.TEXT_STYLE} ${size}pt ${config.FONT}`;
    context.fillText(text, x, y);

    context.lineWidth = 0;
    context.strokeText(text, x, y);

    let textMetrics = context.measureText(text);

    return textMetrics;
  };

  this.measureText = function (text) {
    return context.measureText(text);
  };

  this.getVoltageColor = function (volts) {
    let scale = config.Gradients.voltage_default;
    let numColors = scale.length - 1;

    let value = Math.floor(((volts + fullScaleVRange) * numColors) / (2 * fullScaleVRange));

    if (value < 0) {
      value = 0;
    } else if (value >= numColors) {
      value = numColors - 1;
    }

    return scale[value];
  };

  this.drawValue = function (perpindicularOffset, parallelOffset, component, text = null, text_size = config.TEXT_SIZE) {
    let x, y;

    context.save();
    context.textAlign = "center";

    context.font = "bold 7pt Courier";

    let theta = Math.atan(component.dy() / component.dx());

    let stringWidth = context.measureText(text).width;
    let stringHeight = context.measureText(text).actualBoundingBoxAscent || 0;

    context.fillStyle = config.TEXT_COLOR;

    ({x} = component.getCenter()); //+ perpindicularOffset
    ({y} = component.getCenter()); //+ parallelOffset - stringHeight / 2.0

    context.translate(x, y);
    context.rotate(theta);
    this.drawText(text, parallelOffset, -perpindicularOffset, config.TEXT_COLOR, text_size);

    context.restore();
  };

  this.drawCircle = function (x, y, radius, lineWidth = config.LINE_WIDTH, lineColor = config.STROKE_COLOR, fillColor = config.FG_COLOR) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);

    if (lineColor && lineWidth > 0) {
      context.lineWidth = lineWidth;
      context.strokeStyle = lineColor;
      context.stroke();
    }

    if (fillColor) {
      context.fillStyle = fillColor;
      context.fill();
    }

    context.closePath();
  };

  this.drawRect = function (x, y, width, height, {
      lineWidth = config.LINE_WIDTH,
      lineColor = config.STROKE_COLOR
  } = {}) {
    context.strokeStyle = lineColor;
    context.lineJoin = 'miter';
    context.lineWidth = lineWidth;
    context.strokeRect(x + lineShift, y + lineShift, width, height);
    context.stroke();
  };

  this.drawLinePt = function (pa, pb, color = config.STROKE_COLOR, lineWidth = config.LINE_WIDTH) {
    this.drawLine(pa.x, pa.y, pb.x, pb.y, color, lineWidth);
  };

  this.drawLine = function (x, y, x2, y2, color = config.STROKE_COLOR, lineWidth = config.LINE_WIDTH) {
    context.lineCap = "round";

    context.beginPath();

    if (boldLines) {
      context.lineWidth = config.BOLD_LINE_WIDTH;
      context.strokeStyle = config.SELECT_COLOR;
    } else {
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
    }

    context.moveTo(x + lineShift, y + lineShift);
    context.lineTo(x2 + lineShift, y2 + lineShift);
    context.stroke();

    context.closePath();
  };

  this.drawPolygon = function (polygon, {
      stroke = config.STROKE_COLOR,
      fill = config.FILL_COLOR,
      lineWidth = config.POLY_LINE_WIDTH
  } = {}) {
    let numVertices = polygon.numPoints();

    context.fillStyle = fill;
    if (stroke)
      context.strokeStyle = stroke;

    context.lineWidth = lineWidth;
    context.beginPath();

    context.moveTo(polygon.getX(0) + 0.5, polygon.getY(0) + 0.5);

    for (let i = 0; i < numVertices; ++i)
      context.lineTo(polygon.getX(i) + 0.5, polygon.getY(i) + 0.5);

    context.closePath();
    if (fill)
      context.fill();

    if (stroke)
      context.stroke();
  }
};

