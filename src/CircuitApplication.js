let {TimeSeries, SmoothieChart} = require('smoothie');

let Observer = require('./util/Observer');
let Util = require('./util/Util');
let Point = require('./geom/Point.js');
let Settings = require('./Settings.js');
let Color = require('./util/Color.js');
let CanvasRenderer = require('./ui/rendering/CanvasRenderStrategy');
let interactionBinding = require('./ui/MouseEvents');

let RickshawScopeCanvas = require('./ui/scopes/RickshawScopeCanvas');
let HistoryStack = require('./ui/HistoryStack');

let CircuitComponent = require('./components/CircuitComponent');
let environment = require('./Environment.js');

// Element includes
let WireElm = require('./components/WireElm.js');

let AcRailElm = require('./components/ACRailElm.js');
let AntennaElm = require('./components/AntennaElm.js');
let ResistorElm = require('./components/ResistorElm.js');
let GroundElm = require('./components/GroundElm.js');
let VoltageElm = require('./components/VoltageElm.js');
let DiodeElm = require('./components/DiodeElm.js');
let OutputElm = require('./components/OutputElm.js');
let SwitchElm = require('./components/SwitchElm.js');
let CapacitorElm = require('./components/CapacitorElm.js');
let InductorElm = require('./components/InductorElm.js');
let SparkGapElm = require('./components/SparkGapElm.js');
let CurrentElm = require('./components/CurrentElm.js');
let RailElm = require('./components/RailElm.js');
let MosfetElm = require('./components/MosfetElm.js');
let JfetElm = require('./components/JFetElm.js');
let TransistorElm = require('./components/TransistorElm.js');
let VarRailElm = require('./components/VarRailElm.js');
let OpAmpElm = require('./components/OpAmpElm.js');
let ZenerElm = require('./components/ZenerElm.js');
let Switch2Elm = require('./components/Switch2Elm.js');
let PushSwitchElm = require('./components/PushSwitchElm.js');
let SweepElm = require('./components/SweepElm.js');
let TextElm = require('./components/TextElm.js');
let ProbeElm = require('./components/ProbeElm.js');

let AndGateElm = require('./components/AndGateElm.js');
let NandGateElm = require('./components/NandGateElm.js');
let OrGateElm = require('./components/OrGateElm.js');
let NorGateElm = require('./components/NorGateElm.js');
let XorGateElm = require('./components/XorGateElm.js');
let InverterElm = require('./components/InverterElm.js');

let LogicInputElm = require('./components/LogicInputElm.js');
let LogicOutputElm = require('./components/LogicOutputElm.js');
let AnalogSwitchElm = require('./components/AnalogSwitchElm.js');
let AnalogSwitch2Elm = require('./components/AnalogSwitch2Elm.js');
let MemristorElm = require('./components/MemristorElm.js');
let RelayElm = require('./components/RelayElm.js');
let TunnelDiodeElm = require('./components/TunnelDiodeElm.js');

let ScrElm = require('./components/SCRElm.js');
let TriodeElm = require('./components/TriodeElm.js');

let DecadeElm = require('./components/DecadeElm.js');
let LatchElm = require('./components/LatchElm.js');
let TimerElm = require('./components/TimerElm.js');
let JkFlipFlopElm = require('./components/JkFlipFlopElm.js');
let DFlipFlopElm = require('./components/DFlipFlopElm.js');
let CounterElm = require('./components/CounterElm.js');
let DacElm = require('./components/DacElm.js');
let AdcElm = require('./components/AdcElm.js');
let VcoElm = require('./components/VcoElm.js');
let PhaseCompElm = require('./components/PhaseCompElm.js');
let SevenSegElm = require('./components/SevenSegElm.js');
let CC2Elm = require('./components/CC2Elm.js');

let TransLineElm = require('./components/TransLineElm.js');

let TransformerElm = require('./components/TransformerElm.js');
let TappedTransformerElm = require('./components/TappedTransformerElm.js');

