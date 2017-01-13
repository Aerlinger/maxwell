let BaseRenderer = require('./BaseRenderer.js');
let Circuit = require('../circuit/circuit.js');
let CircuitComponent = require('../circuit/circuitComponent.js');
let ComponentRegistry = require('../circuit/componentRegistry.js');
let Settings = require('../settings/settings.js');
let Rectangle = require('../geom/rectangle.js');
let Polygon = require('../geom/polygon.js');
let Point = require('../geom/point.js');
let Util = require('../util/util.js');
let environment = require('../environment.js');

let AntennaElm = require('../circuit/components/AntennaElm.js');
let WireElm = require('../circuit/components/WireElm.js');
let ResistorElm = require('../circuit/components/ResistorElm.js');
let GroundElm = require('../circuit/components/GroundElm.js');
let VoltageElm = require('../circuit/components/VoltageElm.js');
let DiodeElm = require('../circuit/components/DiodeElm.js');
let OutputElm = require('../circuit/components/OutputElm.js');
let SwitchElm = require('../circuit/components/SwitchElm.js');
let CapacitorElm = require('../circuit/components/CapacitorElm.js');
let InductorElm = require('../circuit/components/InductorElm.js');
let SparkGapElm = require('../circuit/components/SparkGapElm.js');
let CurrentElm = require('../circuit/components/CurrentElm.js');
let RailElm = require('../circuit/components/RailElm.js');
let MosfetElm = require('../circuit/components/MosfetElm.js');
let JfetElm = require('../circuit/components/JFetElm.js');
let TransistorElm = require('../circuit/components/TransistorElm.js');
let VarRailElm = require('../circuit/components/VarRailElm.js');
let OpAmpElm = require('../circuit/components/OpAmpElm.js');
let ZenerElm = require('../circuit/components/ZenerElm.js');
let Switch2Elm = require('../circuit/components/Switch2Elm.js');
let SweepElm = require('../circuit/components/SweepElm.js');
let TextElm = require('../circuit/components/TextElm.js');
let ProbeElm = require('../circuit/components/ProbeElm.js');

let AndGateElm = require('../circuit/components/AndGateElm.js');
let NandGateElm = require('../circuit/components/NandGateElm.js');
let OrGateElm = require('../circuit/components/OrGateElm.js');
let NorGateElm = require('../circuit/components/NorGateElm.js');
let XorGateElm = require('../circuit/components/XorGateElm.js');
let InverterElm = require('../circuit/components/InverterElm.js');

let LogicInputElm = require('../circuit/components/LogicInputElm.js');
let LogicOutputElm = require('../circuit/components/LogicOutputElm.js');
let AnalogSwitchElm = require('../circuit/components/AnalogSwitchElm.js');
let AnalogSwitch2Elm = require('../circuit/components/AnalogSwitch2Elm.js');
let MemristorElm = require('../circuit/components/MemristorElm.js');
let RelayElm = require('../circuit/components/RelayElm.js');
let TunnelDiodeElm = require('../circuit/components/TunnelDiodeElm.js');

let ScrElm = require('../circuit/components/SCRElm.js');
let TriodeElm = require('../circuit/components/TriodeElm.js');

let DecadeElm = require('../circuit/components/DecadeElm.js');
let LatchElm = require('../circuit/components/LatchElm.js');
let TimerElm = require('../circuit/components/TimerElm.js');
let JkFlipFlopElm = require('../circuit/components/JKFlipFlopElm.js');
let DFlipFlopElm = require('../circuit/components/DFlipFlopElm.js');
let CounterElm = require('../circuit/components/CounterElm.js');
let DacElm = require('../circuit/components/DacElm.js');
let AdcElm = require('../circuit/components/AdcElm.js');
let VcoElm = require('../circuit/components/VcoElm.js');
let PhaseCompElm = require('../circuit/components/PhaseCompElm.js');
let SevenSegElm = require('../circuit/components/SevenSegElm.js');
let CC2Elm = require('../circuit/components/CC2Elm.js');

