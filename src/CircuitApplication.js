let Observer = require('./util/Observer');
let Util = require('./util/Util');
let Point = require('./geom/Point.js');
let Settings = require('./Settings.js');
let Color = require('./util/Color.js');

let ResistorElm = require('./components/ResistorElm');

let CanvasRenderer = require('./ui/rendering/CanvasRenderStrategy');
let interactionBinding = require('./ui/InteractionBindings');

let RickshawScopeCanvas = require('./ui/scopes/RickshawScopeCanvas');

let CircuitComponent = require('./components/CircuitComponent');
let environment = require('./Environment.js');

let {TimeSeries, SmoothieChart} = require('smoothie');

if (environment.isBrowser) {
  require('jquery-ui');
}

class CircuitApplication extends Observer {
  constructor(Circuit, canvas) {
    super();

    // A Circuit is already loaded on this canvas so we need to garbage collect it to prevent a memory leak
    if (canvas.__circuit_application) {
      let previous_application = canvas.__circuit_application;

      previous_application.pause();

      previous_application.Canvas.onmousemove = null;
      previous_application.Canvas.onmousedown = null;
      previous_application.Canvas.onmouseup = null;

      previous_application.Circuit = null;
      previous_application.Canvas = null;
      previous_application.renderer = null;
      previous_application.context = null;
    }

    this.Circuit = Circuit;
    this.Canvas = canvas;
    this.context = canvas.getContext('2d');

    this.isDragging = false;

    this.draw = this.draw.bind(this);

    this.xMargin = 200;
    this.yMargin = 56;

    this.highlightedComponent = null;
    this.selectedNode = null;
    this.selectedComponents = [];
    this.previouslySelectedComponents = [];

    this.placeX = null;
    this.placeY = null;

    this.running = false;

    this.renderer = new CanvasRenderer(this.context, Circuit.Params.voltageRange);
    interactionBinding.bind(this)(Circuit, canvas);

    if (environment.isBrowser) {
      this.setupScopes();
      this.renderPerformance();

      canvas.__circuit_application = this;
    }

    this.run()
  }

  run() {
    if (!this.running) {
      this.running = true;
      this.rafDraw();
    }
  }

