// #######################################################################
// CircuitComponent:
//   Base class from which all components inherit
//
// @author Anthony Erlinger
// @year 2012
//
// Uses the Observer Design Pattern:
//   Observes: Circuit, CircuitRender
//   Observed By: CircuitCanvas
//
// Events:
//  <None>
//
// #######################################################################

let Settings = require('../settings/settings.js');
let Rectangle = require('../geom/rectangle.js');
let Point = require('../geom/point.js');
let Util = require('../util/util.js');
let debug = require('debug')('circuitComponent');

let _ = require("lodash");

let { sprintf } = require("sprintf-js");

class CircuitComponent {

  static get Fields() {
    return {}
  }

  static initClass() {
    this.DEBUG = false;
  }

  constructor(x1, y1, x2, y2, params, f) {
    if (f == null) { f = 0; }
    this.current = 0;
    this.flags = f || 0;

    this.voltSource = 0;
    this.noDiagonal = false;
    this.Circuit = null;

    this.component_id = Util.getRand(100000000) + (new Date()).getTime();

    this.setParameters(params);

    this.setPoints(x1, y1, x2, y2);
    this.allocNodes();
  }

  allocNodes() {
    // console.log("this.getPostCount()", this.getPostCount(), "this.getInternalNodeCount()", this.getInternalNodeCount())

    this.nodes = Util.zeroArray(this.getPostCount() + this.getInternalNodeCount());
    return this.volts = Util.zeroArray(this.getPostCount() + this.getInternalNodeCount());
  }

  setParameters(component_params) {
    if (component_params && (component_params.constructor === Array)) {
      component_params = this.convertParamsToHash(component_params);
    }

    let { Fields } = this.constructor;

    this.params = this.params || {};

    for (let param_name in Fields) {
      let definition = Fields[param_name];
      let { default_value } = definition;
      let { data_type } = definition;

      if (!Util.isFunction(data_type)) {
        console.error("data_type must be a function");
      }

      // Parameter exists in our Fields attribute table...
      if (component_params && (param_name in component_params)) {
        let param_value = data_type(component_params[param_name]);

        this.setValue(param_name, param_value);

        delete component_params[param_name];

      // fallback to default value assigned in @Fields
      } else {
//        console.log("Assigning default value of #{default_value} for #{param_name} in #{@constructor.name} (was #{this[param_name]})")

        if (!this[param_name]) { this[param_name] = data_type(default_value); }
        this.params[param_name] = this[param_name];

        if ((this[param_name] === null) || (this[param_name] === undefined) || isNaN(this[param_name])) {
          debug(`Parameter ${param_name} is unset: ${this[param_name]}!`);
        }
      }
    }

    let unmatched_params = ((() => {
      let result = [];
      for (let param in component_params) {
        result.push(param);
      }
      return result;
    })());

    if (unmatched_params.length > 0) {
      console.error(`The following parameters ${unmatched_params.join(" ")} do not belong in ${this}`);
      throw new Error(`Invalid params ${unmatched_params.join(" ")} assigned to ${this}`);
    }
  }


  // Convert list of parameters to a hash, according to matching order in @Fields
  convertParamsToHash(param_list) {
    let { Fields } = this.constructor;
    let result = {};

    for (let i = 0, end = param_list.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      var data_type;
      let param_name = Object.keys(Fields)[i];
      let param_value = param_list[i];

      if (Fields[param_name]) {
        ({ data_type } = Fields[param_name]);
      } else {
        console.warn(`Failed to load data_type ${data_type}: ${param_name}: ${param_value}`);
        console.log(param_value);
        console.log(`${i}: param_name ${Fields}`);
      }

      if (!data_type) {
        console.warn(`No conversion found for ${data_type}`);
      }

      if (!Util.isFunction(data_type)) {
        console.error(`data_type ${data_type} is not a function!`);
      }

      result[param_name] = param_value;
    }

    return result;
  }

