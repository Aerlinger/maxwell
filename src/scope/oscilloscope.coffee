# <DEFINE>
define [
  'Rickshaw'
  'cs!ScopeCanvas'
  'jqueryui'
], (Rickshaw,
    ScopeCanvas) ->
# </DEFINE>
  class Oscilloscope
    constructor: (@timeStep = 1) ->
      @timeBase = 0
      @frames = 0

      @seriesData = [[], [], [], [], [], [], [], [], []];

      xbuffer_size = 150

      for i in [0..xbuffer_size]
        @addData 0

      @scopeCanvas = new ScopeCanvas(this)

      setInterval =>
        @step()
      , 40

    step: ->
      @frames += 1
      @removeData(1);
      @addData 0.5 * Math.sin(@frames/10) + 0.5
      @scopeCanvas.update()

    addData: (value) ->
      index = @seriesData[0].length

      for item in @seriesData
        item.push({x: index * @timeStep + @timeBase, y: value})

    removeData: (data) ->
      for item in @seriesData
        item.shift()

      @timeBase += @timeStep


  return Oscilloscope
