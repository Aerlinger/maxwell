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
    @simSpeed = SimulationParams.convertSimSpeed(paramsObj?['sim_speed'] || 10.0)
    @timeStep = paramsObj?['time_step'] || 5.0e-06
    @title = paramsObj?['title'] || "Default"
    @topic = paramsObj?['topic'] || null
    #      @currentMult = 1

    unless @timeStep?
      throw new Error("Circuit params is missing its time step (was null)!")

  @serialize: (simParams) ->
    completion_status: simParams.completionStatus
    created_at: simParams.createdAt
    current_speed: simParams.currentSpeed
    updated_at: simParams.updatedAt
    description: simParams.description
    flags: simParams.flags
    id: simParams.id
    name_unique: simParams.name
    power_range: simParams.powerRange
    voltage_range: simParams.voltageRange
    sim_speed: simParams.simSpeed
    time_step: simParams.timeStep
    title: simParams.title
    topic: simParams.topic

  @deserialize: (jsonObj) ->
    simParams = new SimulationParams()

    simParams.completionStatus = jsonObj?['completion_status'] || "in development"
    simParams.createdAt = jsonObj?['created_at']
    simParams.currentSpeed = jsonObj?['current_speed'] || 63
    simParams.updatedAt = jsonObj?['updated_at']
    simParams.description = jsonObj?['description'] || ""
    simParams.flags = jsonObj?['flags'] || 1
    simParams.id = jsonObj?['id'] || null
    simParams.name = jsonObj?['name_unique'] || "default"
    simParams.powerRange = jsonObj?['power_range'] || 62.0
    simParams.voltageRange = jsonObj?['voltage_range'] || 10.0
    simParams.simSpeed = SimulationParams.convertSimSpeed(jsonObj?['sim_speed'] || 10.0)
    simParams.timeStep = jsonObj?['time_step'] || 5.0e-06
    simParams.title = jsonObj?['title'] || "Default"
    simParams.topic = jsonObj?['topic'] || null

    unless simParams.timeStep?
      throw new Error("Time step param is required (was null)")

    return simParams


  toString: ->
    [
      "",
      "#{@title}",
      "================================================================",
      "\tName:        " + @name,
      "\tTopic:       " + @topic,
      "\tStatus:      " + @completionStatus,
      "\tCreated at:  " + @createdAt || "?",
      "\tUpdated At:  " + @updatedAt || "?",
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
      "----------------------------------------------------------------",
      ""
    ].join("\n")

  @convertSimSpeed: (sim_speed) ->
    Math.floor(Math.log(10 * sim_speed) * 24.0 + 61.5)

  setCurrentMult: (mult) ->
    @currentMult = mult

  getCurrentMult: ->
    @currentMult

module.exports = SimulationParams