  getParentCircuit() {
    return this.Circuit;
  }

  setx1(value) {
    return this.point1.x = value;
  }
    
  sety1(value) {
    return this.point1.y = value;
  }
  
  setx2(value) {
    return this.point2.x = value;
  }
    
  sety2(value) {
    return this.point2.y = value;
  }
  
    
  x1() {
    return this.point1.x;
  }

  y1() {
    return this.point1.y;
  }
    
  x2() {
    return this.point2.x;
  }

  y2() {
    return this.point2.y;
  }
    
  dx() {
    return this.point2.x - this.point1.x;
  }

  dy() {
    return this.point2.y - this.point1.y;
  }

  dn() {
    return Math.sqrt((this.dx() * this.dx()) + (this.dy() * this.dy()));
  }

  dpx1() {
    return this.dy() / this.dn();
  }

  dpy1() {
    return -this.dx() / this.dn();
  }

  dsign() {
    if (this.dy() === 0)
      return Math.sign(this.dx())
    else
      return Math.sign(this.dy())
  }

  setPoints(x1, y1, x2, y2) {
    //    @dx() = x2 - x1
    //    @dy() = y2 - y1

    //    @dn() = Math.sqrt(@dx() * @dx() + @dy() * @dy())
    //    @length = Math.sqrt(@dx() * @dx() + @dy() * @dy())
    //    @@dpx1() = @dy() / @dn()
    //    @dpy1 = -@dx() / @dn()

    //    @dsign() = (if (@dy() is 0) then Math.sign(@dx()) else Math.sign(@dy()))
    // console.log("x1", x1, "y1", y1)

    if (!this.point1) { this.point1 = new Point(x1, y1); }
    if (!this.point2) { this.point2 = new Point(x2, y2); }

    return this.recomputeBounds();
  }

//    console.log("c", @point1.x)

  unitText() {
    return "?";
  }

  height() {
    return Math.abs(this.point2.y - this.point1.y);
  }

  width() {
    return Math.abs(this.point2.x - this.point1.x);
  }

  axisAligned() {
    return (this.height() === 0) || (this.width() === 0);
  }

  setPowerColor(color) {
    return console.warn("Set power color not yet implemented");
  }

  getDumpType() {
    return 0;
  }

  reset() {
    this.volts = Util.zeroArray(this.volts.length);
    return this.curcount = 0;
  }

  setCurrent(x, current) {
    return this.current = current;
  }

  getCurrent() {
    return this.current;
  }

  getVoltageDiff() {
    return this.volts[0] - this.volts[1];
  }

  getPower() {
    return this.getVoltageDiff() * this.getCurrent();
  }

  calculateCurrent() {}
    // To be implemented by subclasses

  doStep() {}
    // To be implemented by subclasses

  orphaned() {
    return (this.Circuit === null) || (this.Circuit === undefined);
  }

  destroy() {
    return this.Circuit.desolder(this);
  }

  dump() {
    let tidyVoltage = Util.tidyFloat(this.getVoltageDiff());
    let tidyCurrent = Util.tidyFloat(this.getCurrent());

    let paramStr = ((() => {
      let result = [];
      for (let key in this.params) {
        let val = this.params[key];
        result.push(val);
      }
      return result;
    })()).join(" ");

    return `[v ${tidyVoltage}, i ${tidyCurrent}]\t${this.getDumpType()} ${this.point1.x} ${this.point1.y} ${this.point2.x} ${this.point2.y}`;
  }

  startIteration() {}
    // Called on reactive elements such as inductors and capacitors.

  getPostAt(x, y) {
    for (let postIdx = 0, end = this.getPostCount(), asc = 0 <= end; asc ? postIdx < end : postIdx > end; asc ? postIdx++ : postIdx--) {
      let post = this.getPost(postIdx);

      if ((post.x === x) && (post.y === y)) {
        return post;
      }
    }
  }

