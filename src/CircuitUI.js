let Rectangle = require('./geom/rectangle.js');
let CircuitCanvas = require('./CircuitCanvas.js');
let Observer = require('./util/observer');
let Util = require('./util/util');

let AntennaElm = require('./circuit/components/AntennaElm.js');
let WireElm = require('./circuit/components/WireElm.js');
let ResistorElm = require('./circuit/components/ResistorElm.js');
let GroundElm = require('./circuit/components/GroundElm.js');
let VoltageElm = require('./circuit/components/VoltageElm.js');
let DiodeElm = require('./circuit/components/DiodeElm.js');
let OutputElm = require('./circuit/components/OutputElm.js');
let SwitchElm = require('./circuit/components/SwitchElm.js');
let CapacitorElm = require('./circuit/components/CapacitorElm.js');
let InductorElm = require('./circuit/components/InductorElm.js');
let SparkGapElm = require('./circuit/components/SparkGapElm.js');
let CurrentElm = require('./circuit/components/CurrentElm.js');
let RailElm = require('./circuit/components/RailElm.js');
let MosfetElm = require('./circuit/components/MosfetElm.js');
let JfetElm = require('./circuit/components/JFetElm.js');
let TransistorElm = require('./circuit/components/TransistorElm.js');
let VarRailElm = require('./circuit/components/VarRailElm.js');
let OpAmpElm = require('./circuit/components/OpAmpElm.js');
let ZenerElm = require('./circuit/components/ZenerElm.js');
let Switch2Elm = require('./circuit/components/Switch2Elm.js');
let SweepElm = require('./circuit/components/SweepElm.js');
let TextElm = require('./circuit/components/TextElm.js');
let ProbeElm = require('./circuit/components/ProbeElm.js');

let AndGateElm = require('./circuit/components/AndGateElm.js');
let NandGateElm = require('./circuit/components/NandGateElm.js');
let OrGateElm = require('./circuit/components/OrGateElm.js');
let NorGateElm = require('./circuit/components/NorGateElm.js');
let XorGateElm = require('./circuit/components/XorGateElm.js');
let InverterElm = require('./circuit/components/InverterElm.js');

let LogicInputElm = require('./circuit/components/LogicInputElm.js');
let LogicOutputElm = require('./circuit/components/LogicOutputElm.js');
let AnalogSwitchElm = require('./circuit/components/AnalogSwitchElm.js');
let AnalogSwitch2Elm = require('./circuit/components/AnalogSwitch2Elm.js');
let MemristorElm = require('./circuit/components/MemristorElm.js');
let RelayElm = require('./circuit/components/RelayElm.js');
let TunnelDiodeElm = require('./circuit/components/TunnelDiodeElm.js');

let ScrElm = require('./circuit/components/SCRElm.js');
let TriodeElm = require('./circuit/components/TriodeElm.js');

let DecadeElm = require('./circuit/components/DecadeElm.js');
let LatchElm = require('./circuit/components/LatchElm.js');
let TimerElm = require('./circuit/components/TimerElm.js');
let JkFlipFlopElm = require('./circuit/components/JkFlipFlopElm.js');
let DFlipFlopElm = require('./circuit/components/DFlipFlopElm.js');
let CounterElm = require('./circuit/components/CounterElm.js');
let DacElm = require('./circuit/components/DacElm.js');
let AdcElm = require('./circuit/components/AdcElm.js');
let VcoElm = require('./circuit/components/VcoElm.js');
let PhaseCompElm = require('./circuit/components/PhaseCompElm.js');
let SevenSegElm = require('./circuit/components/SevenSegElm.js');
let CC2Elm = require('./circuit/components/CC2Elm.js');

let TransLineElm = require('./circuit/components/TransLineElm.js');

let TransformerElm = require('./circuit/components/TransformerElm.js');
let TappedTransformerElm = require('./circuit/components/TappedTransformerElm.js');

let LedElm = require('./circuit/components/LedElm.js');
let PotElm = require('./circuit/components/PotElm.js');
let ClockElm = require('./circuit/components/ClockElm.js');

let Scope = require('./circuit/Scope.js');

class SelectionMarquee extends Rectangle {
  constructor(x1, y1) {
    super();

    this.x1 = x1;
    this.y1 = y1;
  }

  reposition(x, y) {
    let _x1 = Math.min(x, this.x1);
    let _x2 = Math.max(x, this.x1);
    let _y1 = Math.min(y, this.y1);
    let _y2 = Math.max(y, this.y1);

    this.x2 = _x2;
    this.y2 = _y2;

    this.x = this.x1 = _x1;
    this.y = this.y1 = _y1;

    this.width = _x2 - _x1;
    this.height = _y2 - _y1;
  }

