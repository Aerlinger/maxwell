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

let Scope = require('./circuit/components/Scope.js');



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

    if ((this.x1 != null) && (this.x2 != null) && (this.y1 != null) && (this.y2 != null)) {
      renderContext.drawLine(this.x1, this.y1, this.x2, this.y1, "#FFFF00", 0);
      renderContext.drawLine(this.x1, this.y2, this.x2, this.y2, "#FFFF00", 1);

      renderContext.drawLine(this.x1, this.y1, this.x1, this.y2, "#FFFF00", 1);
      renderContext.drawLine(this.x2, this.y1, this.x2, this.y2, "#FFFF00", 1);
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

    this.STATE_EDIT;
    this.STATE_PLACE;
    this.STATE_RUN;

    this.MOUSEDOWN = 1;
  }

  constructor(Circuit, Canvas) {
    super();

    this.Circuit = Circuit;
    this.Canvas = Canvas;

    // TODO: Extract to param
    this.xMargin = 260;
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

    this.placeX = null;
    this.placeY = null;

    this.state = this.STATE_RUN;

    this.config = {
      keyboard: true
    };

    this.CircuitCanvas = new CircuitCanvas(Circuit, this);

    this.context = this.CircuitCanvas.context;

    this.Canvas.addEventListener('mousemove', this.mousemove);
    this.Canvas.addEventListener('mousedown', this.mousedown);
    this.Canvas.addEventListener('mouseup', this.mouseup);

    // Callbacks
    this.onSelectionChanged = this.noop;
    this.onComponentClick = this.noop;
    this.onComponentHover = this.noop;
    this.onNodeHover = this.noop;
    this.onNodeClick = this.noop;   // @onNodeClick(component)
    this.onUpdateComplete = this.noop;  // @onUpdateComplete(circuit)
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

    // Handle Marquee
    if (this.marquee) {
      this.marquee.reposition(x, y);

      this.selectedComponents = [];

      for (let component of this.Circuit.getElements()) {
        if (this.marquee.collidesWithComponent(component)) {
          this.selectedComponents.push(component);
          this.onSelectionChanged(this.selectedComponents);
        }
      }

    } else {
      this.previouslyHighlightedNode = this.highlightedNode;
      this.highlightedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);

      if (this.highlightedNode) {
        this.onNodeHover(this.highlightedNode);
      } else {
        // TODO: WIP for interactive element placing
        if (this.placeComponent) {
          this.placeComponent.setPoints();

          if (this.placeX && this.placeY) {
            this.placeComponent.point1.x = this.placeX;
            this.placeComponent.point1.y = this.placeY;

            this.placeComponent.point2.x = this.snapX;
            this.placeComponent.point2.y = this.snapY;
          }
          // if (this.placeComponent.x1() && this.placeComponent.y1()) {
            // console.log(this.snapX, this.lastX," ", this.snapY, this.lastY);
            // console.log(this.snapX - this.lastX," ", this.snapY - this.lastY);

            // this.placeComponent.point1.x = this.placeX;
            // this.placeComponent.point1.y = this.placeY;
          // }
        }

        for (let component of this.Circuit.getElements()) {
          if (component.getBoundingBox().contains(x, y)) {
            this.newlyHighlightedComponent = component;
          }
        }
      }

      if (this.previouslyHighlightedNode && !this.highlightedNode && this.onNodeUnhover) {
        this.onNodeUnhover(this.previouslyHighlightedNode);
      }

      if (this.selectedNode) {
        for (let element of this.selectedNode.getNeighboringElements()) {
          if (element) {
            // console.log(element);
            let post = element.getPostAt(this.selectedNode.x, this.selectedNode.y);
            if (post) {
              post.x = this.snapX;
              post.y = this.snapY;
            } else {
              console.warn("No post at", this.selectedNode.x, this.selectedNode.y);
            }

            element.recomputeBounds();
          }
        }

        this.selectedNode.x = this.snapX;
        this.selectedNode.y = this.snapY;
      }

      if (this.newlyHighlightedComponent) {
        if (this.newlyHighlightedComponent !== this.highlightedComponent) {
          this.highlightedComponent = this.newlyHighlightedComponent;


          if (this.onComponentHover)
            this.onComponentHover(this.highlightedComponent);

          this.notifyObservers(CircuitUI.ON_COMPONENT_HOVER, this.highlightedComponent);
        }

      } else {
        if (this.highlightedComponent && this.onComponentUnhover) {
          this.onComponentUnhover(this.highlightedComponent);
        }

        this.highlightedComponent = null;
      }
    }

    if (!this.marquee && !this.selectedNode && (this.selectedComponents && this.selectedComponents.length > 0) && (event.which === CircuitUI.MOUSEDOWN) && ((this.lastX !== this.snapX) || (this.lastY !== this.snapY))) {
      return (() => {
        let result = [];
        for (component of Array.from(this.selectedComponents)) {
          result.push(component.move(this.snapX - this.lastX, this.snapY - this.lastY));
        }
        return result;
      })();
    }
  }

  mousedown(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    // console.log(this.highlightedComponent, this.placeComponent, this.highlightedNode);

    if (this.placeComponent) {
      if (!this.placeX && !this.placeY) {
        this.placeX = this.snapX;
        this.placeY = this.snapY;
      } else {
        this.Circuit.solder(this.placeComponent);
        this.placeComponent = null;
        this.placeX = null;
        this.placeY = null;
      }
    }

    if (!this.highlightedComponent && !this.placeComponent && !this.highlightedNode) {
      if (this.selectedComponents && (this.selectedComponents.length > 0)) {
        this.onSelectionChanged([])
      }

      this.selectedComponents = [];

      this.marquee = new SelectionMarquee(x, y);
    }

    if (this.highlightedComponent) {
      this.selectedComponents = [this.highlightedComponent];
    }

    this.selectedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);

    if (this.selectedNode && this.onNodeClick) {
      this.onNodeClick(this.selectedNode);
    }

    return (() => {
      let result = [];
      for (var component of Array.from(this.Circuit.getElements())) {
        let item;
        if (component.getBoundingBox().contains(x, y)) {
          this.notifyObservers(CircuitUI.ON_COMPONENT_CLICKED, component);

          if (!Array.from(this.selectedComponents).includes(component)) {
            this.selectedComponents = [component];

            if (this.onSelectionChanged) {
              this.onSelectionChanged(this.selectedComponents);
            }
          }

          if (component.toggle) {
            component.toggle();
          }

          if (component.onclick) {
            component.onclick();
          }

          if (component.onComponentClick) {
            component.onComponentClick();
          }
        }
        result.push(item);
      }
      return result;
    })();
  }

  mouseup(event) {
    this.marquee = null;
    this.selectedNode = null;

    if (this.selectedComponents && this.selectedComponents.length > 0) {
      return this.notifyObservers(CircuitUI.ON_COMPONENTS_DESELECTED, this.selectedComponents);
    }
  }

  pause() {}
  play() {}
  restart() {}

  clearPlaceComponent() {
    return this.placeComponent = null;
  }

  getSelectedComponents() {
    return this.selectedComponents;
  }

  getPlaceComponent() {
    return this.placeComponent;
  }

  setPlaceComponent(componentName) {
    let klass = eval(componentName);

    this.placeComponent = new klass();

    return this.placeComponent;
  }

  remove(components) {
    console.log("components", components);
    return this.Circuit.destroy(components);
  }
}

CircuitUI.initClass();
module.exports = CircuitUI;
