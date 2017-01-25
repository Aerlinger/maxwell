class SimulationParams {
  //  TODO: Deprecate
  constructor(params = {}) {
    this.completionStatus = params['completion_status'] || "in development";
    this.createdAt = params['created_at'] || "?";
    this.currentSpeed = parseFloat(params['currentSpeed'] || 63);
    this.updatedAt = params['updated_at'] || "?";
    this.description = params['description'] || "";
    this.flags = parseInt(params['flags'] || 1);
    this.id = params['id'] || null;
    this.name = params['nameUnique'] || "default";
    this.powerRange = parseFloat(params['powerRange'] || 62.0);
    this.voltageRange = parseFloat(params['voltageRange'] || 10.0);
    this.simSpeed = parseFloat(params['simSpeed'] || 10);
    this.timeStep = parseFloat(params['timeStep'] || 5.0e-06);
    this.title = params['title'] || "Default";
    this.topic = params['topic'] || null;
    this.debug = params['debug'] || null;
  }
  
  toJson() {
    return {
      completion_status: this.completionStatus,
      created_at: this.createdAt,
      current_speed: this.currentSpeed,
      updated_at: this.updatedAt,
      description: this.description,
      flags: this.flags,
      id: this.id,
      nameUnique: this.name,
      power_range: this.powerRange,
      voltage_range: this.voltageRange,
      simSpeed: this.simSpeed,
      timeStep: this.timeStep,
      title: this.title,
      topic: this.topic,
      debug: this.debug
    };
  }

  toString() {
    return [
      `${this.name}`,
      "================================================================",
      `\tFlags:       ${this.flags}`,
      `\tTimeStep:    ${this.timeStep.toFixed(7)}`,
      `\tSim Speed:   ${this.simSpeed}`,
      `\tCur Speed:   ${this.currentSpeed}`,
      `\tVolt. Range: ${this.voltageRange.toFixed(2)}`,
      `\tPwr Range:   ${this.powerRange}`,
      "----------------------------------------------------------------",
      ""
    ].join("\n");
  }

  setCurrentMult(mult) {
    return this.currentMult = mult;
  }

  getCurrentMult() {
    return this.currentMult;
  }
}

module.exports = SimulationParams;