let TransLineElm = require('../circuit/components/TransLineElm.js');

let TransformerElm = require('../circuit/components/TransformerElm.js');
let TappedTransformerElm = require('../circuit/components/TappedTransformerElm.js');

let LedElm = require('../circuit/components/LedElm.js');
let PotElm = require('../circuit/components/PotElm.js');
let ClockElm = require('../circuit/components/ClockElm.js');

let Scope = require('../circuit/components/Scope.js');


class SelectionMarquee extends Rectangle {
  constructor(x1, y1) {
    super()

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
    return this.height = _y2 - _y1;
  }

  draw(renderContext) {
    renderContext.lineWidth = 0.1;

    if ((this.x1 != null) && (this.x2 != null) && (this.y1 != null) && (this.y2 != null)) {
      renderContext.drawLine(this.x1, this.y1, this.x2, this.y1, "#FFFF00", 1);
      renderContext.drawLine(this.x1, this.y2, this.x2, this.y2, "#FFFF00", 1);

      renderContext.drawLine(this.x1, this.y1, this.x1, this.y2, "#FFFF00", 1);
      return renderContext.drawLine(this.x2, this.y1, this.x2, this.y2, "#FFFF00", 1);
    }
  }
}


let MOUSEDOWN = undefined;
class Renderer extends BaseRenderer {
  static initClass() {
    this.ON_COMPONENT_HOVER = "ON_COMPONENT_HOVER";
    this.ON_COMPONENT_CLICKED = "ON_COMPONENT_CLICKED";
    this.ON_COMPONENTS_SELECTED = "ON_COMPONENTS_SELECTED";
    this.ON_COMPONENTS_DESELECTED = "ON_COMPONENTS_DESELECTED";
    this.ON_COMPONENTS_MOVED = "ON_COMPONENTS_MOVED";
  
    this.STATE_EDIT;
    this.STATE_PLACE;
    this.STATE_RUN;
  
    MOUSEDOWN = 1;
  }

  constructor(Circuit1, Canvas) {
    super();

    this.Circuit = Circuit1;
    this.Canvas = Canvas;

    this.mousemove = this.mousemove.bind(this);
    this.mousedown = this.mousedown.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.draw = this.draw.bind(this);
    this.drawDots = this.drawDots.bind(this);
    this.highlightedComponent = null;
    this.addComponent = null;
    this.selectedNode = null;
    this.selectedComponents = [];

    // TODO: Width and height are currently undefined
    this.width = this.Canvas.width;
    this.height = this.Canvas.height;

    this.state = this.STATE_RUN;

    this.config = {
      keyboard: true
    };

    if (environment.isBrowser) {
      this.context = Sketch.augment(this.Canvas.getContext("2d"), {
        draw: this.draw,
        mousemove: this.mousemove,
        mousedown: this.mousedown,
        mouseup: this.mouseup,
        fullscreen: false,
        width: this.width,
        height: this.height
      });

      this.context.lineJoin = 'miter';
    }

    // Callbacks
    this.onSelectionChanged = null;
    this.onComponentClick = null;
    this.onComponentHover = null;
    this.onNodeHover = null;
    this.onNodeClick = null;   // @onNodeClick(component)
    this.onUpdateComplete = null;  // @onUpdateComplete(circuit)
  }
//
    //@setPlaceComponent("ResistorElm")

    // @Circuit.addObserver Circuit.ON_START_UPDATE, @clear
    // @Circuit.addObserver Circuit.ON_RESET, @clear
    // @Circuit.addObserver Circuit.ON_END_UPDATE, @clear

  getSelectedComponents() {
    return this.selectedComponents;
  }

  getPlaceComponent() {
    return this.placeComponent;
  }

  pause() {}
  play() {}
  restart() {}

  clearPlaceComponent() {
    return this.placeComponent = null;
  }