let LedElm = require('./components/LedElm.js');
let PotElm = require('./components/PotElm.js');
let ClockElm = require('./components/ClockElm.js');


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
    this.HistoryStack = new HistoryStack();
    this.Canvas = canvas;
    this.context = canvas.getContext('2d');

    this.isDragging = false;

    this.draw = this.draw.bind(this);

    this.xMargin = xMargin;
    this.yMargin = yMargin;

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
      // this.setupScopes();
      this.renderPerformance();

      canvas.__circuit_application = this;
    }
  }

  rafDraw() {
    if (this.running) {
      requestAnimationFrame(this.rafDraw.bind(this));

      this.Circuit.updateCircuit();

      if (this.onUpdateComplete)
        this.onUpdateComplete();

      this.draw()
    }
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

  reset() {
    console.log("Resetting", this.Circuit.name);

    this.pause();

    if (this.Canvas) {
      this.Canvas.onmousemove = null;
      this.Canvas.onmousedown = null;
      this.Canvas.onmouseup = null;
    }

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
    this.renderer = null;
    this.elementList = null;
    this.HistoryStack = null;
    this.Circuit = null;
    this.Canvas = null;
    this.renderer = null;
    this.context = null;
  }

  togglePause() {
    if (this.Circuit.isStopped)
      this.Circuit.resume();
    else
      this.Circuit.pause();
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

    this.chart = new SmoothieChart({
      millisPerPixel: 35,
      grid: {fillStyle: 'transparent', millisPerLine: 1000, lineWidth: 0.5, verticalSections: 0},
      labels: {fillStyle: '#000000', precision: 0}
    });

    this.chart.addTimeSeries(this.performanceMeter, {strokeStyle: 'rgba(255, 0, 200, 1)', lineWidth: 1});
    this.chart.streamTo(document.getElementById('performance_sparkline'), 500);
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.Canvas.clientWidth, this.Canvas.clientHeight)
  }

  draw() {
    this.clearCanvas();
    // this.drawGrid();

    this.context.save();
    this.context.translate(this.xMargin, this.yMargin);

    this.renderer.drawText('Time elapsed: ' + Util.getUnitText(this.Circuit.time, 's'), 10, 5, '#bf4f00', 1.2 * Settings.TEXT_SIZE);
    this.renderer.drawText('Frame Time: ' + Math.floor(this.Circuit.lastFrameTime) + 'ms', 600, 8, '#000968', 1.1 * Settings.TEXT_SIZE);

    if (this.performanceMeter) 
      this.performanceMeter.append(new Date().getTime(), this.Circuit.lastFrameTime);

    this.drawScopes();
    this.drawComponents();

    this.renderer.drawInfoText(this.highlightedComponent);

    if (this.highlightedNode)
      this.renderer.drawCircle(this.highlightedNode.x + 0.5, this.highlightedNode.y + 0.5, 7, 3, '#0F0');

    if (this.selectedNode)
      this.renderer.drawRect(this.selectedNode.x - 10 + 0.5, this.selectedNode.y - 10 + 0.5, 21, 21, 1, '#0FF');

    if (this.placeComponent) {
      this.context.fillText(`Placing ${this.placeComponent.constructor.name}`, this.snapX + 10, this.snapY + 10);

      if (this.placeY && this.placeX && this.placeComponent.x2() && this.placeComponent.y2())
        this.drawComponent(this.placeComponent);
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
      this.renderer.drawDebugInfo(this);
      this.renderer.drawDebugOverlay(this.circuit);
    }

    if (this.marquee)
      this.marquee.draw(this.renderer);

    this.context.restore()
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

  drawComponent(component) {
    if (component && this.selectedComponents.includes(component)) {
      this.renderer.drawBoldLines();
      component.draw(this.renderer);
    }

    this.renderer.drawDefaultLines();

    // Main entry point to draw component
    component.draw(this.renderer);
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
