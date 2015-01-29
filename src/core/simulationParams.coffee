class SimulationParams
  constructor: (paramsObj) ->
    @completionStatus = paramsObj?['completion_status'] || "in development"
    @createdAt = paramsObj?['created_at']
    @currentSpeed = paramsObj?['current_speed'] || 63
    @updatedAt = paramsObj?['updated_at']
    @description = paramsObj?['description'] || ""
    @flags = paramsObj?['flags'] || 1
    @id = paramsObj?['id'] || null
    @name = paramsObj?['name_unique'] || "default"
    @powerRange = paramsObj?['power_range'] || 62.0
    @voltageRange = paramsObj?['voltage_range'] || 10.0
    @simSpeed = @convertSimSpeed(paramsObj?['sim_speed'] || 10.0)
    @timeStep = paramsObj?['time_step'] || 5.0e-06
    @title = paramsObj?['title'] || "Default"
    @topic = paramsObj?['topic'] || null
    #      @currentMult = 1

    unless @timeStep?
      throw new Error("Circuit params is missing its time step (was null)!")

  toString: ->
    [
      "",
      "#{@title}",
      "================================================================",
      "\tName:        " + @name,
      "\tTopic:       " + @topic,
      "\tStatus:      " + @completionStatus,
      "\tCreated at:  " + @createdAt,
      "\tUpdated At:  " + @updatedAt,
      "\tDescription: " + @description,
      "\tId:          " + @id,
      "\tTitle:       " + @title,
      "----------------------------------------------------------------",
      "\tFlags:       " + @flags,
      "\tTimeStep:    " + @timeStep,
      "\tSim Speed:   " + @simSpeed,
      "\tCur Speed:   " + @currentSpeed,
      "\tVolt. Range: " + @voltageRange,
      "\tPwr Range:   " + @powerRange,
      ""
    ].join("\n")

  convertSimSpeed: (sim_speed) ->
    Math.floor(Math.log(10 * sim_speed) * 24.0 + 61.5)

  setCurrentMult: (mult) ->
    @currentMult = mult

  getCurrentMult: ->
    @currentMult

module.exports = SimulationParams
