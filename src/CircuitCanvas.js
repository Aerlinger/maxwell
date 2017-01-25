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

    } else {
      this.context = this.Canvas.getContext("2d");
    }

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

    this.renderPerformance();
  }

  renderPerformance() {
    this.performanceMeter = new TimeSeries();

    var chart = new SmoothieChart({
      millisPerPixel: 35,
      grid: {fillStyle: 'transparent', strokeStyle: 'transparent'},
      labels: {fillStyle: '#000000', precision: 0}
    });

    chart.addTimeSeries(this.performanceMeter, {strokeStyle: 'rgba(255, 0, 200, 1)', lineWidth: 1});
    chart.streamTo(document.getElementById("performance_sparkline"), 500);
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
        this.context.fillText(arr[idx], 500, (idx * 10) + 15);
      }
    }
  }

  fillText(text, x, y, fillColor = Settings.TEXT_COLOR, size = Settings.TEXT_SIZE, strokeColor = 'rgba(255, 255, 255, 0.3)') {
    this.context.save();

    let lineWidth = this.context.lineWidth;
    let origFillStyle = this.context.fillStyle;
    let origFillColor = this.context.fillColor;
    let font = this.context.font;

    this.context.fillStyle = fillColor;
    this.context.strokeStyle = strokeColor;
    this.context.font = `${Settings.TEXT_STYLE} ${size}pt ${Settings.FONT}`;
    this.context.fillText(text, x, y);

    this.context.lineWidth = 0;
    this.context.strokeText(text, x, y);

    let textMetrics = this.context.measureText(text);

    this.context.fillStyle = origFillStyle;
    this.context.fillColor = origFillColor;
    this.context.lineWidth = lineWidth;
    this.context.font = font;

    this.context.restore();

    return textMetrics;
  }

  fillCircle(x, y, radius, lineWidth, fillColor, lineColor) {
    if (lineWidth == null) {
      lineWidth = Settings.LINE_WIDTH;
    }
    if (fillColor == null) {
      fillColor = '#FFFF00';
    }
    if (lineColor == null) {
      lineColor = null;
    }
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
    if (lineWidth == null) {
      lineWidth = Settings.LINE_WIDTH;
    }
    if (lineColor == null) {
      lineColor = "#000000";
    }
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
    this.context.strokeStyle = lineColor;
    this.context.lineJoin = 'miter';
    this.context.lineWidth = 0;
    this.context.strokeRect(x, y, width, height);
    this.context.stroke();
  }

  drawLinePt(pa, pb, color, lineWidth) {
    if (color == null) {
      color = Settings.STROKE_COLOR;
    }
    return this.drawLine(pa.x, pa.y, pb.x, pb.y, color, lineWidth);
  }

  beginPath() {
    this.pathMode = true;
    this.context.beginPath();
  }

  closePath() {
    this.pathMode = false;
    this.context.closePath();
  }

  drawLine(x, y, x2, y2, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) {

    let origLineWidth = this.context.lineWidth;

    if (!this.pathMode)
      this.context.beginPath();

    if (this.boldLines) {
      this.context.lineWidth = Settings.BOLD_LINE_WIDTH;
      this.context.strokeStyle = Settings.SELECT_COLOR;
      if (!this.pathMode)
        this.context.moveTo(x, y);
      this.context.lineTo(x2, y2);
      this.context.stroke();

    } else {
      this.context.strokeStyle = color;
      this.context.lineWidth = lineWidth;
      if (!this.pathMode)
        this.context.moveTo(x, y);
      this.context.lineTo(x2, y2);
      this.context.stroke();
    }

    if (!this.pathMode)
      this.context.closePath();

    this.context.lineWidth = origLineWidth;
  }

  drawThickPolygon(xlist, ylist, color, fill) {
    if (color == null) {
      color = Settings.STROKE_COLOR;
    }
    if (fill == null) {
      fill = Settings.FILL_COLOR;
    }
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

    return this.context.restore();
  }


  getVoltageColor(volts) {
    // TODO: Define voltage range
    let fullScaleVRange = this.Circuit.Params.voltageRange;

    let RedGreen =
        ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
          "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
          "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747",
          "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"];

    let scale =
        ["#B81B00", "#B21F00", "#AC2301", "#A72801", "#A12C02", "#9C3002", "#963503", "#913903",
          "#8B3E04", "#854205", "#804605", "#7A4B06", "#754F06", "#6F5307", "#6A5807", "#645C08",
          "#5F6109", "#596509", "#53690A", "#4E6E0A", "#48720B", "#43760B", "#3D7B0C", "#387F0C",
          "#32840D", "#2C880E", "#278C0E", "#21910F", "#1C950F", "#169910", "#119E10", "#0BA211", "#06A712"];

    let blueScale =
        ["#EB1416", "#E91330", "#E7134A", "#E51363", "#E3137C", "#E11394", "#E013AC", "#DE13C3",
          "#DC13DA", "#C312DA", "#AA12D8", "#9012D7", "#7712D5", "#5F12D3", "#4612D1", "#2F12CF",
          "#1712CE", "#1123CC", "#1139CA", "#114FC8", "#1164C6", "#1179C4", "#118EC3", "#11A2C1",
          "#11B6BF", "#10BDB1", "#10BB9B", "#10BA84", "#10B86F", "#10B659", "#10B444", "#10B230", "#10B11C"];

    scale = Color.Gradients.voltage_default;

    let numColors = scale.length - 1;

    let value = Math.floor(((volts + fullScaleVRange) * numColors) / (2 * fullScaleVRange));
    if (value < 0) {
      value = 0;
    } else if (value >= numColors) {
      value = numColors - 1;
    }

    return scale[value];
  }


  drawThickPolygonP(polygon, color, fill) {
    if (color == null) {
      color = Settings.STROKE_COLOR;
    }
    if (fill == null) {
      fill = Settings.FILL_COLOR;
    }
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
    return this.context.restore();
  }

  drawCoil(point1, point2, vStart, vEnd, hs) {
    let color, cx, hsx, voltageLevel;
    if (hs == null) {
      hs = null;
    }
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

  draw() {
    if (this.context) {
      if (this.context.clear) {
        this.context.clear();
      }
      // this.drawGrid();

      this.context.save();
      this.context.translate(this.xMargin, this.yMargin);

      this.fillText("Time elapsed: " + Util.getUnitText(this.Circuit.time, "s"), 10, 5, Settings.TEXT_COLOR, 1.2*Settings.TEXT_SIZE);
      this.fillText("Frame Time: " + Math.floor(this.Circuit.lastFrameTime) + "ms", 385, 15, Settings.TEXT_COLOR, 1.2*Settings.TEXT_SIZE);

      this.performanceMeter.append(new Date().getTime(), this.Circuit.lastFrameTime);
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
      this.context.restore()
    }
  }

  drawScopes() {
    if (this.context) {
      for (let scopeElm of this.Circuit.getScopes()) {
        let scopeCanvas = scopeElm.getCanvas();

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

  drawComponents() {
    if (this.context) {
      for (var component of Array.from(this.Circuit.getElements())) {
        this.drawComponent(component);
      }

      if (CircuitComponent.DEBUG) {
        let voltage, x, y;
        let nodeIdx = 0;
        return Array.from(this.Circuit.getNodes()).map((node) =>
            (({
              x,
              y
            } = node),
                voltage = Util.singleFloat(this.Circuit.getVoltageForNode(nodeIdx)),

                this.context.fillText(`${nodeIdx}:${voltage}`, x + 10, y - 10, "#FF8C00"),
                nodeIdx++));
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

    let newPos = component.curcount;

    return (() => {
      let result = [];
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

        result.push(newPos += ds);
      }
      return result;
    })();
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

  drawPost(x0, y0, fillColor, strokeColor) {
    if (fillColor == null) {
      fillColor = Settings.POST_COLOR;
    }
    if (strokeColor == null) {
      strokeColor = Settings.POST_COLOR;
    }
    return this.fillCircle(x0, y0, Settings.POST_RADIUS, 1, fillColor, strokeColor);
  }

  drawBoldLines() {
    return this.boldLines = true;
  }

  drawDefaultLines() {
    return this.boldLines = false;
  }
}

module.exports = CircuitCanvas;
