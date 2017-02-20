let Observer = require('../../util/Observer');
let Util = require('../../util/Util');
let Point = require('../../geom/Point.js');
let Settings = require('../../Settings.js');
let Color = require('../../util/Color.js');

let CircuitComponent = require('../../components/CircuitComponent');
let environment = require('../../Environment.js');
let ScopeCanvas = require('../scopes/ScopeCanvas');

let d3 = require("d3");

class SvgRenderer extends Observer {

  constructor(Circuit, circuitUI) {
    super();

    this.circuitUI = circuitUI;
    this.Circuit = Circuit;
    this.Canvas = this.circuitUI.Canvas;

    // TODO: Extract to param
    this.xMargin = circuitUI.xMargin;
    this.yMargin = circuitUI.yMargin;

    this.lineShift = 0;

    this.drawDots = this.drawDots.bind(this);

    this.svg = d3.select("body").append("svg")
        .attr("width", this.Canvas.width + this.xMargin)
        .attr("height", this.Canvas.height + this.yMargin)
        .append("g")
        .attr("transform", "translate(" + this.xMargin + "," + this.yMargin + ")")


    // this.svg = svg_root.append("g").attr(`transform(${this.xMargin}, ${this.yMargin})`);


    // this.rafDraw();

    this.draw()
  }

  rafDraw() {
    window.requestAnimationFrame(this.rafDraw.bind(this));

    // Drawing code goes here
    // this.draw()

    this.draw()
  }

  testDraw() {

    this.svg.append("circle")
        .style("stroke-width", 2)
        .style("stroke", "black")
        .style("fill", "red")
        .attr("cx", 600)
        .attr("cy", 75)
        .attr("r", 50)

    /*
     this.svg.append("polyline")
     .attr("points", [[5,30] [15,10] [25,30]])
     .attr("stroke-width", "2px")
     .attr("stroke", "black");
     */

    this.svg.append("text")
        .attr("x", "50px")
        .attr("y", "50px")
        .attr("class", "text")
        .text("This is a sample text.");

    this.svg.append("rect")
        .attr("x", "10px")
        .attr("y", "300px")
        .attr("width", "50px")
        .attr("height", "100px");

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
  }

  setupScopes(){
    for (let scopeElm of this.Circuit.getScopes()) {

      let scElm = this.renderScopeCanvas(scopeElm.circuitElm.getName());
      $(scElm).draggable();
      $(scElm).resizable();

      this.Canvas.parentNode.append(scElm);

      let sc = new ScopeCanvas(this, scElm);
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
    if (this.svg) {


      /*
       if (this.context.clear) {
       this.context.clear();
       }

       // this.drawGrid();

       this.context.save();
       this.context.translate(this.xMargin, this.yMargin);
       */

      this.fillText("Time elapsed: " + Util.getUnitText(this.Circuit.time, "s"), 10, 5, Settings.TEXT_COLOR, 1.2*Settings.TEXT_SIZE);
      this.fillText("Frame Time: " + Math.floor(this.Circuit.lastFrameTime) + "ms", 785, 15, Settings.TEXT_COLOR, 1.2*Settings.TEXT_SIZE);

      if (this.performanceMeter) {
        this.performanceMeter.append(new Date().getTime(), this.Circuit.lastFrameTime);
      }
    }

    /*
     if ((this.circuitUI.snapX != null) && (this.circuitUI.snapY != null)) {
     this.drawCircle(this.circuitUI.snapX, this.circuitUI.snapY, 1, "#F00");
     this.drawText(`${this.circuitUI.snapX}, ${this.circuitUI.snapY}`, this.circuitUI.snapX + 10, this.circuitUI.snapY - 10);
     }
     */

    // this.drawInfoText();

    /*
     if (this.circuitUI.marquee) {
     this.circuitUI.marquee.draw(this)
     }
     */

    // UPDATE FRAME ----------------------------------------------------------------
    this.Circuit.updateCircuit();

    if (this.circuitUI.onUpdateComplete) {
      this.circuitUI.onUpdateComplete();
    }
    // -----------------------------------------------------------------------------

    // this.drawScopes();
    this.drawComponents();


    /*
     if (this.circuitUI.highlightedNode)
     this.drawCircle(this.circuitUI.highlightedNode.x + 0.5, this.circuitUI.highlightedNode.y + 0.5, 7, 3, "#0F0");

     if (this.circuitUI.selectedNode)
     this.drawRect(this.circuitUI.selectedNode.x - 10 + 0.5, this.circuitUI.selectedNode.y - 10 + 0.5, 21, 21, 1, "#0FF");

     if (this.circuitUI.placeComponent) {
     this.context.drawText(`Placing ${this.circuitUI.placeComponent.constructor.name}`, this.circuitUI.snapX + 10, this.circuitUI.snapY + 10);

     if (this.circuitUI.placeY && this.circuitUI.placeX && this.circuitUI.placeComponent.x2() && this.circuitUI.placeComponent.y2()) {
     this.drawComponent(this.circuitUI.placeComponent);
     }
     }


     if (this.circuitUI.highlightedComponent) {
     this.circuitUI.highlightedComponent.draw(this);

     this.context.save();
     this.context.fillStyle = Settings.POST_COLOR;

     for (let i=0; i<this.circuitUI.highlightedComponent.numPosts(); ++i) {
     let post = this.circuitUI.highlightedComponent.getPost(i);

     this.context.fillRect(post.x - Settings.POST_RADIUS - 1, post.y - Settings.POST_RADIUS - 1, 2 * Settings.POST_RADIUS + 2, 2 * Settings.POST_RADIUS + 2);
     }

     if (this.circuitUI.highlightedComponent.x2())
     this.context.fillRect(this.circuitUI.highlightedComponent.x2()-2*Settings.POST_RADIUS, this.circuitUI.highlightedComponent.y2()-2*Settings.POST_RADIUS, 4*Settings.POST_RADIUS, 4*Settings.POST_RADIUS);
     this.context.restore();
     // this.drawRect(this.circuitUI.highlightedComponent.x2(), this.circuitUI.highlightedComponent.y2(), Settings.POST_RADIUS + 2, Settings.POST_RADIUS + 2, 2, Settings.HIGHLIGHT_COLOR);
     }

     if (this.Circuit && this.Circuit.debugModeEnabled()) {
     this.drawDebugInfo();
     this.drawDebugOverlay();
     }
     */

    // this.context.restore()
  }

  withSelection(func) {


    func(this)
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
      let summaryArr = this.circuitUI.highlightedComponent.getSummary();

      if (summaryArr) {
        for (let idx = 0; idx < summaryArr.length; ++idx) {
          this.fillText(summaryArr[idx], 500, (idx * 11) + 5, "#1b4e24");
        }
      }
    }
  }