  pause() {
    if (this.running) {
      this.running = false;
    }
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

      let sc = new RickshawScopeCanvas(this, scElm);
      scopeElm.setCanvas(sc);

      $(scElm).on('resize', function (evt) {
        let innerElm = $(scElm).find('.plot-context');

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
    chart.streamTo(document.getElementById('performance_sparkline'), 500);
  }

  clear() {
    this.context.clearRect(0, 0, this.Canvas.clientWidth, this.Canvas.clientHeight)
  }

  draw() {
    // UPDATE FRAME ----------------------------------------------------------------
    // TODO: Move out of draw
    this.Circuit.updateCircuit();

    if (this.onUpdateComplete) {
      this.onUpdateComplete();
    }
    // -----------------------------------------------------------------------------

    this.clear();
    // this.drawGrid();

    this.context.save();
    this.context.translate(this.xMargin, this.yMargin);

    this.renderer.drawText('Time elapsed: ' + Util.getUnitText(this.Circuit.time, 's'), 10, 5, '#bf4f00', 1.2 * Settings.TEXT_SIZE);
    this.renderer.drawText('Frame Time: ' + Math.floor(this.Circuit.lastFrameTime) + 'ms', 600, 8, '#000968', 1.1 * Settings.TEXT_SIZE);

    if (this.performanceMeter) {
      this.performanceMeter.append(new Date().getTime(), this.Circuit.lastFrameTime);
    }

    this.drawScopes();
    this.drawComponents();

    this.renderer.drawInfoText(this.highlightedComponent);

    if (this.highlightedNode)
      this.renderer.drawCircle(this.highlightedNode.x + 0.5, this.highlightedNode.y + 0.5, 7, 3, '#0F0');

    if (this.selectedNode)
      this.renderer.drawRect(this.selectedNode.x - 10 + 0.5, this.selectedNode.y - 10 + 0.5, 21, 21, 1, '#0FF');

    if (this.placeComponent) {
      this.context.fillText(`Placing ${this.placeComponent.constructor.name}`, this.snapX + 10, this.snapY + 10);

      if (this.placeY && this.placeX && this.placeComponent.x2() && this.placeComponent.y2()) {
        this.drawComponent(this.placeComponent);
      }
    }

    if (this.highlightedComponent) {
      this.highlightedComponent.draw(this.renderer);

      this.context.save();
      this.context.fillStyle = Settings.POST_COLOR;

      for (let i = 0; i < this.highlightedComponent.numPosts(); ++i) {
        let post = this.highlightedComponent.getPost(i);

        this.context.fillRect(post.x - Settings.POST_RADIUS - 1, post.y - Settings.POST_RADIUS - 1, 2 * Settings.POST_RADIUS + 2, 2 * Settings.POST_RADIUS + 2);
      }

      if (this.highlightedComponent.x2())
        this.context.fillRect(this.highlightedComponent.x2() - 2 * Settings.POST_RADIUS, this.highlightedComponent.y2() - 2 * Settings.POST_RADIUS, 4 * Settings.POST_RADIUS, 4 * Settings.POST_RADIUS);
      this.context.restore();
    }

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      this.drawDebugInfo();
      this.drawDebugOverlay(this.circuit);
    }

    if (this.marquee) {
      this.marquee.draw(this.renderer)
    }

    this.context.restore()
  }

  renderScopeCanvas(elementName) {
    let scopeWrapper = document.createElement('div');
    scopeWrapper.className = 'plot-pane';

    let leftAxis = document.createElement('div');
    leftAxis.className = 'left-axis';

    let scopeCanvas = document.createElement('div');
    scopeCanvas.className = 'plot-context';

    if (elementName) {
      let label = document.createElement('div');
      label.className = 'plot-label';
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
        this.context.strokeStyle = '#FFA500';
        this.context.lineWidth = 1;
        this.context.moveTo(center.x, center.y);
        this.context.lineTo(scopeCanvas.x(), scopeCanvas.y() + scopeCanvas.height() / 2);

        this.context.stroke();

        this.context.restore();
      }
    }
  }

  getMode() {
    let mode = '';

    if (this.isDragging)
      mode = 'DRAGGING';
    else if (this.isPlacingComponent())
      mode = 'PLACING';
    else if (this.isSelecting())
      mode = 'SELECTING';
    else
      mode = 'IDLE';

    return mode
  }

  clearPlaceComponent() {
    this.placeX = null;
    this.placeY = null;
    this.placeComponent = null;
  }

  resetSelection() {
    if (this.selectedComponents && (this.selectedComponents.length > 0))
      this.onSelectionChanged({
        selection: [],
        added: [],
        removed: this.selectedComponents
      });

    this.selectedComponents = [];
  }

  getSelectedComponents() {
    return this.selectedComponents;
  }

  setPlaceComponent(componentName) {
    let klass = eval(componentName);

    this.placeComponent = new klass();

    this.resetSelection();

    return this.placeComponent;
  }

  remove(components) {
    console.log('components', components);
    return this.Circuit.destroy(components);
  }

  isPlacingComponent() {
    return !!this.placeComponent;
  }

  drawComponents() {
    for (let component of this.Circuit.getElements())
      this.drawComponent(component);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      for (let nodeIdx = 0; nodeIdx < this.Circuit.numNodes(); ++nodeIdx) {
        let voltage = Util.singleFloat(this.Circuit.getVoltageForNode(nodeIdx));
        let node = this.Circuit.getNode(nodeIdx);

        this.context.fillText(`${nodeIdx}:${voltage}`, node.x + 10, node.y - 10, '#FF8C00');
      }
    }
  }

  isPlacingComponent() {
    return !!this.placeComponent;
  }

  togglePause() {
    if (this.Circuit.isStopped)
      this.Circuit.resume();
    else
      this.Circuit.pause();
  }

  isSelecting() {
    return !!this.marquee;
  }

  drawComponent(component) {
    if (component && this.selectedComponents.includes(component)) {
      this.renderer.drawBoldLines();
      component.draw(this.renderer);
    }

    this.renderer.drawDefaultLines();

    // Main entry point to draw component
    component.draw(this.renderer);
  }
}

module.exports = CircuitApplication;
