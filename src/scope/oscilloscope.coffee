# <DEFINE>
define [
  'Rickshaw'
  'cs!ScopeControls'
  'jqueryui'
], (Rickshaw,
    ScopeControls) ->
# </DEFINE>
  class Oscilloscope
    constructor: () ->
      @timeBase = Math.floor(new Date().getTime() / 1000);

      @timeInterval = 1
      @frames = 0

      palette = new Rickshaw.Color.Palette scheme: 'classic9'

      timelineDiv = document.getElementById("timeline")
      legendDiv = document.getElementById("legend")
      controlsDiv = document.querySelector("form")

      @seriesData = [[], [], [], [], [], [], [], [], []];

      for i in [0..150]
        @addData 1

      graph = new Rickshaw.Graph({
        element: document.getElementById("chart"),
        width: 400,
        height: 200,
        renderer: "line",
        stroke: true,
        preserve: true,
        series: [
          color: palette.color()
          data: @seriesData[0]
          name: "Voltage"
        ]
      })

      new Rickshaw.Graph.HoverDetail({
        graph: graph,
        xFormatter: (x) ->
          new Date(x * 1000).toString()
      })

#      @annotator = new Rickshaw.Graph.Annotate graph: graph,
#        element: document.getElementById("timeline")

      legend = new Rickshaw.Graph.Legend({
        graph: graph,
        element: document.getElementById("legend")
      })

      shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: graph,
        legend: legend
      })

      order = new Rickshaw.Graph.Behavior.Series.Order({
        graph: graph,
        legend: legend
      })

      highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: graph,
        legend: legend
      })

      ticksTreatment = "glow"

      xAxis = new Rickshaw.Graph.Axis.Time({
        graph: graph,
        ticksTreatment: ticksTreatment,
        timeFixture: new Rickshaw.Fixtures.Time.Local()
      })

      xAxis.render()

      yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment
      })
      yAxis.render()

      new ScopeControls(controlsDiv, graph)

      setInterval =>
        @step()
        graph.update();
      , 40


    render: ->

    step: ->
      @frames += 1
      @removeData(1);
      @addData 0.5*Math.sin(@frames/10) + 0.5

    addData: (value) ->
      index = @seriesData[0].length

      for item in @seriesData
        item.push({x: index * @timeInterval + @timeBase, y: value})

    removeData: (data) ->
      for item in @seriesData
        item.shift()

      @timeBase += @timeInterval


  return Oscilloscope