  beginPath() {
    /*
     this.pathMode = true;
     this.context.beginPath();
     */
  }

  closePath() {
    /*
     this.pathMode = false;
     this.context.closePath();
     */
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

  drawZigZag(point1, point2, vStart, vEnd) {
    let positions = [];

    let lineFunction = d3.line()
        .x(function (d) {
          return d.x;
        })
        .y(function (d) {
          return d.y;
        });

    let numSegments = 8;
    let width = 5;
    let parallelOffset = 1 / numSegments;

    let voltColor0 = this.getVoltageColor(vStart);
    let voltColor1 = this.getVoltageColor(vEnd);

    // Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
    let offsets = [1, -1];

    positions.push(point1);

    let startPosition = Util.interpolate(point1, point2, parallelOffset/2, width);
    positions.push(startPosition);

    // Draw resistor "zig-zags"
    for (let n = 1; n < numSegments; n++) {
      startPosition = Util.interpolate(point1, point2, n*parallelOffset + parallelOffset/2, width*offsets[n % 2]);

      positions.push(startPosition);
    }

    positions.push(point2);

    this.svg.append("path")
        .attr("d", lineFunction(positions))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    /*
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

     let startPosition = Util.interpolate(point1, point2, parallelOffset/2, width);
     context.lineTo(startPosition.x + this.lineShift, startPosition.y + this.lineShift);

     // Draw resistor "zig-zags"
     for (let n = 1; n < numSegments; n++) {
     startPosition = Util.interpolate(point1, point2, n*parallelOffset + parallelOffset/2, width*offsets[n % 2]);

     context.lineTo(startPosition.x + this.lineShift, startPosition.y + this.lineShift);
     }

     context.lineTo(point2.x + this.lineShift, point2.y + this.lineShift);

     context.stroke();

     context.closePath();
     context.restore();
     */
  }

  drawCoil(point1, point2, vStart, vEnd, hs) {
    let positions = [];

    let lineFunction = d3.line()
        .x(function (d) {
          return d.x;
        })
        .y(function (d) {
          return d.y;
        });

    let color, cx, hsx, voltageLevel;
    hs = hs || 8;

    let segments = 40;

    let ps1 = new Point(0, 0);
    let ps2 = new Point(0, 0);

    let dn = point2.diff(point1);

    ps1.x = point1.x;
    ps1.y = point1.y;

    let voltColor0 = this.getVoltageColor(vStart);
    let voltColor1 = this.getVoltageColor(vEnd);

    positions.push(point1);

    for (let i = 0; i < segments; ++i) {
      cx = (((i + 1) * 8 / segments) % 2) - 1;
      hsx = Math.sqrt(1 - cx * cx);

      ps2 = Util.interpolate(point1, point2, i / segments, hsx * hs);
      voltageLevel = vStart + (vEnd - vStart) * i / segments;
      color = this.getVoltageColor(voltageLevel);

      // this.context.lineTo(ps2.x + this.lineShift, ps2.y + this.lineShift);

      positions.push(ps2);

      ps1.x = ps2.x;
      ps1.y = ps2.y;
    }

    // positions.push(ps1);

    // this.context.lineTo(ps1.x + this.lineShift + dn.x/10, ps1.y + this.lineShift + dn.y/10);


    this.svg.append("path")
        .attr("d", lineFunction(positions))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    /*
     let color, cx, hsx, voltageLevel;
     hs = hs || 8;

     let segments = 40;

     let ps1 = new Point(0, 0);
     let ps2 = new Point(0, 0);

     let dn = point2.diff(point1);

     ps1.x = point1.x;
     ps1.y = point1.y;

     this.context.save();

     this.context.beginPath();
     this.context.lineJoin = 'bevel';

     let grad = this.context.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
     grad.addColorStop(0, this.getVoltageColor(vStart));
     grad.addColorStop(1, this.getVoltageColor(vEnd));

     this.context.strokeStyle = grad;

     this.context.moveTo(ps1.x + this.lineShift, ps1.y + this.lineShift);

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

     this.context.lineTo(ps2.x + this.lineShift, ps2.y + this.lineShift);

     ps1.x = ps2.x;
     ps1.y = ps2.y;
     }

     // this.context.lineTo(ps1.x + this.lineShift + dn.x/10, ps1.y + this.lineShift + dn.y/10);

     this.context.stroke();

     this.context.closePath();
     this.context.restore()
     */
  }

  drawScopes() {
  }

  drawComponents() {
    for (var component of this.Circuit.getElements())
      this.drawComponent(component);
  }

  drawComponent(component) {
    if (component && Array.from(this.circuitUI.selectedComponents).includes(component)) {
      this.drawBoldLines();
      component.draw(this);
      /*
       for (let i = 0; i < component.numPosts(); ++i) {
       let post = component.getPost(i);
       this.drawCircle(post.x, post.y, Settings.POST_RADIUS + 2, 2, Settings.SELECT_COLOR);
       }
       */
    }

    this.drawDefaultLines();

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

    /*
     this.context.save();

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
     this.drawCircle(xOffset, yOffset, Settings.CURRENT_RADIUS, 1, Settings.CURRENT_COLOR);
     } else {
     let xOffset0 = xOffset - ((3 * dx) / dn);
     let yOffset0 = yOffset - ((3 * dy) / dn);

     let xOffset1 = xOffset + ((3 * dx) / dn);
     let yOffset1 = yOffset + ((3 * dy) / dn);

     //this.context.save();
     this.context.strokeStyle = Settings.CURRENT_COLOR;
     this.context.lineWidth = Settings.CURRENT_RADIUS;
     this.context.beginPath();
     this.context.moveTo(xOffset0, yOffset0);
     this.context.lineTo(xOffset1, yOffset1);
     this.context.stroke();
     this.context.closePath();
     //this.context.restore();
     }

     newPos += ds
     }

     this.context.restore();
     */
  }

  drawDebugOverlay() {
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
  }

  drawDebugInfo(x = 1100, y = 50) {
    if (!this.Circuit || !this.context)
      return;

    let str = `UI: ${this.circuitUI.width}x${this.circuitUI.height}\n`;
    str += this.circuitUI.getMode() + "\n";

    str += "Highlighted Node: :" + this.circuitUI.highlightedNode + "\n";
    str += "Selected Node: :" + this.circuitUI.selectedNode + "\n";
    str += "Highlighted Component: " + this.circuitUI.highlightedComponent + "\n";
    str += `Selection [${this.circuitUI.marquee || ""}]\n  - `;
    str += this.circuitUI.selectedComponents.join("\n  - ") + "\n";

    str += "\nCircuit:\n";

    // Name
    str += this.Circuit.toString();

    let lineHeight = 10;
    let nLines = 0;
    for (let line of str.split("\n")) {
      this.context.drawText(line, x, y + nLines * lineHeight);

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

    this.fillCircle(x0, y0, Settings.POST_RADIUS, oulineWidth, fillColor, strokeColor);
  }

  drawBoldLines() {
    return this.boldLines = true;
  }

  drawDefaultLines() {
    return this.boldLines = false;
  }

  // Draw Primitives

  fillText(text, x, y, fillColor = Settings.TEXT_COLOR, size = Settings.TEXT_SIZE, strokeColor = 'rgba(255, 255, 255, 0.3)') {
    /*
     this.context.save();

     this.context.fillStyle = fillColor;
     this.context.strokeStyle = strokeColor;
     this.context.font = `${Settings.TEXT_STYLE} ${size}pt ${Settings.FONT}`;
     this.context.drawText(text, x, y);

     this.context.lineWidth = 0;
     this.context.strokeText(text, x, y);

     let textMetrics = this.context.measureText(text);

     this.context.restore();


     return textMetrics;
     */

    return {
      width: 10
    }
  }

  fillCircle(x, y, radius, lineWidth = Settings.LINE_WIDTH, fillColor = '#FFFF00', lineColor = null) {
    /*
     this.context.save();

     this.context.beginPath();
     this.context.arc(x, y, radius, 0, 2 * Math.PI);

     if (lineColor && lineWidth > 0) {
     this.context.lineWidth = lineWidth;
     this.context.strokeStyle = lineColor;
     this.context.stroke();
     }

     this.context.fillStyle = fillColor;
     this.context.fill();

     this.context.closePath();

     this.context.restore();
     */

    this.svg.append("circle")
        .style("stroke-width", lineWidth)
        .style("stroke", "black")
        .style("fill", fillColor)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", radius)
  }

  drawCircle(x, y, radius, lineWidth = Settings.LINE_WIDTH, lineColor = "#000000") {
    /*
     this.context.save();

     this.context.strokeStyle = lineColor;
     this.context.lineWidth = lineWidth;

     this.context.beginPath();
     this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
     this.context.stroke();
     this.context.closePath();

     this.context.restore();
     */

    this.svg.append("circle")
        .attr("stroke-width", lineWidth)
        .attr("stroke", lineColor)
        .attr("fill", "#F0F")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", radius)
  }

  drawRect(x, y, width, height, lineWidth = Settings.LINE_WIDTH, lineColor = Settings.STROKE_COLOR) {
    /*
     this.context.save();

     this.context.strokeStyle = lineColor;
     this.context.lineJoin = 'miter';
     this.context.lineWidth = lineWidth;
     this.context.strokeRect(x + this.lineShift, y + this.lineShift, width, height);
     this.context.stroke();

     this.context.restore();
     */

    this.svg.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("stroke-width", lineWidth)
        .attr("stroke", lineColor)
        .attr("width", width)
        .attr("height", height);
  }

  drawLinePt(pa, pb, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) {
    this.drawLine(pa.x, pa.y, pb.x, pb.y, color, lineWidth);
  }

  drawValue(perpindicularOffset, parallelOffset, component, text = null, text_size = Settings.TEXT_SIZE) {
    /*
     let x, y;

     this.context.save();
     this.context.textAlign = "center";

     this.context.font = "bold 7pt Courier";

     let theta = Math.atan(component.dy()/component.dx());

     let stringWidth = this.context.measureText(text).width;
     let stringHeight = this.context.measureText(text).actualBoundingBoxAscent || 0;

     this.context.fillStyle = Settings.TEXT_COLOR;
     // if (component.isVertical()) {

     ({x} = component.getCenter()); //+ perpindicularOffset
     ({y} = component.getCenter()); //+ parallelOffset - stringHeight / 2.0

     this.context.translate(x, y);
     this.context.rotate(theta);
     this.drawText(text, parallelOffset, -perpindicularOffset, Settings.TEXT_COLOR, text_size);

     this.context.restore();
     */
  }



  drawLine(x1, y1, x2, y2, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) {

    /*
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
     this.context.moveTo(x + this.lineShift, y + this.lineShift);
     this.context.lineTo(x2 + this.lineShift, y2 + this.lineShift);
     this.context.stroke();

     if (!this.pathMode)
     this.context.closePath();

     this.context.restore();
     */

    this.svg.append("line")
        .style("stroke", "black")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)

  }

  drawThickPolygon(xlist, ylist, color = Settings.STROKE_COLOR, fill = Settings.FILL_COLOR) {
    /*
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
     */

    let poly = [];

    for (let i =0; i<xlist.length; ++i) {
      poly.push({x: xlist[i], y: ylist[i]});
    }

    this.svg.append("polyline")
        .data([poly])
        .attr("points", function (d) {
          return d.map(function (d) {
            return [d.x, d.y].join(",");
          }).join(" ");
        })
        .attr("stroke-width", 1)
        .attr("stroke", color);
  }

  drawThickPolygonP(polygon, color = Settings.STROKE_COLOR, fill = Settings.FILL_COLOR) {
    /*
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
     */

    let poly = polygon.getVertices();

    this.svg.append("polyline")
        .data([poly])
        .attr("points", function (d) {
          return d.map(function (d) {
            return [d.x, d.y].join(",");
          }).join(" ");
        })
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("fill", "white");
  }

}

module.exports = SvgRenderer;
