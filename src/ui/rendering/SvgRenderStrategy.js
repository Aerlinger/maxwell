let Util = require('../../util/Util');
let Point = require('../../geom/Point');
let Color = require('../../util/Color');

let CircuitComponent = require('../../components/CircuitComponent');
let ScopeCanvas = require('../scopes/ScopeCanvas');

let d3 = require("d3");

module.exports = function SvgRenderStrategy(context, config, fullScaleVRange) {
  Object.assign(this, config);

  this.svg = d3.select("body").append("svg")
      .attr("width", this.Canvas.width + this.xMargin)
      .attr("height", this.Canvas.height + this.yMargin)
      .append("g")
      .attr("transform", "translate(" + this.xMargin + "," + this.yMargin + ")");

  this.testDraw = function () {
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
  };


  this.withMargin = function (xMargin, yMargin, block) {
    // TOOD:
    func(this)
  };

  this.drawInfoText = function () {
    if (this.circuitUI.highlightedComponent != null) {
      let summaryArr = this.circuitUI.highlightedComponent.getSummary();

      if (summaryArr) {
        for (let idx = 0; idx < summaryArr.length; ++idx) {
          this.fillText(summaryArr[idx], 500, (idx * 11) + 5, "#1b4e24");
        }
      }
    }
  };

  this.drawComponents = function () {
    for (var component of this.Circuit.getElements())
      this.drawComponent(component);
  };

  this.drawComponent = function (component) {
    if (component && Array.from(this.circuitUI.selectedComponents).includes(component)) {
      this.drawBoldLines();
      component.draw(this);
      /*
       for (let i = 0; i < component.numPosts(); ++i) {
       let post = component.getPost(i);
       this.drawCircle(post.x, post.y, config.POST_RADIUS + 2, 2, config.SELECT_COLOR);
       }
       */
    }

    this.drawDefaultLines();

    // Main entry point to draw component
    component.draw(this);
  };

  // TODO: Move to CircuitComponent
  this.drawDots = function (ptA, ptB, component) {
    throw new Error("`drawDots` is not implemented in SvgRenderStrategy")
  };

  this.drawDebugOverlay = function () {
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

  this.drawDebugInfo = function (x = 1100, y = 50) {
    throw new Error("`drawDebugInfo` is not implemented in SvgRenderStrategy")
  };

  this.measureText = function (text) {
    throw new Error("`measureText` is not implemented in SvgRenderStrategy")
  };

  this.drawBoldLines = function () {
    return this.boldLines = true;
  };

  this.drawDefaultLines = function () {
    return this.boldLines = false;
  };

  this.drawZigZag = function (point1, point2, vStart, vEnd) {
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

    let startPosition = Util.interpolate(point1, point2, parallelOffset / 2, width);
    positions.push(startPosition);

    // Draw resistor "zig-zags"
    for (let n = 1; n < numSegments; n++) {
      startPosition = Util.interpolate(point1, point2, n * parallelOffset + parallelOffset / 2, width * offsets[n % 2]);

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
     context.lineWidth = config.BOLD_LINE_WIDTH;
     context.strokeStyle = config.SELECT_COLOR;
     } else {
     context.lineWidth = config.LINE_WIDTH + 1;
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

  this.drawCoil = function (point1, point2, vStart, vEnd, hs) {
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
     this.context.lineWidth = config.BOLD_LINE_WIDTH;
     this.context.strokeStyle = config.SELECT_COLOR;
     } else {
     this.context.lineWidth = config.LINE_WIDTH + 1;
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
  this.drawPosts = function (component, color = config.POST_COLOR) {
    let post;

    for (let i = 0; i < component.numPosts(); ++i) {
      post = component.getPost(i);
      this.drawPost(post.x, post.y, color);
    }
  };

  this.drawPost = function (x0, y0, fillColor = config.POST_COLOR, strokeColor = config.POST_OUTLINE_COLOR) {
    let oulineWidth = config.POST_OUTLINE_SIZE;

    if (this.boldLines) {
      strokeColor = config.POST_SELECT_OUTLINE_COLOR;
      fillColor = config.POST_SELECT_COLOR;
      oulineWidth += 3;
    }

    this.fillCircle(x0, y0, config.POST_RADIUS, oulineWidth, fillColor, strokeColor);
  };

  this.drawText = function (text, x, y, fillColor = config.TEXT_COLOR, size = config.TEXT_SIZE, strokeColor = 'rgba(255, 255, 255, 0.3)') {
    throw new Error("`drawText` is not implemented in SvgRenderStrategy")
  };

  this.drawValue = function (perpindicularOffset, parallelOffset, component, text = null, text_size = config.TEXT_SIZE) {
    throw new Error("`drawValue` is not implemented in SvgRenderStrategy")
  };

  this.getVoltageColor = function (volts) {
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
  };

  this.drawCircle = function (x, y, radius, lineWidth = config.LINE_WIDTH, lineColor = "#000000") {
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
  };

  this.drawRect = function (x, y, width, height, {
      lineWidth = config.LINE_WIDTH,
      lineColor = config.STROKE_COLOR
  } = {}) {
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
  };

  this.drawLinePt = function (pa, pb, color = config.STROKE_COLOR, lineWidth = config.LINE_WIDTH) {
    this.drawLine(pa.x, pa.y, pb.x, pb.y, color, lineWidth);
  };

  this.drawLine = function (x1, y1, x2, y2, color = config.STROKE_COLOR, lineWidth = config.LINE_WIDTH) {

    /*
     this.context.save();

     this.context.lineCap = "round";

     if (!this.pathMode)
     this.context.beginPath();

     if (this.boldLines) {
     this.context.lineWidth = config.BOLD_LINE_WIDTH;
     this.context.strokeStyle = config.SELECT_COLOR;
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

  };

  this.drawPolygon = function (polygon, {
      stroke = config.STROKE_COLOR,
      fill = config.FILL_COLOR,
      lineWidth = config.POLY_LINE_WIDTH
  } = {}) {
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
