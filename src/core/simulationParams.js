class SimulationParams {
  //  TODO: Deprecate
  constructor(paramsObj) {
    this.completionStatus = __guard__(paramsObj, x => x['completion_status']) || "in development";
    this.createdAt = __guard__(paramsObj, x1 => x1['created_at']);
    this.currentSpeed = parseFloat(__guard__(paramsObj, x2 => x2['current_speed'])) || 63;
    this.updatedAt = __guard__(paramsObj, x3 => x3['updated_at']);
    this.description = __guard__(paramsObj, x4 => x4['description']) || "";
    this.flags = parseInt(__guard__(paramsObj, x5 => x5['flags'])) || 1;
    this.id = parseInt(__guard__(paramsObj, x6 => x6['id'])) || null;
    this.name = __guard__(paramsObj, x7 => x7['name_unique']) || "default";
    this.powerRange = parseFloat(__guard__(paramsObj, x8 => x8['power_range'])) || 62.0;
    this.voltageRange = parseFloat(__guard__(paramsObj, x9 => x9['voltage_range'])) || 10.0;
    this.simSpeed = parseFloat(SimulationParams.convertSimSpeed(__guard__(paramsObj, x10 => x10['sim_speed'])) || 10.0);
    this.timeStep = parseFloat(__guard__(paramsObj, x11 => x11['time_step'])) || 5.0e-06;
    this.title = __guard__(paramsObj, x12 => x12['title']) || "Default";
    this.topic = __guard__(paramsObj, x13 => x13['topic']) || null;
    //      @currentMult = 1

    if (this.timeStep == null) {
      throw new Error("Circuit params is missing its time step (was null)!");
    }
  }

  static serialize(simParams) {
    return {
      completion_status: simParams.completionStatus,
      created_at: simParams.createdAt,
      current_speed: simParams.currentSpeed,
      updated_at: simParams.updatedAt,
      description: simParams.description,
      flags: simParams.flags,
      id: simParams.id,
      name_unique: simParams.name,
      power_range: simParams.powerRange,
      voltage_range: simParams.voltageRange,
      sim_speed: simParams.simSpeed,
      time_step: simParams.timeStep,
      title: simParams.title,
      topic: simParams.topic
    };
  }

  static deserialize(jsonObj) {
    let simParams = new SimulationParams();

    simParams.completionStatus = __guard__(jsonObj, x => x['completion_status']) || "in development";
    simParams.createdAt = __guard__(jsonObj, x1 => x1['created_at']);
    simParams.currentSpeed = parseFloat(__guard__(jsonObj, x2 => x2['current_speed'])) || 63;
    simParams.updatedAt = __guard__(jsonObj, x3 => x3['updated_at']);
    simParams.description = __guard__(jsonObj, x4 => x4['description']) || "";
    simParams.flags = parseInt(__guard__(jsonObj, x5 => x5['flags'])) || 1;
    simParams.id = __guard__(jsonObj, x6 => x6['id']) || null;
    simParams.name = __guard__(jsonObj, x7 => x7['name_unique']) || "default";
    simParams.powerRange = parseFloat(__guard__(jsonObj, x8 => x8['power_range'])) || 62.0;
    simParams.voltageRange = parseFloat(__guard__(jsonObj, x9 => x9['voltage_range'])) || 10.0;
    simParams.simSpeed = SimulationParams.convertSimSpeed(__guard__(jsonObj, x10 => x10['sim_speed']) || 10.0);
    simParams.timeStep = parseFloat(__guard__(jsonObj, x11 => x11['time_step'])) || 5.0e-06;
    simParams.title = __guard__(jsonObj, x12 => x12['title']) || "Default";
    simParams.topic = __guard__(jsonObj, x13 => x13['topic']) || null;

    if (simParams.timeStep == null) {
      throw new Error("Time step param is required (was null)");
    }

    return simParams;
  }

  details() {
    return [
      `\tName:        ${this.name}`,
      `\tTopic:       ${this.topic}`,
      `\tStatus:      ${this.completionStatus}`,
      (`\tCreated at:  ${this.createdAt}`) || "?",
      (`\tUpdated At:  ${this.updatedAt}`) || "?",
      `\tDescription: ${this.description}`,
      `\tId:          ${this.id}`,
      `\tTitle:       ${this.title}`
    ].join("\n");
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

  static convertSimSpeed(sim_speed) {
    return Math.floor((Math.log(10 * sim_speed) * 24.0) + 61.5);
  }

  setCurrentMult(mult) {
    return this.currentMult = mult;
  }

  getCurrentMult() {
    return this.currentMult;
  }
}

module.exports = SimulationParams;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}