  draw(renderContext) {
    renderContext.lineWidth = 0.1;

    let lineShift = 0.5;

    if ((this.x1 != null) && (this.x2 != null) && (this.y1 != null) && (this.y2 != null)) {
      renderContext.drawLine(this.x1 + lineShift, this.y1 + lineShift, this.x2 + lineShift, this.y1 + lineShift, "#FFFF00", 0);
      renderContext.drawLine(this.x1 + lineShift, this.y2 + lineShift, this.x2 + lineShift, this.y2 + lineShift, "#FFFF00", 1);

      renderContext.drawLine(this.x1 + lineShift, this.y1 + lineShift, this.x1 + lineShift, this.y2 + lineShift, "#FFFF00", 1);
      renderContext.drawLine(this.x2 + lineShift, this.y1 + lineShift, this.x2 + lineShift, this.y2 + lineShift, "#FFFF00", 1);
    }
  }
}

class CircuitUI extends Observer {
  static initClass() {
    this.ON_COMPONENT_HOVER = "ON_COMPONENT_HOVER";
    this.ON_COMPONENT_CLICKED = "ON_COMPONENT_CLICKED";
    this.ON_COMPONENTS_SELECTED = "ON_COMPONENTS_SELECTED";
    this.ON_COMPONENTS_DESELECTED = "ON_COMPONENTS_DESELECTED";
    this.ON_COMPONENTS_MOVED = "ON_COMPONENTS_MOVED";

    this.MOUSEDOWN = 1;
  }

  constructor(Circuit, Canvas) {
    super();

    this.Circuit = Circuit;
    this.Canvas = Canvas;

    // TODO: Extract to param
    this.xMargin = 200;
    this.yMargin = 56;

    this.mousemove = this.mousemove.bind(this);
    this.mousedown = this.mousedown.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.highlightedComponent = null;
    this.selectedNode = null;
    this.selectedComponents = [];

    // TODO: Width and height are currently undefined
    this.width = this.Canvas.width;
    this.height = this.Canvas.height;

    this.previouslySelectedComponents = [];

    this.placeX = null;
    this.placeY = null;

    this.config = {
      keyboard: true
    };

    this.CircuitCanvas = new CircuitCanvas(Circuit, this);

    this.context = this.CircuitCanvas.context;
    this.isDragging = false;

    this.Canvas.addEventListener('mousemove', this.mousemove);
    this.Canvas.addEventListener('mousedown', this.mousedown);
    this.Canvas.addEventListener('mouseup', this.mouseup);

    // Callbacks
    this.onSelectionChanged = this.noop;
    this.onComponentClick = this.noop;
    this.onComponentHover = this.noop;
    this.onNodeHover = this.noop;
    this.onNodeClick = this.noop;
    this.onUpdateComplete = this.noop;
  }

  noop() {
  }

  mousemove(event) {
    let component;
    let x = event.offsetX - this.xMargin;
    let y = event.offsetY - this.yMargin;

    this.newlyHighlightedComponent = null;

    this.lastX = this.snapX;
    this.lastY = this.snapY;

    this.snapX = Util.snapGrid(x);
    this.snapY = Util.snapGrid(y);

    // TODO: WIP for interactive element placing
    if (this.placeComponent) {
      this.placeComponent.setPoints();

      if (this.placeX && this.placeY) {
        this.placeComponent.point1.x = this.placeX;
        this.placeComponent.point1.y = this.placeY;

        this.placeComponent.point2.x = this.snapX;
        this.placeComponent.point2.y = this.snapY;

        this.placeComponent.place();
      }
    } else {

      // Update marquee
      if (this.marquee) {
        this.marquee.reposition(x, y);
        this.allSelectedComponents = [];

        //this.selectedComponents = [];

        for (let component of this.Circuit.getElements()) {
          if (this.marquee.collidesWithComponent(component)) {
            this.allSelectedComponents.push(component);

            /*
            if (this.selectedComponents.indexOf(component) < 0) {
              this.selectedComponents.push(component);
              this.onSelectionChanged(this.selectedComponents);
            }
            */
          }
        }

        // UPDATE MARQUEE SELECTION
        // TODO OPTIMIZE
        if (this.allSelectedComponents.length != this.previouslySelectedComponents.length) {
          let newlySelectedComponents = [];
          let newlyUnselectedComponents = [];

          for (let currentlySelectedComponent of this.allSelectedComponents)
            if (this.previouslySelectedComponents.indexOf(currentlySelectedComponent) < 0)
              newlySelectedComponents.push(currentlySelectedComponent);

          for (let previouslySelectedComponent of this.previouslySelectedComponents)
            if (this.allSelectedComponents.indexOf(previouslySelectedComponent) < 0)
              newlyUnselectedComponents.push(previouslySelectedComponent);


          if (newlySelectedComponents.length > 0 || newlyUnselectedComponents.length > 0) {
            this.onSelectionChanged({
              selection: this.allSelectedComponents,
              added: newlySelectedComponents,
              removed: newlyUnselectedComponents
            })
          }
        }

        this.selectedComponents = this.allSelectedComponents;
        this.previouslySelectedComponents = this.allSelectedComponents;


        // Update highlighted node
      } else {
        this.previouslyHighlightedNode = this.highlightedNode;
        this.highlightedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);

        if (this.highlightedNode) {

          if (!this.selectedNode && this.previouslyHighlightedNode != this.highlightedNode)
            this.onNodeHover(this.highlightedNode);

        } else {

          for (let component of this.Circuit.getElements()) {
            if (component.getBoundingBox().contains(x, y)) {
              this.newlyHighlightedComponent = component;
            }
          }
        }

        if (!this.selectedNode && this.previouslyHighlightedNode && !this.highlightedNode && this.onNodeUnhover)
          this.onNodeUnhover(this.previouslyHighlightedNode);

        if (this.selectedNode) {
          for (let element of this.selectedNode.getNeighboringElements()) {
            if (element) {
              // console.log(element);
              let post = element.getPostAt(this.selectedNode.x, this.selectedNode.y);
              if (post) {
                post.x = this.snapX;
                post.y = this.snapY;

                element.place()
              } else {
                console.warn("No post at", this.selectedNode.x, this.selectedNode.y);
              }

              element.recomputeBounds();
            }
          }

          this.lastNodeX = this.selectedNode.x;
          this.lastNodeY = this.selectedNode.y;

          this.selectedNode.x = this.snapX;
          this.selectedNode.y = this.snapY;

          if (this.onNodeDrag && ((this.lastNodeX != this.selectedNode.x) || (this.lastNodeY != this.selectedNode.y))) {
            this.onNodeDrag(this.selectedNode);

            this.lastNodeX = this.selectedNode.x;
            this.lastNodeY = this.selectedNode.y;
          }
        } else {

          // COMPONENT HOVER/UNHOVER EVENT
          if (this.newlyHighlightedComponent) {
            if (this.newlyHighlightedComponent !== this.highlightedComponent) {
              this.highlightedComponent = this.newlyHighlightedComponent;

              if (this.onComponentHover && !this.isDragging)
                this.onComponentHover(this.highlightedComponent);

              this.notifyObservers(CircuitUI.ON_COMPONENT_HOVER, this.highlightedComponent);
            }

          } else {
            if (this.highlightedComponent && this.onComponentUnhover && !this.isDragging)
              this.onComponentUnhover(this.highlightedComponent);

            this.highlightedComponent = null;
          }
        }
      }
    }

