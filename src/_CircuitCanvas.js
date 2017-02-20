let Observer = require('./util/Observer');
let Util = require('./util/Util');
let Point = require('./geom/Point.js');
let Settings = require('./Settings.js');
let Color = require('./util/Color.js');

let CircuitComponent = require('./components/CircuitComponent');
let environment = require('./Environment.js');

let { TimeSeries, SmoothieChart } = require("smoothie");

if (environment.isBrowser) {
  require('jquery-ui');
}

let lineShift = 0;

let interactionBinding = require('./ui/InteractionBindings');

class CircuitCanvas extends Observer {
  constructor(Circuit, circuitUI, canvas) {
    super();

    // this.circuitUI = circuitUI;
    this.Circuit = Circuit;
    this.Canvas = canvas;

    // TODO: Extract to param
    this.xMargin = circuitUI.xMargin;
    this.yMargin = circuitUI.yMargin;

    this.draw = this.draw.bind(this);
    this.drawDots = this.drawDots.bind(this);

    this.context = this.Canvas.getContext("2d");
    this.running = false;

    if (environment.isBrowser) {
      // this.setupScopes();
      this.renderPerformance();
      this.startRenderLoop()
    }

    interactionBinding.bind(this)
  }

  startRenderLoop() {
    this.running = true;
    this.rafDraw();
  }

  suspendRenderLoop() {
    this.running = false
  }

  rafDraw() {
    if (this.running) {
      window.requestAnimationFrame(this.rafDraw.bind(this));

      this.draw()
    }
  }

  setupScopes() {
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
    }
  }

  renderPerformance() {
    this.performanceMeter = new TimeSeries();

    let chart = new SmoothieChart({
      millisPerPixel: 35,
      grid: {fillStyle: 'transparent', millisPerLine: 1000, lineWidth: 0.5, verticalSections: 0},
      labels: {fillStyle: '#000000', precision: 0}
    });

    chart.addTimeSeries(this.performanceMeter, {strokeStyle: 'rgba(255, 0, 200, 1)', lineWidth: 1});
    chart.streamTo(document.getElementById("performance_sparkline"), 500);
  }

  clear() {
    this.context.clearRect(0, 0, this.Canvas.clientWidth, this.Canvas.clientHeight)
  }

  draw() {
    // UPDATE FRAME ----------------------------------------------------------------
    // TODO: Move out of draw
    this.Circuit.updateCircuit();

    if (this.circuitUI.onUpdateComplete) {
      this.circuitUI.onUpdateComplete();
    }
    // -----------------------------------------------------------------------------

    this.clear();
    // this.drawGrid();

    this.context.save();
    this.context.translate(this.xMargin, this.yMargin);

    this.drawText("Time elapsed: " + Util.getUnitText(this.Circuit.time, "s"), 10, 5, "#bf4f00", 1.2 * Settings.TEXT_SIZE);
    this.drawText("Frame Time: " + Math.floor(this.Circuit.lastFrameTime) + "ms", 600, 8, "#000968", 1.1 * Settings.TEXT_SIZE);

    if (this.performanceMeter) {
      this.performanceMeter.append(new Date().getTime(), this.Circuit.lastFrameTime);
    }

    this.drawScopes();
    this.drawComponents();

    this.drawInfoText();

    if (this.circuitUI.highlightedNode)
      this.drawCircle(this.circuitUI.highlightedNode.x + 0.5, this.circuitUI.highlightedNode.y + 0.5, 7, 3, "#0F0");

    if (this.circuitUI.selectedNode)
      this.drawRect(this.circuitUI.selectedNode.x - 10 + 0.5, this.circuitUI.selectedNode.y - 10 + 0.5, 21, 21, 1, "#0FF");

    if (this.circuitUI.placeComponent) {
      this.context.fillText(`Placing ${this.circuitUI.placeComponent.constructor.name}`, this.circuitUI.snapX + 10, this.circuitUI.snapY + 10);

      if (this.circuitUI.placeY && this.circuitUI.placeX && this.circuitUI.placeComponent.x2() && this.circuitUI.placeComponent.y2()) {
        this.drawComponent(this.circuitUI.placeComponent);
      }
    }

    if (this.circuitUI.highlightedComponent) {
      this.circuitUI.highlightedComponent.draw(this);

      this.context.save();
      this.context.fillStyle = Settings.POST_COLOR;

      for (let i = 0; i < this.circuitUI.highlightedComponent.numPosts(); ++i) {
        let post = this.circuitUI.highlightedComponent.getPost(i);

        this.context.fillRect(post.x - Settings.POST_RADIUS - 1, post.y - Settings.POST_RADIUS - 1, 2 * Settings.POST_RADIUS + 2, 2 * Settings.POST_RADIUS + 2);
      }

      if (this.circuitUI.highlightedComponent.x2())
        this.context.fillRect(this.circuitUI.highlightedComponent.x2() - 2 * Settings.POST_RADIUS, this.circuitUI.highlightedComponent.y2() - 2 * Settings.POST_RADIUS, 4 * Settings.POST_RADIUS, 4 * Settings.POST_RADIUS);
      this.context.restore();
      // this.drawRect(this.circuitUI.highlightedComponent.x2(), this.circuitUI.highlightedComponent.y2(), Settings.POST_RADIUS + 2, Settings.POST_RADIUS + 2, 2, Settings.HIGHLIGHT_COLOR);
    }

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      this.drawDebugInfo();
      this.drawDebugOverlay();
    }

    if (this.circuitUI.marquee) {
      this.circuitUI.marquee.draw(this)
    }

    this.context.restore()
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

  drawScopes() {
    for (let scopeElm of this.Circuit.getScopes()) {
      let scopeCanvas = scopeElm.getCanvas();

      if (scopeCanvas) {
        var center = scopeElm.circuitElm.getCenter();
        this.context.save();

        this.context.setLineDash([5, 5]);
        this.context.strokeStyle = "#FFA500";
        this.context.lineWidth = 1;
        this.context.moveTo(center.x, center.y);
        this.context.lineTo(scopeCanvas.x(), scopeCanvas.y() + scopeCanvas.height() / 2);

        this.context.stroke();

        this.context.restore();
      }
    }
  }

  drawComponents() {
    for (var component of this.Circuit.getElements())
      this.drawComponent(component);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      for (let nodeIdx = 0; nodeIdx < this.Circuit.numNodes(); ++nodeIdx) {
        let voltage = Util.singleFloat(this.Circuit.getVoltageForNode(nodeIdx));
        let node = this.Circuit.getNode(nodeIdx);

        this.context.fillText(`${nodeIdx}:${voltage}`, node.x + 10, node.y - 10, "#FF8C00");
      }
    }
  }

  drawComponent(component) {
    if (component && this.circuitUI.selectedComponents.includes(component)) {
      this.drawBoldLines();
      component.draw(this);
    }

    this.drawDefaultLines();

    // Main entry point to draw component
    component.draw(this);
  }


}

module.exports = CircuitCanvas;
