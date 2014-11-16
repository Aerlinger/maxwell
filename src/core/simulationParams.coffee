# <DEFINE>
define [], () ->
# </DEFINE>


  ###
    Stores Circuit-specific settings.
    Usually loaded from the params object of a .json file
  ###
  class CircuitParams
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
        "status: " + @completionStatus,
        "Created at:" + @createdAt,
        "Cur Speed: " + @currentSpeed,
        "Updated At: " + @updatedAt,
        "Description: " + @description,
        "Flags: " + @flags,
        "Id: " + @id,
        "Name: " + @name,
        "Pwr Range: " + @powerRange,
        "Volt. Range: " + @voltageRange,
        "Sim Speed: " + @simSpeed,
        "TimeStep: " + @timeStep,
        "Title: " + @title,
        "Topic: " + @topic
      ].join("\n")

  return CircuitParams
