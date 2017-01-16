class SimulationFrame {

  constructor(circuit) {
    let solver = circuit.Solver;

    this.frameNumber = circuit.iterations;
    this.time = circuit.time;

    this.circuitMatrix = solver.circuitMatrix;
    this.circuitRightSide = solver.circuitRightSide;

    this.elementStates = (Array.from(circuit.getElements()).map((elm) => ({
      volts: elm.volts,
      current: elm.current,
      curcount: elm.curcount || 0
    })));
  }

  toJson() {
    return {
      frameNumber: this.frameNumber,
      time: this.time,
      circuitMatrix: this.circuitMatrix,
      circuitRightSide: this.circuitRightSide,
      elementStates: this.elementStates
    };
  }
}

module.exports = SimulationFrame;
