class Oscilloscope
  constructor: () ->
    @voltageBuffer = []
    @currentBuffer = []
    @onUpdate = null

  setOutputNode: (n) ->
    @nodeOutput = n

  setReferenceNode: (n) ->
    @nodeRef = n

  setComponent: (component) ->
    @component = component

  sampleVoltage: ->
    unless @nodeOutput && @nodeRef
      console.error("Node output and reference not set for oscilloscope!")

    voltageBuffer.add()

  sampleCurrent: ->
    currentBuffer.add()





module.exports = Oscilloscope
