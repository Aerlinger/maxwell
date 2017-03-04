let {TimeSeries, SmoothieChart} = require('smoothie');

let Observer = require('./util/Observer');
let Util = require('./util/Util');
let Point = require('./geom/Point.js');
let Settings = require('./Settings.js');
let Config = require('./Config.js');

let Color = require('./util/Color.js');
let CanvasRenderer = require('./ui/rendering/CanvasRenderStrategy');
let MouseEvents = require('./ui/MouseEvents');

let RickshawScopeCanvas = require('./ui/scopes/RickshawScopeCanvas');
let HistoryStack = require('./ui/HistoryStack');

let Components = require('./components');

let environment = require('./Environment.js');

if (environment.isBrowser) {
  require('jquery-ui');
}

class CircuitApplication extends Observer {
  constructor(Circuit, canvas, {xMargin=200, yMargin= 64} = {}) {
    super();

    // A Circuit is already loaded on this canvas so we need to garbage collect it to prevent a memory leak
    if (canvas.__circuit_application) {
      let previous_application = canvas.__circuit_application;

      previous_application.reset();

      previous_application = null;
    }

    this.Circuit = Circuit;
    this.Config = new Config();
    this.HistoryStack = new HistoryStack();

    this.isDragging = false;
    this.highlightedComponent = null;
    this.selectedNode = null;
    this.selectedComponents = [];
    this.previouslySelectedComponents = [];

    this.placeX = null;
    this.placeY = null;

    this.running = false;

    let renderer = new CanvasRenderer(canvas.getContext('2d'), this.Config, Circuit.Params.voltageRange);

    this.draw = this.draw.bind(this, renderer, xMargin, yMargin);
    MouseEvents.bind(this)(Circuit, canvas, {xMargin, yMargin});

    if (environment.isBrowser) {
      // this.setupScopes(canvas.parentNode);
      this.createPerformanceMeter();

      canvas.__circuit_application = this;
    }
  }

  reset() {
    console.log("Resetting", this.Circuit.name);

    this.pause();

    if (this.chart)
      this.chart.removeTimeSeries(this.performanceMeter);

    if (this.performanceMeter)
      this.performanceMeter = null;

    this.chart = null;

    this.mousemove = null;
    this.mousedown = null;
    this.mouseup = null;

    this.highlightedComponent = null;
    this.selectedNode = null;
    this.previouslySelectedComponents = [];
    this.selectedComponents = [];
    this.draw = null;
    this.elementList = null;
    this.HistoryStack = null;
    this.Circuit = null;
  }

  onAnimationFrameReady() {
    if (this.running) {
      requestAnimationFrame(this.onAnimationFrameReady.bind(this));

      this.Circuit.updateCircuit();

      if (this.onUpdateComplete)
        this.onUpdateComplete();

      if (this.performanceMeter)
        this.performanceMeter.append(new Date().getTime(), this.Circuit.lastFrameTime);

      this.draw();
    }
  }

  run() {
    if (!this.running) {
      this.running = true;
      this.onAnimationFrameReady();
    }
  }

  pause() {
    if (this.running) {
      this.running = false;
    }
  }

  togglePause() {
    if (this.Circuit.isStopped)
      this.Circuit.resume();
    else
      this.Circuit.pause();
  }

  setupScopes(rootElm) {
    for (let scopeElm of this.Circuit.getScopes()) {
      let scElm = this.createScopeCanvas(scopeElm.circuitElm.getName());
      $(scElm).draggable();
      $(scElm).resizable();

      rootElm.append(scElm);

      let sc = new RickshawScopeCanvas(this, scElm);
      scopeElm.setCanvas(sc);

      $(scElm).on('resize', function (evt) {
        let innerElm = $(scElm).find('.plot-context');

        sc.resize(innerElm.width(), innerElm.height() - 5);
      });
    }
  }

  createScopeCanvas(elementName) {
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

  createPerformanceMeter() {
    this.performanceMeter = new TimeSeries();

    this.chart = new SmoothieChart({
      millisPerPixel: 35,
      grid: {fillStyle: 'transparent', millisPerLine: 1000, lineWidth: 0.5, verticalSections: 0},
      labels: {fillStyle: '#000', precision: 0}
    });

    this.chart.addTimeSeries(this.performanceMeter, {strokeStyle: 'rgba(255, 0, 200, 1)', lineWidth: 1});
    this.chart.streamTo(document.getElementById('performance_sparkline'), 500);
  }

  draw(renderer, xMargin, yMargin) {
    renderer.withMargin(xMargin, yMargin, () => {
      renderer.drawScopes(this.Circuit.getScopes());
      renderer.drawComponents(this.Circuit, this.selectedComponents);

      renderer.drawHighlightedNode(this.highlightedNode);
      renderer.drawSelectedNodes(this.selectedNode);
      renderer.drawHighlightedComponent(this.highlightedComponent);

      renderer.drawInfoText(this.Circuit, this.highlightedComponent);
      renderer.drawDebugInfo(this);

      renderer.drawMarquee(this.marquee);
    })
  }

  getMode() {
    if (this.isDragging)
      return 'DRAGGING';
    else if (this.isPlacingComponent())
      return 'PLACING';
    else if (this.isSelecting())
      return 'SELECTING';
    else
      return 'IDLE';
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
    let Component = Components[componentName];

    this.placeComponent = new Component();

    this.resetSelection();
    return this.placeComponent;
  }

  isPlacingComponent() {
    return !!this.placeComponent;
  }

  isSelecting() {
    return !!this.marquee;
  }

  /* ACTIONS */

  remove(components) {
    this.HistoryStack.pushUndo(this.Circuit);

    return this.Circuit.destroy(components);
  }
}

module.exports = CircuitApplication;
