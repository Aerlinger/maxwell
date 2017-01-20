let Observer = require('./util/observer');
let Util = require('./util/util');
let Settings = require('./settings/settings');

let CircuitComponent = require('./circuit/circuitComponent');

class CircuitCanvas extends Observer {

  constructor(Circuit, circuitUI) {
    super();

    this.circuitUI = circuitUI;
    this.Circuit = Circuit;
    this.Canvas = this.circuitUI.Canvas;

    // TODO: Extract to param
    this.xMargin = 260;
    this.yMargin = 56;

    this.draw = this.draw.bind(this);
    this.drawDots = this.drawDots.bind(this);

    //this.context = this.Canvas.getContext("2d");

    this.context = Sketch.augment(this.Canvas.getContext("2d"), {
      autoclear: false,
      draw: this.draw,
      // mousemove: this.mousemove,
      // mousedown: this.mousedown,
      // mouseup: this.mouseup
      //fullscreen: false,
      //width: this.width,
      //height: this.height
    });

    //this.context.lineJoin = 'miter';
  }

  drawInfoText() {
    if (this.highlightedComponent != null) {
      let arr = [];
      this.highlightedComponent.getInfo(arr);

      return __range__(0, arr.length, false).map((idx) =>
          this.context.fillText(arr[idx], 500, (idx * 10) + 15));
    }
  }

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

  fillText(text, x, y, fillColor = Settings.TEXT_COLOR, size=8) {
    this.context.save();

    let origFillStyle = this.context.fillStyle;
    let origFillColor = this.context.fillColor;
    let font = this.context.font;

    // this.context.fillStyle = fillStyle;
    this.context.fillColor = fillColor;
    this.context.font = `${size}pt Courier`;
    this.context.fillText(text, x, y);

    let textMetrics = this.context.measureText(text);

    this.context.fillStyle = origFillStyle;
    this.context.fillColor = origFillColor;
    this.context.font = font;

    this.context.restore();

    return textMetrics;
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

  drawLinePt(pa, pb, color, lineWidth) {
    if (color == null) { color = Settings.STROKE_COLOR; }
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

  drawLine(x, y, x2, y2, color, lineWidth) {
    if (color == null) { color = Settings.STROKE_COLOR; }
    if (lineWidth == null) { lineWidth = Settings.LINE_WIDTH; }

    let origLineWidth = this.context.lineWidth;
    this.context.save();

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

    return this.context.restore();

    this.context.lineWidth = origLineWidth;
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

  draw() {
    if (this.context) {
      this.context.clear();
      this.context.save();
      this.context.translate(this.xMargin, this.yMargin)
    }

    if ((this.circuitUI.snapX != null) && (this.circuitUI.snapY != null)) {
      this.drawCircle(this.circuitUI.snapX, this.circuitUI.snapY, 1, "#F00");
      this.fillText(`${this.circuitUI.snapX}, ${this.circuitUI.snapY}`, this.circuitUI.snapX, this.circuitUI.snapY);
    }

    this.drawInfoText();
    __guard__(this.circuitUI.marquee, x => x.draw(this));

    // UPDATE FRAME ----------------------------------------------------------------
    this.Circuit.updateCircuit();

    if (this.circuitUI.onUpdateComplete) {
      this.circuitUI.onUpdateComplete();
    }
    // -----------------------------------------------------------------------------

    this.drawComponents();

    if (this.context) {
      if (this.circuitUI.placeComponent) {
        this.context.fillText(`Placing ${this.circuitUI.placeComponent.constructor.name}`, this.circuitUI.snapX, this.circuitUI.snapY);

        if (this.placeComponent.x1() && this.placeComponent.x2()) {
          this.drawComponent(this.placeComponent);
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

  drawComponents() {
    if (this.context) {
      for (var component of Array.from(this.Circuit.getElements())) {
        this.drawComponent(component);
      }

      if (CircuitComponent.DEBUG) {
        let voltage, x, y;
        let nodeIdx = 0;
        return Array.from(this.Circuit.getNodes()).map((node) =>
            (({ x,
              y } = node),
                voltage = Util.singleFloat(this.Circuit.getVoltageForNode(nodeIdx)),

                this.context.fillText(`${nodeIdx}:${voltage}`, x+10, y-10, "#FF8C00"),
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

  drawValue(perpindicularOffset, parallelOffset, component, text = null, rotation = 0) {
    let x, y;

    this.context.save();
    this.context.textAlign = "center";

    this.context.font = "bold 7pt Courier";

    let stringWidth = this.context.measureText(text).width;
    let stringHeight = this.context.measureText(text).actualBoundingBoxAscent || 0;

    this.context.fillStyle = Settings.TEXT_COLOR;
    if (component.isVertical()) {

      ({ x } = component.getCenter()); //+ perpindicularOffset
      ({ y } = component.getCenter()); //+ parallelOffset - stringHeight / 2.0

      this.context.translate(x, y);
      this.context.rotate(Math.PI/2);
      this.fillText(text, parallelOffset, -perpindicularOffset);
    } else {
      x = component.getCenter().x + parallelOffset;
      y = component.getCenter().y + perpindicularOffset;

      this.fillText(text, x, y, Settings.TEXT_COLOR);
    }

    return this.context.restore();
  }

  // TODO: Move to CircuitComponent
  drawDots(ptA, ptB, component) {
    if (__guard__(this.Circuit, x => x.isStopped())) { return; }

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
      this.drawLinePt(component.point1, component.lead1, Util.getVoltageColor(component.volts[0]));
    }
    if ((component.point2 != null) && (component.lead2 != null)) {
      return this.drawLinePt(component.lead2, component.point2, Util.getVoltageColor(component.volts[1]));
    }
  }

  // TODO: Move to CircuitComponent
  drawPosts(component, color) {
    let post;
    if (color == null) { color = Settings.POST_COLOR; }

    return __range__(0, component.getPostCount(), false).map((i) =>
        (post = component.getPost(i), this.drawPost(post.x, post.y, color, color))
    );
  }

  drawPost(x0, y0, fillColor, strokeColor) {
    if (fillColor == null) { fillColor = Settings.POST_COLOR; }
    if (strokeColor == null) { strokeColor = Settings.POST_COLOR; }
    return this.fillCircle(x0, y0, Settings.POST_RADIUS, 1, fillColor, strokeColor);
  }

  drawBoldLines() {
    return this.boldLines = true;
  }

  drawDefaultLines() {
    return this.boldLines = false;
  }
}

// CircuitCanvas.initClass();

module.exports = CircuitCanvas;

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

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