  getPostVoltage(post_idx) {
    return this.volts[post_idx];
  }

  setNodeVoltage(node_idx, voltage) {
    this.volts[node_idx] = voltage;
    return this.calculateCurrent();
  }

  calcLeads(len) {
    if ((this.dn() < len) || (len === 0)) {
      this.lead1 = this.point1;
      return this.lead2 = this.point2;
    } else {
      this.lead1 = Util.interpolate(this.point1, this.point2, (this.dn() - len) / (2 * this.dn()));
      return this.lead2 = Util.interpolate(this.point1, this.point2, (this.dn() + len) / (2 * this.dn()));
    }
  }

  isVertical() {
    return Math.abs(this.point1.x - this.point2.x) < 0.01;
  }

  getCenter() {
    let centerX = (this.point1.x + this.point2.x) / 2.0;
    let centerY = (this.point1.y + this.point2.y) / 2.0;

    return new Point(centerX, centerY);
  }

  equalTo(otherComponent) {
    return this.component_id === otherComponent.component_id;
  }

  drag(newX, newY) {
    newX = Util.snapGrid(newX);
    newY = Util.snapGrid(newY);

    if (this.noDiagonal) {
      if (Math.abs(this.point1.x - newX) < Math.abs(this.point1.y - newY)) {
        newX = this.point1.x;
      } else {
        newY = this.point1.y;
      }
    }

    this.point2.x = newX;
    return this.point2.y = newY;
  }

//    @setPoints()

  move(deltaX, deltaY) {
    this.point1.x += deltaX;
    this.point1.y += deltaY;
    this.point2.x += deltaX;
    this.point2.y += deltaY;

    this.recomputeBounds();

    if (this.getParentCircuit()) {
      this.getParentCircuit().invalidate();
    }

    return this.setPoints();
  }

  moveTo(x, y) {
    let deltaX = Util.snapGrid(x - this.getCenter().x);
    let deltaY = Util.snapGrid(y - this.getCenter().y);

    return this.move(deltaX, deltaY);
  }

  stamp() {
    return this.Circuit.halt(`Called abstract function stamp() in Circuit ${this.getDumpType()}`);
  }

  inspect() {
    let paramValues = ((() => {
      let result = [];
      for (let key in this.params) {
        let val = this.params[key];
        result.push(val);
      }
      return result;
    })());

    return {
      sym: this.getDumpType(),
      x1: this.point1.x,
      y1: this.point1.y,
      x2: this.point2.x,
      xy: this.point2.y,
      params: paramValues,
      voltage: this.getVoltageDiff(),
      current: this.getCurrent()
    };
  }

  toString() {
    //    "#{@constructor.name} #{@point1.x} #{@point1.y} #{@point2.x} #{@point2.y}"
    // return this.constructor.name;
    // if (this.params): ${JSON.stringify(this.params)}

    let paramStr = "";

    if (Object.keys(this.params).length !== 0)
      paramStr = `: ${JSON.stringify(this.params)}`;

    
    return `${this.constructor.name}@[${this.point1.x} ${this.point1.y} ${this.point2.x} ${this.point2.y}]` + paramStr;
  }

  getVoltageSourceCount() {
    return 0;
  }

  getInternalNodeCount() {
    return 0;
  }

  setNode(nodeIdx, newValue) {
    return this.nodes[nodeIdx] = newValue;
  }

  setVoltageSource(node, value) {
    return this.voltSource = value;
  }

  getVoltageSource() {
    return this.voltSource;
  }

  nonLinear() {
    return false;
  }

  // Two terminals by default, but likely to be overidden by subclasses
  getPostCount() {
    return 2;
  }

  getName() {
    console.warn(`getName() was called by circuitComponent base class, but should be extended by subclasses (${this.constructor.name})`)
    return `${this.constructor.name}@[${this.point1.x} ${this.point1.y} ${this.point2.x} ${this.point2.y}] : ${JSON.stringify(this.params)}`;
  }

