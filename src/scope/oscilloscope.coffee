# <DEFINE>
define [
  'Rickshaw'
  'cs!ScopeControls'
  'jqueryui'
], (Rickshaw,
    ScopeControls) ->
# </DEFINE>
  class Oscilloscope
    constructor: (@timeStep = 1) ->
      @timeBase = 0
      @frames = 0

      palette = new Rickshaw.Color.Palette scheme: 'classic9'

      @seriesData = [[], [], [], [], [], [], [], [], []];

      xbuffer_size = 150

      chartDiv = document.getElementById("chart")

      for i in [0..xbuffer_size]
        @addData 0

      graph = new Rickshaw.Graph({
        element: chartDiv,
        width: 400,
        height: 200,
        renderer: "line",
        stroke: true,
        preserve: true,
        series: [
          color: palette.color()
          data: @seriesData[0]
          name: "Voltage"
        ],
      })

      new ScopeControls(graph)

      setInterval =>
        @step()
        graph.update();
      , 40
#

    step: ->
      @frames += 1
      @removeData(1);
      @addData 0.5 * Math.sin(@frames/10) + 0.5

    addData: (value) ->
      index = @seriesData[0].length

      for item in @seriesData
        item.push({x: index * @timeStep + @timeBase, y: value})

    removeData: (data) ->
      for item in @seriesData
        item.shift()

      @timeBase += @timeStep


  return Oscilloscope
