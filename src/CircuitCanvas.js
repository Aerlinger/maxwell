let Observer = require('./util/observer');
let Util = require('./util/util');
let Point = require('./geom/point.js');
let Settings = require('./settings/settings.js');
let Color = require('./util/color.js');

let CircuitComponent = require('./circuit/circuitComponent');
let environment = require('./environment.js');

class CircuitCanvas extends Observer {

  constructor(Circuit, circuitUI) {
    super();

    this.circuitUI = circuitUI;
    this.Circuit = Circuit;
    this.Canvas = this.circuitUI.Canvas;

    // TODO: Extract to param
    this.xMargin = circuitUI.xMargin;
    this.yMargin = circuitUI.yMargin;

    this.draw = this.draw.bind(this);
    this.drawDots = this.drawDots.bind(this);

    if (environment.isBrowser) {
      this.context = Sketch.augment(this.Canvas.getContext("2d", {alpha: false}), {
        autoclear: false,
        draw: this.draw
        //mousemove: this.mousemove,
        //mousedown: this.mousedown,
        //mouseup: this.mouseup
        //fullscreen: false,
        //width: this.width,
        //height: this.height
      });

      this.setupScopes();
      this.renderPerformance();

    } else {
      this.context = this.Canvas.getContext("2d");
    }
  }

  setupScopes(){
    for (let scopeElm of this.Circuit.getScopes()) {

      let scElm = this.renderScopeCanvas(scopeElm.circuitElm.getName());
      $(scElm).draggable();
      $(scElm).resizable();

      this.Canvas.parentNode.append(scElm);

      let sc = new Maxwell.ScopeCanvas(this, scElm);
      scopeElm.setCanvas(sc);

      $(scElm).on("resize", function (evt) {
        let innerElm = $(scElm).find(".plot-context");

        sc.resize(innerElm.width(), innerElm.height() - 5);
      });

      // this.scopeCanvases.push(sc);
    }
  }

  renderPerformance() {
    this.performanceMeter = new TimeSeries();

    let chart = new SmoothieChart({
      millisPerPixel: 35,
      grid: {fillStyle: 'transparent', strokeStyle: 'transparent'},
      labels: {fillStyle: '#000000', precision: 0}
    });

    chart.addTimeSeries(this.performanceMeter, {strokeStyle: 'rgba(255, 0, 200, 1)', lineWidth: 1});
    chart.streamTo(document.getElementById("performance_sparkline"), 500);
  }

  draw() {
    if (this.context) {
      if (this.context.clear) {
        this.context.clear();
      }
      // this.drawGrid();

      this.context.save();
      this.context.translate(this.xMargin, this.yMargin);

      this.fillText("Time elapsed: " + Util.getUnitText(this.Circuit.time, "s"), 10, 5, Settings.TEXT_COLOR, 1.2*Settings.TEXT_SIZE);
      this.fillText("Frame Time: " + Math.floor(this.Circuit.lastFrameTime) + "ms", 785, 15, Settings.TEXT_COLOR, 1.2*Settings.TEXT_SIZE);

      if (this.performanceMeter) {
        this.performanceMeter.append(new Date().getTime(), this.Circuit.lastFrameTime);
      }
    }

    if ((this.circuitUI.snapX != null) && (this.circuitUI.snapY != null)) {
      this.drawCircle(this.circuitUI.snapX, this.circuitUI.snapY, 1, "#F00");
      this.fillText(`${this.circuitUI.snapX}, ${this.circuitUI.snapY}`, this.circuitUI.snapX + 10, this.circuitUI.snapY - 10);
    }

    this.drawInfoText();

    if (this.circuitUI.marquee) {
      this.circuitUI.marquee.draw(this)
    }

    // UPDATE FRAME ----------------------------------------------------------------
    this.Circuit.updateCircuit();

    if (this.circuitUI.onUpdateComplete) {
      this.circuitUI.onUpdateComplete();
    }
    // -----------------------------------------------------------------------------

    this.drawScopes();
    this.drawComponents();

    if (this.context) {
      if (this.circuitUI.placeComponent) {
        this.context.fillText(`Placing ${this.circuitUI.placeComponent.constructor.name}`, this.circuitUI.snapX + 10, this.circuitUI.snapY + 10);

        if (this.circuitUI.placeY && this.circuitUI.placeX && this.circuitUI.placeComponent.x2() && this.circuitUI.placeComponent.y2()) {
          this.drawComponent(this.circuitUI.placeComponent);
        }
      }

      if (this.circuitUI.selectedNode) {
        this.drawCircle(this.circuitUI.selectedNode.x, this.circuitUI.selectedNode.y, Settings.POST_RADIUS + 3, 3, Settings.HIGHLIGHT_COLOR);
      }

      if (this.circuitUI.highlightedComponent) {
        this.drawCircle(this.circuitUI.highlightedComponent.x1(), this.circuitUI.highlightedComponent.y1(), Settings.POST_RADIUS + 2, 2, Settings.HIGHLIGHT_COLOR);
        this.drawCircle(this.circuitUI.highlightedComponent.x2(), this.circuitUI.highlightedComponent.y2(), Settings.POST_RADIUS + 2, 2, Settings.HIGHLIGHT_COLOR);
      }

      // this.context.clear();
    }

    // for (let nodeIdx=0; nodeIdx<this.Circuit.numNodes(); ++nodeIdx) {
    // let node = this.Circuit.getNode(nodeIdx);
    // this.fillText(`${nodeIdx} ${node.x},${node.y}`, node.x + 5, node.y - 5);
    // }

    if (this.context) {
      if (this.Circuit && this.Circuit.debugModeEnabled()) {
        //this.drawDebugInfo();
        this.drawDebugOverlay();
      }

      this.context.restore()
    }
  }

