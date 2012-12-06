class CircuitParams

  constructor: (paramsHash) ->
    @completionStatus = paramsHash?['completion_status']
    @createdAt = paramsHash?['created_at']
    @currentSpeed = paramsHash?['current_speed']
    @updatedAt = paramsHash?['updated_at']
    @description = paramsHash?['description']
    @flags = paramsHash?['flags']
    @id = paramsHash?['id']
    @name = paramsHash?['name']
    @powerRange = paramsHash?['power_range']
    @voltageRange = paramsHash?['voltage_range']
    @simSpeed = paramsHash?['sim_speed']
    @timeStep = paramsHash?['time_step']
    @title = paramsHash?['title']
    @topic = paramsHash?['topic']

module.exports = CircuitParams