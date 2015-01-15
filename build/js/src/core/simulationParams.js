(function() {
  define([], function() {

    /*
      Stores Circuit-specific settings.
      Usually loaded from the params object of a .json file
     */
    var SimulationParams;
    SimulationParams = (function() {
      function SimulationParams(paramsObj) {
        this.completionStatus = (paramsObj != null ? paramsObj['completion_status'] : void 0) || "in development";
        this.createdAt = paramsObj != null ? paramsObj['created_at'] : void 0;
        this.currentSpeed = (paramsObj != null ? paramsObj['current_speed'] : void 0) || 63;
        this.updatedAt = paramsObj != null ? paramsObj['updated_at'] : void 0;
        this.description = (paramsObj != null ? paramsObj['description'] : void 0) || "";
        this.flags = (paramsObj != null ? paramsObj['flags'] : void 0) || 1;
        this.id = (paramsObj != null ? paramsObj['id'] : void 0) || null;
        this.name = (paramsObj != null ? paramsObj['name_unique'] : void 0) || "default";
        this.powerRange = (paramsObj != null ? paramsObj['power_range'] : void 0) || 62.0;
        this.voltageRange = (paramsObj != null ? paramsObj['voltage_range'] : void 0) || 10.0;
        this.simSpeed = this.convertSimSpeed((paramsObj != null ? paramsObj['sim_speed'] : void 0) || 10.0);
        this.timeStep = (paramsObj != null ? paramsObj['time_step'] : void 0) || 5.0e-06;
        this.title = (paramsObj != null ? paramsObj['title'] : void 0) || "Default";
        this.topic = (paramsObj != null ? paramsObj['topic'] : void 0) || null;
        if (this.timeStep == null) {
          throw new Error("Circuit params is missing its time step (was null)!");
        }
      }

      SimulationParams.prototype.toString = function() {
        return ["", "" + this.title, "================================================================", "\tName:        " + this.name, "\tTopic:       " + this.topic, "\tStatus:      " + this.completionStatus, "\tCreated at:  " + this.createdAt, "\tUpdated At:  " + this.updatedAt, "\tDescription: " + this.description, "\tId:          " + this.id, "\tTitle:       " + this.title, "----------------------------------------------------------------", "\tFlags:       " + this.flags, "\tTimeStep:    " + this.timeStep, "\tSim Speed:   " + this.simSpeed, "\tCur Speed:   " + this.currentSpeed, "\tVolt. Range: " + this.voltageRange, "\tPwr Range:   " + this.powerRange, ""].join("\n");
      };

      SimulationParams.prototype.convertSimSpeed = function(speed) {
        return Math.floor(Math.log(10 * speed) * 24.0 + 61.5);
      };

      SimulationParams.prototype.setCurrentMult = function(mult) {
        return this.currentMult = mult;
      };

      SimulationParams.prototype.getCurrentMult = function() {
        return this.currentMult;
      };

      return SimulationParams;

    })();
    return SimulationParams;
  });

}).call(this);