  setPlaceComponent(componentName) {
    let klass = eval(componentName);

    this.placeComponent = new klass(100, 100, 100, 200);

    // console.log(componentName, "default params:", this.placeComponent.params);

    return this.placeComponent;
  }

  remove(components) {
    console.log("components", components);
    return this.Circuit.destroy(components);
  }

  mousemove(event) {
    let component;
    let x = event.offsetX;
    let y = event.offsetY;

    this.newlyHighlightedComponent = null;

    this.lastX = this.snapX;
    this.lastY = this.snapY;

    this.snapX = Util.snapGrid(x);
    this.snapY = Util.snapGrid(y);

    if (this.marquee != null) {
      __guard__(this.marquee, x1 => x1.reposition(x, y));
      this.selectedComponents = [];

      for (component of Array.from(this.Circuit.getElements())) {
        if (__guard__(this.marquee, x2 => x2.collidesWithComponent(component))) {
          this.selectedComponents.push(component);
          __guardMethod__(this, 'onSelectionChanged', o => o.onSelectionChanged(this.selectedComponents));
        }
      }

    } else {
      this.previouslyHighlightedNode = this.highlightedNode;
      this.highlightedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);

      if (this.highlightedNode) {
        __guardMethod__(this, 'onNodeHover', o1 => o1.onNodeHover(this.highlightedNode));

      } else {
        // TODO: WIP for interactive element placing
        if (this.placeComponent) {
          this.placeComponent.setPoints();
          if (this.placeComponent.x1() && this.placeComponent.y1()) {
            console.log(this.snapX, this.lastX," ", this.snapY, this.lastY);
            console.log(this.snapX - this.lastX," ", this.snapY - this.lastY);

            this.placeComponent.moveTo(this.snapX, this.snapY);
          }
        }

        for (component of Array.from(this.Circuit.getElements())) {
          if (component.getBoundingBox().contains(x, y)) {
            this.newlyHighlightedComponent = component;
          }
        }
      }

      if (this.previouslyHighlightedNode && !this.highlightedNode) {
        __guardMethod__(this, 'onNodeUnhover', o2 => o2.onNodeUnhover(this.previouslyHighlightedNode));
      }

      if (this.selectedNode) {
        for (let element of Array.from(this.selectedNode.getNeighboringElements())) {
          if (element) {
            console.log(element);
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
          __guardMethod__(this, 'onComponentHover', o3 => o3.onComponentHover(this.highlightedComponent));
          this.notifyObservers(Renderer.ON_COMPONENT_HOVER, this.highlightedComponent);
        }

      } else {
        if (this.highlightedComponent) {
          __guardMethod__(this, 'onComponentUnhover', o4 => o4.onComponentUnhover(this.highlightedComponent));
        }

        this.highlightedComponent = null;
      }
    }

    if (!this.marquee && !this.selectedNode && (__guard__(this.selectedComponents, x3 => x3.length) > 0) && (event.which === MOUSEDOWN) && ((this.lastX !== this.snapX) || (this.lastY !== this.snapY))) {
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

    console.log(this.highlightedComponent, this.placeComponent, this.highlightedNode);

    if (this.placeComponent) {
      this.Circuit.solder(this.placeComponent);
      this.placeComponent = null;
    }

    if (!this.highlightedComponent && !this.placeComponent && !this.highlightedNode) {
      if (this.selectedComponents && (this.selectedComponents.length > 0)) {
        __guardMethod__(this, 'onSelectionChanged', o => o.onSelectionChanged([]));
      }

      this.selectedComponents = [];

      this.marquee = new SelectionMarquee(x, y);
    }

    this.selectedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);

    if (this.selectedNode) {
      __guardMethod__(this, 'onNodeClick', o1 => o1.onNodeClick(this.selectedNode));
    }

    return (() => {
      let result = [];
      for (var component of Array.from(this.Circuit.getElements())) {
        let item;
        if (component.getBoundingBox().contains(x, y)) {
          this.notifyObservers(Renderer.ON_COMPONENT_CLICKED, component);

          if (!Array.from(this.selectedComponents).includes(component)) {
            this.selectedComponents = [component];
            __guardMethod__(this, 'onSelectionChanged', o2 => o2.onSelectionChanged(this.selectedComponents));
          }

          __guardMethod__(component, 'toggle', o3 => o3.toggle());
          __guardMethod__(component, 'onclick', o4 => o4.onclick());

          item = __guardMethod__(this, 'onComponentClick', o5 => o5.onComponentClick(component));
        }
        result.push(item);
      }
      return result;
    })();
  }

