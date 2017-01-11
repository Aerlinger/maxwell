class Oscilloscope {
  constructor() {
    this.voltageBuffer = [];
    this.currentBuffer = [];
    this.onUpdate = null;
  }

  setOutputNode(n) {
    return this.nodeOutput = n;
  }

  setReferenceNode(n) {
    return this.nodeRef = n;
  }

  setComponent(component) {
    return this.component = component;
  }

  sampleVoltage() {
    if (!this.nodeOutput || !this.nodeRef) {
      console.error("Node output and reference not set for oscilloscope!");
    }

    return voltageBuffer.add();
  }

  sampleCurrent() {
    return currentBuffer.add();
  }
}





module.exports = Oscilloscope;
