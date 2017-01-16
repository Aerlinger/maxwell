let CircuitComponent = require("../circuitComponent.js");
let Util = require('../../util/util.js');
let Point = require('../../geom/point.js');
let Settings = require('../../settings/settings.js');

let self = undefined;
let Pin = undefined;
class ChipElm extends CircuitComponent {

  static initClass() {
    this.FLAG_SMALL = 1;
    this.FLAG_FLIP_X = 1024;
    this.FLAG_FLIP_Y = 2148;
  
    this.SIDE_N = 0;
    this.SIDE_S = 1;
    this.SIDE_W = 2;
    this.SIDE_E = 3;

    self = null;
  
    Pin = class Pin {
      constructor(pos, side, text) {
        this.pos = pos;
        this.side = side;
        this.text = text;
        this.post = null;
        this.stub = null;
        this.textloc = null;
        this.voltSource = 0;
        this.bubbleX = 0;
        this.bubbleY = 0;
  
        this.lineOver = false;
        this.bubble = false;
        this.clock = false;
        this.output = false;
        this.value = false;
        this.state = false;
  
        this.curcount = 0;
        this.current = 0;
      }
  
      updateDots(currentMult=1, ds = Settings.CURRENT_SEGMENT_LENGTH) {
        if (!this.curcount) { this.curcount = 0; }
  
        let currentIncrement = this.current * currentMult;
  
        this.curcount = (this.curcount + currentIncrement) % ds;
        if (this.curcount < 0) { this.curcount += ds; }
  
        return this.curcount;
      }
  
      getName() {
        return self.getName();
      }
  
      setPoint(px, py, dx, dy, dax, day, sx, sy) {
        if ((self.flags & ChipElm.FLAG_FLIP_X) !== 0) {
          dx = -dx;
          dax = -dax;
          px += self.cspc2 * (self.sizeX - 1);
          sx = -sx;
        }
  
        if ((self.flags & ChipElm.FLAG_FLIP_Y) !== 0) {
          dy = -dy;
          day = -day;
          py += self.cspc2 * (self.sizeY - 1);
          sy = -sy;
        }
  
        let xa = Math.floor(px + (self.cspc2 * dx * this.pos) + sx);
        let ya = Math.floor(py + (self.cspc2 * dy * this.pos) + sy);
  
  //      console.log("SET POINT", px, py, dx, dy, dax, day, sx, sy, self.cspc2, @pos)
  
        this.post = new Point(xa + (dax * self.cspc2), ya + (day * self.cspc2));
        this.stub = new Point(xa + (dax * self.cspc), ya + (day * self.cspc));
  
        this.textloc = new Point(xa, ya);
  
        if (this.bubble) {
          this.bubbleX = xa + (dax * 10 * self.csize);
          this.bubbleY = ya + (day * 10 * self.csize);
        }
  
        if (this.clock) {
          let clockPointsX = new Array(3);
          let clockPointsY = new Array(3);
  
          clockPointsX[0] = (xa + (dax * self.cspc)) - ((dx * self.cspc) / 2);
          clockPointsY[0] = (ya + (day * self.cspc)) - ((dy * self.cspc) / 2);
          clockPointsX[1] = xa;
          clockPointsY[1] = ya;
          clockPointsX[2] = xa + (dax * self.cspc) + ((dx * self.cspc) / 2);
          return clockPointsY[2] = ya + (day * self.cspc) + ((dy * self.cspc) / 2);
        }
      }
  
      toJson() {
        return {
          post: this.post,
          stub: this.stub,
          textloc: this.textloc,
          pos: this.pos,
          side: this.side,
          voltSource: this.voltSource,
          bubbleX: this.bubbleX,
          bubbleY: this.bubbleY,
          text: this.text,
          lineOver: this.lineOver,
          bubble: this.bubble,
          clock: this.clock,
          output: this.output,
          value: this.value,
          state: this.state
        };
      }

      toString() {
        return this.pos + " " + this.side + " " + this.text;
      }
    };

    this.Pin = Pin;
  }