    // Move components
    if (!this.marquee && !this.isPlacingComponent() && !this.selectedNode && (this.selectedComponents && this.selectedComponents.length > 0) && (event.which === CircuitUI.MOUSEDOWN) && ((this.lastX !== this.snapX) || (this.lastY !== this.snapY))) {
      this.isDragging = true;
      if (this.onComponentsDrag)
        this.onComponentsDrag(this.selectedComponents);

      for (let component of Array.from(this.selectedComponents)) {
        component.move(this.snapX - this.lastX, this.snapY - this.lastY);
      }
    }
  }

  mousedown(event) {
    let x = event.offsetX - this.xMargin;
    let y = event.offsetY - this.yMargin;

    if (this.placeComponent) {
      if (!this.placeX && !this.placeY) {

        // Place the first post
        this.placeX = this.snapX;
        this.placeY = this.snapY;
      } else {

        // Place the component
        this.Circuit.solder(this.placeComponent);

        this.placeComponent.place();
        this.placeComponent = null;
        this.placeX = null;
        this.placeY = null;
      }
    } else {

      if (!this.highlightedComponent && !this.placeComponent && !this.highlightedNode) {
        this.marquee = new SelectionMarquee(x, y);
      }

      if (this.highlightedComponent) {
        if (this.selectedComponents.length > 1 || this.selectedComponents.indexOf(this.highlightedComponent) < 0) {
          let added = (this.selectedComponents.indexOf(this.highlightedComponent) < 0) ? [this.highlightedComponent] : [];
          let removed = (this.selectedComponents.indexOf(this.highlightedComponent) < 0) ? [] : [this.highlightedComponent];

          this.onSelectionChanged({
            selection: [this.highlightedComponent],
            added: added,
            removed: removed
          });

          this.selectedComponents = [this.highlightedComponent];
        }
      }

      this.selectedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);

      if (this.selectedNode && this.onNodeClick)
        this.onNodeClick(this.selectedNode);

      for (let component of this.Circuit.getElements()) {
        if (component.getBoundingBox().contains(x, y)) {
          this.notifyObservers(CircuitUI.ON_COMPONENT_CLICKED, component);

          if (this.onComponentClick)
            this.onComponentClick(component);

          if (component.toggle)
            component.toggle();

          if (component.onclick)
            component.onclick();

          if (component.onComponentClick)
            component.onComponentClick();
        }
      }
    }
  }

  mouseup(event) {
    this.marquee = null;
    this.selectedNode = null;
    this.isDragging = false;

    if (this.selectedComponents && this.selectedComponents.length > 0) {
      this.notifyObservers(CircuitUI.ON_COMPONENTS_DESELECTED, this.selectedComponents);
    }
  }

  togglePause() {
    if (this.Circuit.isStopped)
      this.Circuit.resume();
    else
      this.Circuit.pause();
  }

  pause() {
  }

  play() {
  }

  restart() {
  }

  isPlacingComponent() {
    return !!this.placeComponent;
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
        added:[],
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
    console.log("components", components);
    return this.Circuit.destroy(components);
  }
}

CircuitUI.initClass();
module.exports = CircuitUI;
