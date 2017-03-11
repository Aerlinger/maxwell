module.exports = function SvgRenderStrategy(context, config, fullScaleVRange) {
  Object.assign(this, config);

  let Util = require('../../util/Util');
  let Point = require('../../geom/Point');
  let Polygon = require('../../geom/Polygon');
  let Color = require('../../util/Color');

  let CircuitComponent = require('../../components/CircuitComponent');
  let ScopeCanvas = require('../scopes/ScopeCanvas');

  let d3 = require("d3");

  let boldLines = false;

  this.svg = d3.select("body").append("svg")
      .attr("width", context.canvas.width)
      .attr("height", context.canvas.height)
      .append("g");

  this.drawHighlightedComponent = function (highlightedComponent) {

    if (highlightedComponent) {
      highlightedComponent.draw(this);

      for (let i = 0; i < highlightedComponent.numPosts(); ++i) {
        let post = highlightedComponent.getPost(i);

        this.drawRect(post.x - config.POST_RADIUS - 1, post.y - config.POST_RADIUS - 1, 2 * config.POST_RADIUS + 2, 2 * config.POST_RADIUS + 2, {fillColor: config.POST_COLOR});
      }

      if (highlightedComponent.x2())
        this.drawRect(highlightedComponent.x2() - 2 * config.POST_RADIUS, highlightedComponent.y2() - 2 * config.POST_RADIUS, 4 * config.POST_RADIUS, 4 * config.POST_RADIUS, {fillColor: config.POST_COLOR});
    }
  };

  this.clearCanvas = function () {
    this.svg.selectAll("*").remove();
  };


  this.drawHighlightedNode = function (highlightedNode) {
    if (highlightedNode)
      this.drawCircle(highlightedNode.x + 0.5, highlightedNode.y + 0.5, 7, 3, '#0F0');
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

  this.drawScopes = function (scopes) {
    /*
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
     */
  };

  this.drawSelectedNodes = function (selectedNode) {
    if (selectedNode)
      return this.drawRect(selectedNode.x - 10 + 0.5, selectedNode.y - 10 + 0.5, 21, 21, {lineWidth: 1, lineColor: '#0FF'});
  };

  this.withMargin = function (marginLeft, marginTop, block) {
    this.clearCanvas();

    let topNavHeight = 42;
    this.svg.attr("transform", "translate(" + marginLeft + "," + (marginTop - topNavHeight) + ")");

    // TOOD:
    block(this);
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

  /**
   * TODO: DRY with CanvasRenderStrategy
   *
   * @param circuit
   * @param selectedComponents
   */
  this.drawComponents = function (circuit, selectedComponents) {
    for (let component of circuit.getElements()) {
      if (component && selectedComponents.includes(component))
        drawBoldLines();
      else
        drawDefaultLines();

      component.draw(this, config);
    }

    drawDefaultLines();
  };

  // TODO: Move to CircuitComponent
  this.drawDots = function (ptA, ptB, component) {
    if (component.Circuit && component.Circuit.isStopped)
      return;

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

        this.drawLine(xOffset0, yOffset0, xOffset1, yOffset1, config.CURRENT_COLOR, config.LINE_WIDTH + 0.5)
      }

      newPos += ds
    }
  };

  function drawDebugOverlay() {
    if (!this.Circuit || !this.context) {
      return;
    }

    this.context.save();

    // Nodes
    let nodeIdx = 0;
    for (let node of this.Circuit.getNodes()) {

      this.context.beginPath();
      this.context.arc(node.x, node.y, 1, 0, 2 * Math.PI, true);
      this.context.strokeStyle = "#ff00ab";
      this.context.stroke();
      this.context.drawText(nodeIdx, node.x + 5, node.y + 20);

      let yOffset = 30;
      for (let link of node.links) {
        //this.context.drawText(link.elm.getName(), node.x + 5, node.y + yOffset);

        yOffset += 10;
      }

      nodeIdx++;
    }
    this.context.restore();

    // Nodes
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

      this.drawText(`${nodeIdx}:${voltage}`, node.x + 10, node.y - 10, '#FF8C00');
    }
  };

  this.measureText = function (text) {
    throw new Error("`measureText` is not implemented in SvgRenderStrategy")
  };

  function drawBoldLines() {
    boldLines = true;
  }

  function drawDefaultLines() {
    boldLines = false;
  }

  this.applyGradient = function(lineData, point1, point2, vStart, vEnd) {
    let gradient_id = `res-volt-gradient-${vStart}-${vEnd}`;

    let v = point1.diff(point2);

    let vx = v.x / Math.sqrt(v.norm());
    let vy = v.y / Math.sqrt(v.norm());

    var gradient = this.svg.append("linearGradient")
        .attr("id", gradient_id)
        .attr("x1", Math.max(vx, 0))
        .attr("x2", Math.max(-vx, 0))
        .attr("y1", Math.max(vy, 0))
        .attr("y2", Math.max(-vy, 0));

    gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", 0)
        .attr("stop-color", this.getVoltageColor(vStart))
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", 1)
        .attr("stop-color", this.getVoltageColor(vEnd))
        .attr("stop-opacity", 1);

    var lineFunction = d3.svg.line()
        .x(function (d) {
          return d.x;
        })
        .y(function (d) {
          return d.y;
        })
        .interpolate("linear");

    let strokeWidth = boldLines ? config.BOLD_LINE_WIDTH : config.LINE_WIDTH;
    this.svg.append("path")
        .attr("d", lineFunction(lineData))
        .attr("stroke", `url(#${gradient_id})`)
        .attr("stroke-width", strokeWidth)
        .attr("fill", "none");
  }

  this.drawZigZag = function (point1, point2, vStart, vEnd) {
    var lineData = [{x: point1.x, y: point1.y}];

    const SEGMENTS = 8;
    let width = 4;
    let parallelOffset = 1 / SEGMENTS;

    // Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
    let offsets = [1, -1];

    let startPosition = Util.interpolate(point1, point2, parallelOffset / 2, width);

    lineData.push({x: startPosition.x, y: startPosition.y});

    // Draw resistor "zig-zags"
    for (let n = 1; n < SEGMENTS; n++) {
      startPosition = Util.interpolate(point1, point2, n * parallelOffset + parallelOffset / 2, width * offsets[n % 2]);

      lineData.push({x: startPosition.x, y: startPosition.y});
    }

    lineData.push({x: point2.x, y: point2.y});

    this.applyGradient(lineData, point1, point2, vStart, vEnd)
  };

  this.drawCoil = function (point1, point2, vStart, vEnd, hs=6) {
    var lineData = [{x: point1.x, y: point1.y}];

    const SEGMENTS = 40;

    let ps1 = new Point(0, 0);
    let ps2 = new Point(0, 0);

    ps1.x = point1.x;
    ps1.y = point1.y;

    for (let i = 0; i < SEGMENTS; ++i) {
      var cx = (((i + 1) * 8 / SEGMENTS) % 2) - 1;
      var hsx = Math.sqrt(1 - cx * cx);

      ps2 = Util.interpolate(point1, point2, i / SEGMENTS, hsx * hs);

      lineData.push({x: ps2.x, y: ps2.y});

      ps1.x = ps2.x;
      ps1.y = ps2.y;
    }

    this.applyGradient(lineData, point1, point2, vStart, vEnd)
  };

  // TODO: Move to CircuitComponent
  this.drawLeads = function (component) {
    if ((component.point1 != null) && (component.lead1 != null)) {
      this.drawLinePt(component.point1, component.lead1, this.getVoltageColor(component.volts[0]));
    }
    if ((component.point2 != null) && (component.lead2 != null)) {
      return this.drawLinePt(component.lead2, component.point2, this.getVoltageColor(component.volts[1]));
    }
  };

  // TODO: Move to CircuitComponent
  this.drawPosts = function (component, color = config.POST_COLOR, radius = config.POST_RADIUS) {
    let post;

    for (let i = 0; i < component.numPosts(); ++i) {
      post = component.getPost(i);
      this.drawPost(post.x, post.y, color);
    }
  };

  this.drawPost = function (x0, y0, fillColor = config.POST_COLOR, strokeColor = config.POST_OUTLINE_COLOR, radius = config.POST_RADIUS) {
    let oulineWidth = config.POST_OUTLINE_SIZE;

    if (this.boldLines) {
      strokeColor = config.POST_SELECT_OUTLINE_COLOR;
      fillColor = config.POST_SELECT_COLOR;
      oulineWidth += 3;
    }

    return this.drawCircle(x0, y0, radius, oulineWidth, strokeColor, fillColor);
  };

  this.drawText = function (text, x, y, fillColor = config.TEXT_COLOR, size = config.TEXT_SIZE, strokeColor = 'rgba(255, 255, 255, 0.3)', rotation = 0) {
    return this.svg.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("font-size", 1.5 * size)
        .attr("class", "text")
        .attr("fill", fillColor)
        .text(text);
  };

  this.drawValue = function (perpindicularOffset, parallelOffset, component, text = null, text_size = config.TEXT_SIZE) {
    let x, y;

    // context.textAlign = "center";

    // context.font = "bold 7pt Courier";

    let theta = Math.atan(component.dy() / component.dx());

    // context.fillStyle = config.TEXT_COLOR;

    ({x} = component.getCenter()); //+ perpindicularOffset
    ({y} = component.getCenter()); //+ parallelOffset - stringHeight / 2.0

    // this.svg.attr("transform", "translate(" + x + "," + y + ")");

    return this.drawText(text, x + parallelOffset, y - perpindicularOffset, config.TEXT_COLOR, text_size).attr("transform", `translate(${-x},${y}) rotate(90)`)

  };

  this.getVoltageColor = function (volts) {
    let scale = Color.Gradients.voltage_default;
    let numColors = scale.length - 1;

    let value = Math.floor(((volts + fullScaleVRange) * numColors) / (2 * fullScaleVRange));

    if (value < 0) {
      value = 0;
    } else if (value >= numColors) {
      value = numColors - 1;
    }

    return scale[value];
  };

  this.drawCircle = function (x, y, radius, lineWidth = config.LINE_WIDTH, lineColor = "#000", fillColor = config.FG_COLOR) {
    return this.svg.append("circle")
        .attr("stroke-width", lineWidth / 2)
        .attr("stroke", lineColor)
        .attr("fill", fillColor)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", radius)
  };

  this.drawRect = function (x, y, width, height, {
      lineWidth = config.LINE_WIDTH,
      lineColor = config.STROKE_COLOR,
      fillColor = config.FILL_COLOR
  } = {}) {
    return this.svg.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("stroke-width", lineWidth)
        .attr("stroke", lineColor)
        .attr("fill", fillColor)
        .attr("width", width)
        .attr("height", height);
  };

  this.drawLinePt = function (pa, pb, color = config.STROKE_COLOR, lineWidth = config.LINE_WIDTH) {
    this.drawLine(pa.x, pa.y, pb.x, pb.y, color, lineWidth);
  };

  this.drawLine = function (x1, y1, x2, y2, color = config.STROKE_COLOR, lineWidth = config.LINE_WIDTH) {
    return this.svg.append("line")
        .style("stroke", color)
        .attr("stroke-width", lineWidth)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
  };

  this.drawPolygon = function (polygon, {
      stroke = config.STROKE_COLOR,
      fill = config.FILL_COLOR,
      lineWidth = config.POLY_LINE_WIDTH
  } = {}) {
    let poly = polygon.getVertices();

    return this.svg.append("polygon")
        .data([poly])
        .attr("points", function (d) {
          return d.map(function (d) {
            return [d.x, d.y].join(",");
          }).join(" ");
        })
        .attr("stroke-width", lineWidth)
        .attr("stroke", stroke)
        .attr("fill", fill);
  };

  this.testDraw = function () {
    this.drawText("SAMPLE text", 100, 10, '#0FF', 18, '#0F0');
    this.drawRect(100, 50, 200, 75, {lineWidth: 2, lineColor: '#0FF', fillColor: "#F00"});
    this.drawCircle(100, 50, 25, 3, '#0F0');
    this.drawLine(100, 50, 200, 75, '#0F0', 2);

    let polygon = new Polygon([[100, 50], [200, 75], [100, 100], [50, 75]]);
    this.drawPolygon(polygon, {stroke: '#0F0', fill: '#00F', lineWidth: 2});

    var poly = [{"x": 0.0, "y": 25.0},
      {"x": 8.5, "y": 23.4},
      {"x": 13.0, "y": 21.0},
      {"x": 19.0, "y": 15.5}];

    this.svg.append("polyline")
        .data([poly])
        .attr("points", function (d) {
          return d.map(function (d) {
            return [d.x, d.y].join(",");
          }).join(" ");
        })
        .attr("stroke-width", "2px")
        .attr("stroke", "black");
  };

  // this.testDraw();
};