  renderScopeCanvas(elementName) {
    let scopeWrapper = document.createElement("div");
    scopeWrapper.className = "plot-pane";

    let leftAxis = document.createElement("div");
    leftAxis.className = "left-axis";

    let scopeCanvas = document.createElement("div");
    scopeCanvas.className = "plot-context";

    if (elementName) {
      let label = document.createElement("div");
      label.className = "plot-label";
      label.innerText = elementName;

      scopeWrapper.append(label);
    }

    scopeWrapper.append(leftAxis);
    scopeWrapper.append(scopeCanvas);

    return scopeWrapper;
  }

  drawInfoText() {
    if (this.circuitUI.highlightedComponent != null) {
      let arr = [];
      this.circuitUI.highlightedComponent.getInfo(arr);

      for (let idx = 0; idx < arr.length; ++idx) {
        this.fillText(arr[idx], 600, (idx * 10) + 5, "#1b4e24");
      }
    }
  }

  beginPath() {
    this.pathMode = true;
    this.context.beginPath();
  }

  closePath() {
    this.pathMode = false;
    this.context.closePath();
  }


  getVoltageColor(volts) {
    let fullScaleVRange = this.Circuit.Params.voltageRange;

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

  drawCoil(point1, point2, vStart, vEnd, hs) {
    let color, cx, hsx, voltageLevel;
    hs = hs || 8;

    let segments = 40;

    let ps1 = new Point(0, 0);
    let ps2 = new Point(0, 0);

    ps1.x = point1.x;
    ps1.y = point1.y;

    for (let i = 0; i < segments; ++i) {
      cx = (((i + 1) * 8 / segments) % 2) - 1;
      hsx = Math.sqrt(1 - cx * cx);
      ps2 = Util.interpolate(point1, point2, i / segments, hsx * hs);
      voltageLevel = vStart + (vEnd - vStart) * i / segments;
      color = this.getVoltageColor(voltageLevel);

      this.drawLinePt(ps1, ps2, color);

      ps1.x = ps2.x;
      ps1.y = ps2.y;
    }
  }

  drawScopes() {
    if (this.context) {
      for (let scopeElm of this.Circuit.getScopes()) {
        let scopeCanvas = scopeElm.getCanvas();

        if (scopeCanvas) {

          var center = scopeElm.circuitElm.getCenter();

          let strokeStyle = this.context.strokeStyle;
          let lineDash = this.context.getLineDash();

          this.context.setLineDash([5, 5]);
          this.context.strokeStyle = "#FFA500";
          this.context.lineWidth = 1;
          this.context.moveTo(center.x, center.y);
          this.context.lineTo(scopeCanvas.x(), scopeCanvas.y() + scopeCanvas.height() / 2);

          this.context.stroke();

          this.context.strokeStyle = strokeStyle;
          this.context.setLineDash(lineDash);
        }
      }
    }
  }

  drawComponents() {
    if (this.context) {
      for (var component of Array.from(this.Circuit.getElements()))
        this.drawComponent(component);

      if (this.Circuit && this.Circuit.debugModeEnabled()) {
        for (let nodeIdx = 0; nodeIdx < this.Circuit.numNodes(); ++nodeIdx) {
          let voltage = Util.singleFloat(this.Circuit.getVoltageForNode(nodeIdx));
          let node = this.Circuit.getNode(nodeIdx);

          this.context.fillText(`${nodeIdx}:${voltage}`, node.x + 10, node.y - 10, "#FF8C00");
        }
      }
    }
  }

  drawComponent(component) {
    if (component && Array.from(this.circuitUI.selectedComponents).includes(component)) {
      this.drawBoldLines();
      for (let i = 0; i < component.getPostCount(); ++i) {
        let post = component.getPost(i);
        this.drawCircle(post.x, post.y, Settings.POST_RADIUS + 2, 2, Settings.SELECT_COLOR);
      }
    } else {
      this.drawDefaultLines();
    }

    // Main entry point to draw component
    component.draw(this);
  }

  // TODO: Move to CircuitComponent
  drawDots(ptA, ptB, component) {
    /**
     * Previous behavior was for current to not display when paused
     if (this.Circuit && this.Circuit.isStopped) {
      return
    }
     */

    let ds = Settings.CURRENT_SEGMENT_LENGTH;

    let dx = ptB.x - ptA.x;
    let dy = ptB.y - ptA.y;
    let dn = Math.sqrt((dx * dx) + (dy * dy));

    let newPos;
    if (typeof(component) == "number") {
      newPos = component
    } else {
      if (!component)
        return;
      newPos = component.curcount;
    }

    while (newPos < dn) {
      let xOffset = ptA.x + ((newPos * dx) / dn);
      let yOffset = ptA.y + ((newPos * dy) / dn);

      if (Settings.CURRENT_DISPLAY_TYPE === Settings.CURENT_TYPE_DOTS) {
        this.fillCircle(xOffset, yOffset, Settings.CURRENT_RADIUS, 1, Settings.CURRENT_COLOR);
      } else {
        let xOffset0 = xOffset - ((3 * dx) / dn);
        let yOffset0 = yOffset - ((3 * dy) / dn);

        let xOffset1 = xOffset + ((3 * dx) / dn);
        let yOffset1 = yOffset + ((3 * dy) / dn);

        this.context.save();
        this.context.strokeStyle = Settings.CURRENT_COLOR;
        this.context.lineWidth = Settings.CURRENT_RADIUS;
        this.context.beginPath();
        this.context.moveTo(xOffset0, yOffset0);
        this.context.lineTo(xOffset1, yOffset1);
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
      }

      newPos += ds
    }
  }

  drawDebugOverlay() {
    if (!this.Circuit || !this.context) {
      return;
    }

    // Nodes
    let nodeIdx = 0;
    for (let node of this.Circuit.getNodes()) {
      this.context.beginPath();
      this.context.arc(node.x, node.y, 5, 0, 2 * Math.PI, true);
      this.context.strokeStyle = "#003aff";
      this.context.stroke();
      this.context.fillText(nodeIdx, node.x + 5, node.y + 20);

      let yOffset = 30;
      for (let link of node.links) {
        //this.context.fillText(link.elm.getName(), node.x + 5, node.y + yOffset);

        yOffset += 10;
      }

      nodeIdx++;
    }

    // Nodes
  }

  drawDebugInfo(x = 1100, y = 200) {
    if (!this.Circuit || !this.context) {
      return;
    }

    let str = "";

    // Name
    str += `Name: ${this.Circuit.name}\n`;

    // Linear
    str += `Linear: ${!this.Circuit.Solver.circuitNonLinear}\n`;

    // Linear
    str += `VS Count: ${this.Circuit.voltageSourceCount}\n`;

    // Param
    str += `Params:\n ${this.Circuit.Params}\n`;

    // Iterations
    str += `Frame #: ${this.Circuit.getIterationCount()}\n`;

    // Elements
    str += `Elements: (${this.Circuit.getElements().length})\n `;
    for (let element of this.Circuit.getElements()) {
      str += "  " + element + "\n";
    }

    str += `Nodes: (${this.Circuit.numNodes()})\n`;
    for (let node of this.Circuit.getNodes()) {
      str += "  " + node + "\n";
    }

    // RowInfo
    str += `RowInfo: (${this.Circuit.getRowInfo().length})\n`;
    for (let rowInfo of this.Circuit.getRowInfo()) {
      str += "  " + rowInfo + "\n";
    }

    str += "Circuit Matrix:\n";
    str += this.Circuit.Solver.dumpFrame() + "\n";

    str += "Orig Matrix:\n";
    str += this.Circuit.Solver.dumpOrigFrame() + "\n";

    // CircuitRightSide
    // CircuitLeftSide

    let lineHeight = 10;
    let nLines = 0;
    for (let line of str.split("\n")) {
      this.context.fillText(line, x, y + nLines * lineHeight);

      nLines++;
    }
  }

  // TODO: Move to CircuitComponent
  drawLeads(component) {
    if ((component.point1 != null) && (component.lead1 != null)) {
      this.drawLinePt(component.point1, component.lead1, this.getVoltageColor(component.volts[0]));
    }
    if ((component.point2 != null) && (component.lead2 != null)) {
      return this.drawLinePt(component.lead2, component.point2, this.getVoltageColor(component.volts[1]));
    }
  }

  // TODO: Move to CircuitComponent
  drawPosts(component, color = Settings.POST_COLOR) {
    let post;

    for (let i = 0; i < component.getPostCount(); ++i) {
      post = component.getPost(i);
      this.drawPost(post.x, post.y, color, color);
    }
  }

  drawPost(x0, y0, fillColor = Settings.POST_COLOR, strokeColor = Settings.POST_COLOR) {
    this.fillCircle(x0, y0, Settings.POST_RADIUS, 1, fillColor, strokeColor);
  }

  drawBoldLines() {
    return this.boldLines = true;
  }

  drawDefaultLines() {
    return this.boldLines = false;
  }

  // Draw Primitives

  fillText(text, x, y, fillColor = Settings.TEXT_COLOR, size = Settings.TEXT_SIZE, strokeColor = 'rgba(255, 255, 255, 0.3)') {
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

  fillCircle(x, y, radius, lineWidth = Settings.LINE_WIDTH, fillColor = '#FFFF00', lineColor = null) {
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

    this.context.restore();
  }

  drawCircle(x, y, radius, lineWidth = Settings.LINE_WIDTH, lineColor = "#000000") {
    this.context.save();

    this.context.strokeStyle = lineColor;
    this.context.lineWidth = lineWidth;

    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
    this.context.stroke();
    this.context.closePath();

    this.context.restore();
  }

  drawRect(x, y, width, height, lineWidth = Settings.LINE_WIDTH, lineColor = Settings.STROKE_COLOR) {
    this.context.save();

    this.context.strokeStyle = lineColor;
    this.context.lineJoin = 'miter';
    this.context.lineWidth = 0;
    this.context.strokeRect(x, y, width, height);
    this.context.stroke();

    this.context.restore();
  }

  drawLinePt(pa, pb, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) {
    this.drawLine(pa.x, pa.y, pb.x, pb.y, color, lineWidth);
  }

  drawValue(perpindicularOffset, parallelOffset, component, text = null, text_size = Settings.TEXT_SIZE) {
    let x, y;

    this.context.save();
    this.context.textAlign = "center";

    this.context.font = "bold 7pt Courier";

    let stringWidth = this.context.measureText(text).width;
    let stringHeight = this.context.measureText(text).actualBoundingBoxAscent || 0;

    this.context.fillStyle = Settings.TEXT_COLOR;
    if (component.isVertical()) {

      ({x} = component.getCenter()); //+ perpindicularOffset
      ({y} = component.getCenter()); //+ parallelOffset - stringHeight / 2.0

      this.context.translate(x, y);
      this.context.rotate(Math.PI / 2);
      this.fillText(text, parallelOffset, -perpindicularOffset, Settings.TEXT_COLOR, text_size);
    } else {
      x = component.getCenter().x + parallelOffset;
      y = component.getCenter().y + perpindicularOffset;

      this.fillText(text, x, y, Settings.TEXT_COLOR, text_size);
    }

    this.context.restore();
  }

  drawLine(x, y, x2, y2, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) {
    this.context.save();

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
      this.context.moveTo(x, y);
    this.context.lineTo(x2, y2);
    this.context.stroke();

    if (!this.pathMode)
      this.context.closePath();

    this.context.restore();
  }

  drawThickPolygon(xlist, ylist, color = Settings.STROKE_COLOR, fill = Settings.FILL_COLOR) {
    this.context.save();

    this.context.fillStyle = fill;
    this.context.strokeStyle = color;
    this.context.beginPath();

    this.context.moveTo(xlist[0], ylist[0]);
    for (let i = 0; i < xlist.length; ++i) {
      this.context.lineTo(xlist[i], ylist[i]);
    }

    this.context.closePath();
    this.context.stroke();
    if (color) {
      this.context.fill();
    }

    this.context.restore();
  }

  drawThickPolygonP(polygon, color = Settings.STROKE_COLOR, fill = Settings.FILL_COLOR) {
    let numVertices = polygon.numPoints();

    this.context.save();

    this.context.fillStyle = fill;
    this.context.strokeStyle = color;
    this.context.beginPath();

    this.context.moveTo(polygon.getX(0), polygon.getY(0));
    for (let i = 0; i < numVertices; ++i) {
      this.context.lineTo(polygon.getX(i), polygon.getY(i));
    }

    this.context.closePath();
    this.context.fill();
    this.context.stroke();

    this.context.restore();
  }

}

module.exports = CircuitCanvas;
