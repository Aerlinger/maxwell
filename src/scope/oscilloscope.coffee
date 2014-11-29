# <DEFINE>
define [
  'Rickshaw'
  'cs!ScopeCanvas'
  'jqueryui'
], (Rickshaw,
    ScopeCanvas) ->
# </DEFINE>
  class Oscilloscope
    constructor: (@Circuit, @targetComponent = null) ->
      @Circuit.scopes.push(self)

      @timeBase = 0
      @frames = 0
      @targetComponent = null

      @seriesData = [[], []];

      xbuffer_size = 150

      for i in [0..xbuffer_size]
        @addData 0

      @scopeCanvas = new ScopeCanvas(this)

    step: ->
      @frames += 1
      @removeData(1);
      if @targetComponent
        @addData @targetComponent.getScopeValue()

      @scopeCanvas.update()

    addData: (value) ->
      index = @seriesData[0].length

      for item in @seriesData
        item.push({x: index * @timeStep + @timeBase, y: value})

    removeData: (data) ->
      for item in @seriesData
        item.shift()

      @timeBase += @timeStep

    setTargetComponent: (component) ->
      @targetComponent = component


  return Oscilloscope
