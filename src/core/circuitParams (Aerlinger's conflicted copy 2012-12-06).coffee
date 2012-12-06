###
Stores Circuit-specific settings.

Usually loaded from the params object of a .json file
###
class CircuitParams
  constructor: (paramsObj) ->
    @completionStatus = paramsObj?['completion_status']
    @createdAt = paramsObj?['created_at']
    @currentSpeed = paramsObj?['current_speed']
    @updatedAt = paramsObj?['updated_at']
    @description = paramsObj?['description']
    @flags = paramsObj?['flags']
    @id = paramsObj?['id']
    @name = paramsObj?['name']
    @powerRange = paramsObj?['power_range']
    @voltageRange = paramsObj?['voltage_range']
    @simSpeed = paramsObj?['sim_speed']
    @timeStep = paramsObj?['time_step']
    @title = paramsObj?['title']
    @topic = paramsObj?['topic']

module.exports = CircuitParams