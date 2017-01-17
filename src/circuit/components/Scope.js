let Rectangle = require("../../geom/rectangle.js");
let Util = require("../../util/util.js");

class Scope {
  static initClass() {
  
    this.VAL_POWER = 1;
    this.VAL_IB = 1;
    this.VAL_IC = 2;
    this.VAL_IE = 3;
    this.VAL_VBE = 4;
    this.VAL_VBC = 5;
    this.VAL_VCE = 6;
    this.VAL_R = 2;
  }

  constructor() {
    this.rect = new Rectangle(0, 500, 200, 100);
  }

  reset() {
    let lockScale, showMax, showMin, showV;
    this.minMaxV = 5;
    this.minMaxI = .1;
    this.speed = 64;
    this.showI = showV = showMax = true;
    this.showFreq = lockScale = showMin = false;
    this.plot2d = false;

    // no showI for Output
    if ((elm !== null) && (this.elm instanceof OutputElm || this.elm instanceof LogicOutputElm || this.elm instanceof ProbeElm)) {
      this.showI = false;
    }

    this.value = this.ivalue = 0;

    if (this.elm instanceof TransistorElm) {
      return this.value = VAL_VCE;
    }
  }

  getName() {
    return "Scope Output"
  }

  resetGraph() {
    this.scopePointCount = 1;

    while (this.scopePointCount <= this.rect.width) {
      this.scopePointCount *= 2;
    }

    this.minV = Util.zeroArray(this.scopePointCount);
    this.maxV = Util.zeroArray(this.scopePointCount);
    this.minI = Util.zeroArray(this.scopePointCount);
    this.maxI = Util.zeroArray(this.scopePointCount);

    return this.ptr = this.ctr = 0;
  }

  draw(renderContext) {
    return renderContext.drawLinePt(this.rect.x, this.rect.y, this.rect.x + this.rect.width, this.rect.y + this.rect.height);
  }

  setElm(ce){
    return this.elm = ce;
  }
}
Scope.initClass();


module.exports = Scope;
