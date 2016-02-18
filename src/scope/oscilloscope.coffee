class Oscilloscope
  constructor: (@timeStep = 1) ->
    @timeBase = 0
    @frames = 0

#      palette = new Rickshaw.Color.Palette scheme: 'classic9'

    @seriesData = [[], [], [], [], [], [], [], [], []]

    xbuffer_size = 150

    chartDiv = document.getElementById("chart")

    for i in [0..xbuffer_size]
      @addData 0

    step: ->
      @frames += 1
      @removeData(1)
      if @targetComponent
        @addData @targetComponent.getScopeValue()

#      new ScopeControls(graph)

    setInterval =>
      @step()
      graph.update()
    , 40
#

  step: ->
    @frames += 1
    @removeData(1)
    @addData 0.5 * Math.sin(@frames / 10) + 0.5

  addData: (value) ->
    index = @seriesData[0].length

    for item in @seriesData
      item.push({x: index * @timeStep + @timeBase, y: value})

  removeData: (data) ->
    for item in @seriesData
      item.shift()

    @timeBase += @timeStep


module.exports = Oscilloscope