  // TODO: Need a better way of dealing with variable length params here
  constructor(xa, xb, ya, yb, params, f) {
    // console.log(params);

    super(xa, xb, ya, yb, {}, f);

    let initial_voltages = [];

    this.flags = f;

    this.setSize(((f & ChipElm.FLAG_SMALL) !== 0) ? 1 : 2);
    
    // TODO: Needs cleanup 

    if (params) {
      // TODO: DRY
      if (params.constructor == Array) {
        if (this.needsBits()) {
          this.bits = parseInt(params.shift());
          this.params['bits'] = this.bits;
        }

        self = this;
        this.setupPins();
        this._setPoints();

        for (let i=0; i<this.getPostCount(); ++i) {
          if (this.pins[i].state) {
            initial_voltages.push(parseInt(params.shift()));
          }
        }

        this.volts = initial_voltages;

        if (this.volts) {
          this.params['volts'] = initial_voltages;
        }
      } else {
        if (this.needsBits()) {
          this.bits = params['bits'];
          this.params['bits'] = this.bits;
        }

        self = this;
        this.setupPins();
        this._setPoints();

        this.volts = params['volts'];

        for (let i=0; i<this.getPostCount(); ++i) {
          if (this.pins[i].state) {
            initial_voltages.push(parseInt(params['volts'].shift()));
          }
        }

        this.volts = initial_voltages;

        if (params['volts']) {
          this.params.volts = this.volts
        }
      }
    }

    this.noDiagonal = true;
    
    /*
    let numPosts = this.getPostCount();
    
    for (let i = 0; i < numPosts; i++) {
      if (!this.pins[i]) {
        console.error(`No pin found at ${i}`);
        return;
      }

      if (this.pins[i].state) {
        this.volts[i] = __guard__(initial_voltages, x1 => x1.shift());
        this.pins[i].value = this.volts[i] > 2.5;
      }
    }
    */

    // console.log(this.params['volts'])
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
      name: this.constructor.name,
      x1: this.point1.x,
      y1: this.point1.y,
      x2: this.point2.x,
      y2: this.point2.y,

      csize: this.csize,
      cspc: this.cspc,
      cspc2: this.cspc2,
      flags: this.flags,
      pins: this.pins,
      params: paramValues,
      voltage: this.getVoltageDiff(),
      current: this.getCurrent()
    };
  }

  setupPins() {
    return console.trace("setupPins() to be called from subclasses of ChipElm");
  }

  execute() {
    // return console.trace("execute() to be called from subclasses of ChipElm");
  }

  getVoltageSourceCount() {
    return console.warn("getVoltageSourceCount() to be called from subclasses of ChipElm");
  }

  getChipName() {
    return console.trace("getChipName() to be called from subclasses of ChipElm");
  }

  getConnection(n1, n2) {
    return false;
  }

  hasGroundConnection(n1) {
    return this.pins[n1].output;
  }

  reset() {
    for (let i = 0; i < this.getPostCount(); i++) {
      this.pins[i].value = false;
      this.pins[i].curcount = 0;
      this.volts[i] = 0;
    }

    return this.lastClock = false;
  }

  needsBits() {
    return false;
  }

  setSize(s) {
    this.csize = s;
    this.cspc = 8 * s;
    this.cspc2 = this.cspc * 2;
    this.flags = this.flags & ~ChipElm.FLAG_SMALL;
    return this.flags = this.flags | ((s === 1) ? ChipElm.FLAG_SMALL : 0);
  }

  getPost(n) {
    return this.pins[n].post;
  }

  setCurrent(x, c) {
    return (() => {
      let result = [];
      for (let i = 0, end = this.getPostCount(), asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        let item;
        let pin = this.pins[i];
        if (pin.output && (pin.voltSource === x)) {
          item = pin.current = c;
        }
        result.push(item);
      }
      return result;
    })();
  }


  setVoltageSource(j, vs) {
    for (let i = 0, end = this.getPostCount(), asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      let p = this.pins[i];
      if ((p.output && j--) === 0) {
        p.voltSource = vs;
        return;
      }
    }

    return console.log(`setVoltageSource failed for ${this}${`j=${j}, vs=${vs}   ${this.toJson()}`}`);
  }

  doStep(stamper) {
    let i, p;
    for (i = 0, end = this.getPostCount(), asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      var asc, end;
      p = this.pins[i];
      if (!p.output) {
        p.value = this.volts[i] > 2.5;
      }
    }

    this.execute();

    return (() => {
      let result = [];
      for (i = 0, end1 = this.getPostCount(), asc1 = 0 <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
        var asc1, end1;
        let item;
        p = this.pins[i];
        if (p.output) {
          item = stamper.updateVoltageSource(0, this.nodes[i], p.voltSource, p.value ? 5 : 0);
        }
        result.push(item);
      }
      return result;
    })();
  }

  stamp(stamper) {
    return (() => {
      let result = [];
      for (let i = 0, end = this.getPostCount(), asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        let item;
        let p = this.pins[i];

        if (p.output) {
          item = stamper.stampVoltageSource(0, this.nodes[i], p.voltSource);
        }
        result.push(item);
      }
      return result;
    })();
  }

  draw(renderContext) {
    this.drawChip(renderContext);

    if (CircuitComponent.DEBUG && (this.params['bits'] > 0)) {
      return super.draw(renderContext);
    }
  }

  drawChip(renderContext) {
    let i;
    renderContext.drawThickPolygon(this.rectPointsX, this.rectPointsY, Settings.STROKE_COLOR);

    for (i = 0; i < this.getPostCount(); i++) {

      if (this.pins[i]) {
        let p = this.pins[i];

        let voltageColor = Util.getVoltageColor(this.volts[i]);

        let a = p.post;
        let b = p.stub;

        renderContext.drawLinePt(a, b, voltageColor);

        p.updateDots(this.Circuit.Params.getCurrentMult());

        renderContext.drawDots(b, a, p);

        if (p.bubble) {
          renderContext.drawCircle(p.bubbleX, p.bubbleY, 1, Settings.FILL_COLOR);
          renderContext.drawCircle(p.bubbleX, p.bubbleY, 3, Settings.STROKE_COLOR);
        }

        renderContext.fillText(p.text, p.textloc.x-4, p.textloc.y+2);

        if (p.lineOver) {
          let ya = p.textloc.y - renderContext.context.measureText(p.text).height;
          let textWidth = renderContext.context.measureText(p.text).width + 2;
          renderContext.drawLine(p.textloc.x, ya, p.textloc.x + textWidth, ya);
        }
      }
    }

    if (this.clockPointsX && this.clockPointsY) {
      renderContext.drawPolyline(this.clockPointsX, this.clockPointsY, 3);
    }

    return (() => {
      let result = [];
      for (i = i, end1 = this.getPostCount(), asc1 = i <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
        var asc1, end1;
        result.push(renderContext.drawPost(this.pins[i].post.x, this.pins[i].post.y, this.nodes[i]));
      }
      return result;
    })();
  }

  _setPoints() {
//    if @x2 - @x1 > @sizeX*@cspc2 # dragging
//      @setSize(2)

    // super.setPoints(...arguments);

    let hs = this.cspc2;
    let x0 = this.point1.x + this.cspc2;
    let y0 = this.point1.y;

    let xr = x0 - this.cspc;
    let yr = y0 - this.cspc;
    let xs = this.sizeX * this.cspc2;
    let ys = this.sizeY * this.cspc2;

    this.rectPointsX = [xr, xr + xs, xr + xs, xr];
    this.rectPointsY = [yr, yr, yr + ys, yr + ys];

    this.setBbox(xr, yr, this.rectPointsX[2], this.rectPointsY[2]);

    for (let i = 0; i < this.getPostCount(); i++) {
      let p = this.pins[i];

      if (!p) {
        console.error(`Cannot set pin at index ${i} because it is not defined (bits: ${this.bits})`);
        return;
      }

      if (i >= this.pins.length) {
        console.error(`Pin index out of bounds: ${i}. @pins is length ${this.pins.length} but there are ${this.getPostCount()} posts`);
        return;
      }

      if (p.side === ChipElm.SIDE_N) {
        p.setPoint(x0, y0, 1, 0, 0, -1, 0, 0);
      } else if (p.side === ChipElm.SIDE_S) {
        p.setPoint(x0, y0, 1, 0, 0, 1, 0, ys - this.cspc2);
      } else if (p.side === ChipElm.SIDE_W) {
        p.setPoint(x0, y0, 0, 1, -1, 0, 0, 0);
      } else if (p.side === ChipElm.SIDE_E) {
        p.setPoint(x0, y0, 0, 1, 1, 0, xs - this.cspc2, 0);
      }
    }
  }

  toJson() {
    let baseJson = super.toJson();

    baseJson['bits'] = this.bits;
    baseJson['pins'] = this.pins.map(pin => pin.toJson());

    return baseJson;
  }
}
ChipElm.initClass();

module.exports = ChipElm;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
