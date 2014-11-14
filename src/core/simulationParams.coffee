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
      @description = paramsObj?['description']
      @flags = paramsObj?['flags']
      @id = paramsObj?['id']
      @name = paramsObj?['name_unique']
      @powerRange = paramsObj?['power_range']
      @voltageRange = paramsObj?['voltage_range']
      @simSpeed = paramsObj?['sim_speed']
      @timeStep = paramsObj?['time_step']
      @title = paramsObj?['title']
      @topic = paramsObj?['topic']

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
