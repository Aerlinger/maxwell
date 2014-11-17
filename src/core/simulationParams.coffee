# <DEFINE>
define [], () ->
# </DEFINE>


  ###
    Stores Circuit-specific settings.
    Usually loaded from the params object of a .json file
  ###
  class SimulationParams
    constructor: (paramsObj) ->
      @completionStatus = paramsObj?['completion_status'] || "in development"
      @createdAt = paramsObj?['created_at']
      @currentSpeed = paramsObj?['current_speed'] || 63
      @updatedAt = paramsObj?['updated_at']
      @description = paramsObj?['description']  || ""
      @flags = paramsObj?['flags'] || 1
      @id = paramsObj?['id'] || null
      @name = paramsObj?['name_unique'] || "default"
      @powerRange = paramsObj?['power_range'] || 62.0
      @voltageRange = paramsObj?['voltage_range'] || 10.0
      @simSpeed = paramsObj?['sim_speed'] || 10.0
      @timeStep = paramsObj?['time_step'] || 5.0e-06
      @title = paramsObj?['title'] || "Default"
      @topic = paramsObj?['topic'] || null

      unless @timeStep?
        throw new Error("Circuit params is missing its time step (was null)!")

    toString: ->
      [
        "",
        "#{@title} SIMULATION PARAMS:",
        "----------------------------------------------------------------",
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

  return SimulationParams