  mouseup(event) {
    this.marquee = null;
    this.selectedNode = null;

    if (__guard__(this.selectedComponents, x => x.length) > 0) {
      return this.notifyObservers(Renderer.ON_COMPONENTS_DESELECTED, this.selectedComponents);
    }
  }


  draw() {
    if ((this.snapX != null) && (this.snapY != null)) {
      this.drawCircle(this.snapX, this.snapY, 1, "#F00");
    }

    this.drawInfoText();
    __guard__(this.marquee, x => x.draw(this));

    // UPDATE FRAME ----------------------------------------------------------------
    this.Circuit.updateCircuit();
    __guardMethod__(this, 'onUpdateComplete', o => o.onUpdateComplete(this));
    // -----------------------------------------------------------------------------

    this.drawComponents();

    if (this.context) {
      if (this.placeComponent) {
        this.context.fillText(`Placing ${this.placeComponent.constructor.name}`, this.snapX, this.snapY);

        if (this.placeComponent.x1() && this.placeComponent.x2()) {
          this.drawComponent(this.placeComponent);
        }
      }

      if (this.selectedNode) {
        this.drawCircle(this.selectedNode.x, this.selectedNode.y, Settings.POST_RADIUS + 3, 3, Settings.HIGHLIGHT_COLOR);
      }

      if (this.highlightedComponent) {
        this.drawCircle(this.highlightedComponent.x1(), this.highlightedComponent.y1(), Settings.POST_RADIUS + 2, 2, Settings.HIGHLIGHT_COLOR);
        this.drawCircle(this.highlightedComponent.x2(), this.highlightedComponent.y2(), Settings.POST_RADIUS + 2, 2, Settings.HIGHLIGHT_COLOR);
      }
    }

    if (CircuitComponent.DEBUG) {
      let node;
      return __range__(0, this.Circuit.numNodes(), false).map((nodeIdx) =>
        (node = this.Circuit.getNode(nodeIdx),
        this.fillText(`${nodeIdx} ${node.x},${node.y}`, node.x + 5, node.y - 5)));
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

  drawBoldLines() {
    return this.boldLines = true;
  }

  drawDefaultLines() {
    return this.boldLines = false;
  }

  drawComponent(component) {
    if (component && Array.from(this.selectedComponents).includes(component)) {
      this.drawBoldLines();
      for (let i = 0, end = component.getPostCount(), asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        let post = component.getPost(i);
        this.drawCircle(post.x, post.y, Settings.POST_RADIUS + 2, 2, Settings.SELECT_COLOR);
      }

    } else {
      this.drawDefaultLines();
    }

    // Main entry point to draw component
    return component.draw(this);
  }


  drawInfoText() {
    if (this.highlightedComponent != null) {
      let arr = [];
      this.highlightedComponent.getInfo(arr);

      return __range__(0, arr.length, false).map((idx) =>
        this.context.fillText(arr[idx], 500, (idx * 10) + 15));
    }
  }

  drawValue(perpindicularOffset, parallelOffset, component, text, rotation) {
    let x, y;
    if (text == null) { text = null; }
    if (rotation == null) { rotation = 0; }
    this.context.save();
    this.context.textAlign = "center";

    this.context.font = "7pt Courier";

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
}
Renderer.initClass();


module.exports = Renderer;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
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