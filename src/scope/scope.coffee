require [
  # Load our app module and pass it to our definition function
  "Rickshaw"
], (Rickshaw) ->


  # set up our data series with 150 random data points
  RenderControls = (args) ->
    @initialize = ->
      @element = args.element
      @graph = args.graph
      @settings = @serialize()
      @inputs =
        renderer: @element.elements.renderer
        interpolation: @element.elements.interpolation
        offset: @element.elements.offset

      @element.addEventListener "change", ((e) ->
        @settings = @serialize()
        @setDefaultOffset e.target.value  if e.target.name is "renderer"
        @syncOptions()
        @settings = @serialize()
        config =
          renderer: @settings.renderer
          interpolation: @settings.interpolation

        if @settings.offset is "value"
          config.unstack = true
          config.offset = "zero"
        else if @settings.offset is "expand"
          config.unstack = false
          config.offset = @settings.offset
        else
          config.unstack = false
          config.offset = @settings.offset
        @graph.configure config
        @graph.render()
        return
      ).bind(this), false
      return

    @serialize = ->
      values = {}
      pairs = $(@element).serializeArray()
      pairs.forEach (pair) ->
        values[pair.name] = pair.value
        return

      values

    @syncOptions = ->
      options = @rendererOptions[@settings.renderer]
      Array::forEach.call @inputs.interpolation, (input) ->
        if options.interpolation
          input.disabled = false
          input.parentNode.classList.remove "disabled"
        else
          input.disabled = true
          input.parentNode.classList.add "disabled"
        return

      Array::forEach.call @inputs.offset, ((input) ->
        if options.offset.filter((o) ->
          o is input.value
        ).length
          input.disabled = false
          input.parentNode.classList.remove "disabled"
        else
          input.disabled = true
          input.parentNode.classList.add "disabled"
        return
      ).bind(this)
      return

    @setDefaultOffset = (renderer) ->
      options = @rendererOptions[renderer]
      if options.defaults and options.defaults.offset
        Array::forEach.call @inputs.offset, ((input) ->
          if input.value is options.defaults.offset
            input.checked = true
          else
            input.checked = false
          return
        ).bind(this)
      return

    @rendererOptions =
      area:
        interpolation: true
        offset: [
          "zero"
          "wiggle"
          "expand"
          "value"
        ]
        defaults:
          offset: "zero"

      line:
        interpolation: true
        offset: [
          "expand"
          "value"
        ]
        defaults:
          offset: "value"

      bar:
        interpolation: false
        offset: [
          "zero"
          "wiggle"
          "expand"
          "value"
        ]
        defaults:
          offset: "zero"

      scatterplot:
        interpolation: false
        offset: ["value"]
        defaults:
          offset: "value"

    @initialize()
    return

  OScope = (timeInterval) ->
    
    #}, {
    #  color: palette.color(),
    #  data: seriesData[1],
    #  name: 'Shanghai'
    #}
    
    # add some data every so often
    
    #seriesData.shift();
    
    #data.forEach( function(series) {
    #  var amplitude = Math.random() * 20;
    #  var v = randomValue / 25  + counter++ +
    #      (Math.cos((index * counter * 11) / 960) + 2) * 15 +
    #      (Math.cos(index / 7) + 2) * 7 +
    #      (Math.cos(index / 17) + 2) * 1;
    #
    #  series.push( { x: (index * timeInterval) + timeBase, y: v + amplitude } );
    #} );
    
    #seriesData.push(100 * Math.sin(i / 10));
    addAnnotation = (force) ->
      
      #annotator.add(scope.seriesData[2][seriesData[2].length - 1].x, messages.shift());
      annotator.update()  if messages.length > 0 and (force or Math.random() >= 0.95)
      return
    @addData = (data, value) ->
      amplitude = Math.cos(timeBase / 50)
      index = data[0].length
      data.forEach (series) ->
        series.push
          x: (index * timeInterval) + timeBase
          y: value + amplitude

        return

      return

    @removeData = (data) ->
      data.forEach (series) ->
        series.shift()
        return

      timeBase += timeInterval
      return

    @seriesData = [
      []
      []
      []
      []
      []
      []
      []
      []
      []
    ]
    @timeInterval = timeInterval or 1
    timeBase = Math.floor(new Date().getTime() / 1000)
    i = 0

    while i < 150
      @addData @seriesData, 1
      i++
    palette = new Rickshaw.Color.Palette(scheme: "classic9")
    graph = new Rickshaw.Graph(
      element: document.getElementById("chart")
      width: 400
      height: 200
      renderer: "line"
      stroke: true
      preserve: true
      series: [
        color: palette.color()
        data: @seriesData[0]
        name: "Data1"
      ]
    )
    graph.render()
    hoverDetail = new Rickshaw.Graph.HoverDetail(
      graph: graph
      xFormatter: (x) ->
        new Date(x * 1000).toString()
    )
    annotator = new Rickshaw.Graph.Annotate(
      graph: graph
      element: document.getElementById("timeline")
    )
    legend = new Rickshaw.Graph.Legend(
      graph: graph
      element: document.getElementById("legend")
    )
    shelving = new Rickshaw.Graph.Behavior.Series.Toggle(
      graph: graph
      legend: legend
    )
    order = new Rickshaw.Graph.Behavior.Series.Order(
      graph: graph
      legend: legend
    )
    highlighter = new Rickshaw.Graph.Behavior.Series.Highlight(
      graph: graph
      legend: legend
    )

    ticksTreatment = "glow"
    xAxis = new Rickshaw.Graph.Axis.Time(
      graph: graph
      ticksTreatment: ticksTreatment
      timeFixture: new Rickshaw.Fixtures.Time.Local()
    )
    xAxis.render()

    yAxis = new Rickshaw.Graph.Axis.Y(
      graph: graph
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT
      ticksTreatment: ticksTreatment
    )
    yAxis.render()

    controls = new RenderControls(
      element: document.querySelector("form")
      graph: graph
    )
    messages = [
      "Changed home page welcome message"
      "Minified JS and CSS"
      "Changed button color from blue to green"
      "Refactored SQL query to use indexed columns"
      "Added additional logging for debugging"
      "Fixed typo"
      "Rewrite conditional logic for clarity"
      "Added documentation for new methods"
    ]
    i = 0
    _scope = this
    _seriesData = @seriesData
    setInterval (->
      _scope.removeData _seriesData, 1
      _scope.addData _seriesData, 1
      graph.update()
      return
    ), 50
    addAnnotation true
    setTimeout (->
      setInterval addAnnotation, 1000
      return
    ), 1000
    previewXAxis = new Rickshaw.Graph.Axis.Time(
      
      #graph: preview.previews[0],
      timeFixture: new Rickshaw.Fixtures.Time.Local()
      ticksTreatment: ticksTreatment
    )
    previewXAxis.render()
    return

  scope = new OScope(10)
  return

