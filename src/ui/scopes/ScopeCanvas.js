class ScopeCanvas {
  constructor(parentUI, scopeDiv, x=800, y=700) {
    this.dataPoints = 800;

    this.parentUI = parentUI;
    this.scopeDiv = scopeDiv;
  }

  x() {
    return this.scopeDiv.offsetLeft - this.parentUI.marginLeft;
  }

  y() {
    return this.scopeDiv.offsetTop - this.parentUI.marginTop;
  }

  height() {
    return this.scopeDiv.offsetHeight;
  }

  width() {
    return this.scopeDiv.offsetWidth;
  }

  resize(width, height) {
  }

  addVoltage(value) {
  };

  addCurrent(value) {
  };
}

module.exports = ScopeCanvas;
