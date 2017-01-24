class ScopeCanvas {
  constructor(parentUI, parentScope, contextElement, x=800, y=700) {
    this.dataPoints = 400;
    this.timeInterval = 5;

    this.parentUI = parentUI;
    this.frame = contextElement.parentElement;
    this.contextElement = contextElement;
    this.parentScope = parentScope;
    this.parentScope.setCanvas(this);
  }

  x() {
    return this.frame.offsetLeft - this.parentUI.xMargin;
  }

  y() {
    return this.frame.offsetTop - this.parentUI.yMargin;
  }

  height() {
    return this.frame.offsetHeight;
  }

  width() {
    return this.frame.offsetWidth;
  }

  resize(width, height) {

  }

  addVoltage(value) {
  };

  addCurrent(value) {
  };
}

module.exports = ScopeCanvas;