  getNode(nodeIdx) {
    return this.nodes[nodeIdx];
  }

  getVoltageForNode(nodeIdx) {
    let subIdx = 0;

    for (let node of Array.from(this.nodes)) {
      if (node === nodeIdx) {
        return this.volts[subIdx];
      }

      subIdx++;
    }
  }

  getPost(postIdx) {
    if (postIdx === 0) {
      return this.point1;
    } else if (postIdx === 1) {
      return this.point2;
    }
  }

  recomputeBounds() {
    return this.setBbox(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
  }

  getBoundingBox() {
    return this.boundingBox;
  }

  setBbox(x1, y1, x2, y2) {
    let x = Math.min(x1, x2);
    let y = Math.min(y1, y2);
    let width = Math.max(Math.abs(x2 - x1), 3);
    let height = Math.max(Math.abs(y2 - y1), 3);
    
    let horizontalMargin = Math.floor(Math.abs(this.dpx1()));
    let verticalMargin = Math.floor(Math.abs(this.dpy1()));

    return this.boundingBox = new Rectangle(x - horizontalMargin, y - verticalMargin, width + 2*horizontalMargin, height + 2*verticalMargin);
  }

  setBboxPt(p1, p2, width) {
    let deltaX = (this.dpx1() * width);
    let deltaY = (this.dpy1() * width);

    return this.setBbox(p1.x - deltaX, p1.y - deltaY, p1.x + deltaX, p1.y + deltaY);
  }

// Extended by subclasses
  getInfo(arr) {
    return arr = new Array(15);
  }

// Extended by subclasses
  getBasicInfo(arr) {
    arr[1] = `I = ${Util.getUnitText(this.getCurrent(), "A")}`;
    arr[2] = `Vd = ${Util.getUnitText(this.getVoltageDiff(), "V")}`;
    return 3;
  }

  getScopeValue(x) {
    ((x === 1) ? this.getPower() : this.getVoltageDiff());
  }

  getScopeUnits(x) {
    if (x === 1) { return "W"; } else { return "V"; }
  }

  getConnection(n1, n2) {
    return true;
  }

  hasGroundConnection(n1) {
    return false;
  }

  isWire() {
    return false;
  }

  canViewInScope() {
    return this.getPostCount() <= 2;
  }

  needsShortcut() {
    return false;
  }

  /* *///###################################################################
// RENDERING METHODS
  /* *///###################################################################

  draw(renderContext) {
    let post;
    renderContext.drawRect(this.boundingBox.x-2, this.boundingBox.y-2, this.boundingBox.width+2, this.boundingBox.height+2, 0.5, "#8888CC");

//    renderContext.drawValue 10, -15, this, @constructor.name

    // renderContext.drawValue(12, -15 + (height * i), this, `${name}: ${value}`);

    renderContext.drawValue(-14, 0, this, this.toString());

    if (this.params) {
      let height = 8;
      let i = 0;
      for (let value = 0; value < this.params.length; value++) {
        let name = this.params[value];
        console.log(name, value);
        renderContext.drawValue(12, -15 + (height * i), this, `${name}: ${value}`);
        i += 1;
      }
    }

    let outlineRadius = 7;

//    nodeIdx = 0
//    for node in @nodes
//      if @point1 && @point2
//        renderContext.drawValue 25+10*nodeIdx, -10*nodeIdx, this, "#{node}-#{@getVoltageForNode(node)}"
//        nodeIdx += 1


    if (this.point1) {
      renderContext.drawCircle(this.point1.x, this.point1.y, outlineRadius-1, 1, 'rgba(0,0,255,0.7)');
    }

    if (this.point2) {
      renderContext.drawCircle(this.point1.x, this.point1.y, outlineRadius-1, 1, 'rgba(0,0,255,0.5)');
    }

    if (this.lead1) {
      renderContext.drawRect(this.lead1.x-(outlineRadius/2), this.lead1.y-(outlineRadius/2), outlineRadius, outlineRadius, 2, 'rgba(0,255,0,0.7)');
    }

    if (this.lead2) {
      renderContext.drawRect(this.lead2.x-(outlineRadius/2), this.lead2.y-(outlineRadius/2), outlineRadius, outlineRadius, 2, 'rgba(0,255,0,0.7)');
    }

    return __range__(0, this.getPostCount(), false).map((postIdx) =>
      (post = this.getPost(postIdx),
      renderContext.drawCircle(post.x, post.y, outlineRadius + 2, 1, 'rgba(255,0,255,0.5)')));
  }

//    renderContext.drawLeads(this)

    //    @updateDots(this)
    //    renderContext.drawDots(@point1, @point2, this)

  updateDots(ds) {
    if (ds == null) { ds = Settings.CURRENT_SEGMENT_LENGTH; }
    if (this.Circuit) {
      if (!this.curcount) { this.curcount = 0; }

      let currentIncrement = this.current * this.Circuit.Params.getCurrentMult();

      this.curcount = (this.curcount + currentIncrement) % ds;
      if (this.curcount < 0) { this.curcount += ds; }

      return this.curcount;
    }
  }

  timeStep() {
    return this.Circuit.timeStep();
  }

  needsShortcut() {
    return false;
  }

  hash() {
    return `${this.constructor.name}${this.point1.x}${this.point1.y}${this.point2.x}${this.point2.y}`;
  }

  equals(otherComponent) {
    return otherComponent.toString() === this.toString();
  }
  
  serialize() {
    return {
      name: this.constructor.name,
      pos:[this.point1.x, this.point1.y, this.point2.x, this.point2.y],
      flags: this.flags,
      params: this.params
    }
  }

  toJson() {
    return {
      x: this.point1.x,
      y: this.point1.y,
      x2: this.point2.x,
      y2: this.point2.y,
      flags: this.flags,
      nodes: this.nodes,
      params: this.params,
      selected: false,
      voltSource: this.getVoltageSource(),
      needsShortcut: this.needsShortcut(),
      dump: this.getDumpType().toString(),
      postCount: this.getPostCount(),
      nonLinear: this.nonLinear()
    };
  }

  getProperties() {
    return {
      name: this.getName(),
      pos: [this.point1.x, this.point1.y, this.point2.x, this.point2.y],
      params: this.params,
      current: this.getCurrent(),
      voltDiff: this.getVoltageDiff(),
      power: this.getPower()
    };
  }

  setValue(paramName, paramValue) {
    if (!Array.from(this.getParamNames()).includes(paramName)) {
      console.error(`Error while setting param for ${this.getName()}: ${paramName} is not a field in ${this.getParamNames()}`);
    }

    this[paramName] = paramValue;
    return this.params[paramName] = paramValue;
  }

  getParamNames() {
    return Object.keys(this.constructor.Fields);
  }

  //#
  // Returns the JSON metadata object for this field with an additional key/value pair for the assigned value.
  // Used externally to edit/update component values
  //
  // Eg:
  // voltageElm.getFieldWithValue("waveform")
  //
  // {
  //   name: "none"
  //   default_value: 0
  //   data_type: parseInt
  //   range: [0, 6]
  //   input_type: "select"
  //   select_values: ...
  //   value: 2  // Square wave
  // }
  //
  // @see @Fields
  getFieldWithValue(param_name) {
    let param_value = this.params[param_name];

    let field_metadata = {};

    for (let key in this.constructor.Fields[param_name]) {
      let value = this.constructor.Fields[param_name][key];
      if (key !== "data_type") {
        field_metadata[key] = value;
      }
    }

    field_metadata['value'] = param_value;

    return field_metadata;
  }


  onSolder(circuit) {}

  onclick() {}
}
CircuitComponent.initClass();

module.exports = CircuitComponent;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}