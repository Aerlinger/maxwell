# <DEFINE>
define ['jquery', 'Rickshaw'], ($, Rickshaw) ->
# </DEFINE>
  class ScopeControls

    constructor: (@graph) ->
      @element = document.querySelector("form")
      chartDiv = document.getElementById("chart")
      legendDiv = document.getElementById("legend")
      timelineDiv = document.getElementById("timeline")

      @settings = @serialize()

      @inputs = {
        renderer: @element.elements.renderer,
        interpolation: @element.elements.interpolation,
        offset: @element.elements.offset
      }

      new Rickshaw.Graph.HoverDetail({
        graph: @graph,
        xFormatter: (x) ->
          x.toString()
      })

      legend = new Rickshaw.Graph.Legend({
        graph: @graph,
        element: legendDiv
      })

      shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: @graph,
        legend: legend
      })

      order = new Rickshaw.Graph.Behavior.Series.Order({
        graph: @graph,
        legend: legend
      })


      #      @annotator = new Rickshaw.Graph.Annotate graph: graph,
      #        element: document.getElementById("timeline")

      highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: @graph,
        legend: legend
      })

      ticksTreatment = "glow"

      xAxis = new Rickshaw.Graph.Axis.Time({
        graph: @graph,
        ticksTreatment: ticksTreatment,
        timeFixture: new Rickshaw.Fixtures.Time.Local()
      })
      xAxis.render()

      yAxis = new Rickshaw.Graph.Axis.Y({
        graph: @graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment
      })
      yAxis.render()

      @element.addEventListener "change", ((e) =>
        @settings = @serialize()

        if e.target.name is "renderer"
          @setDefaultOffset e.target.value

        @syncOptions()

        @settings = @serialize()

        config = {
          renderer: @settings.renderer,
          interpolation: @settings.interpolation
        }

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

        return
      ), false


    serialize: ->
      values = {}
      pairs = $(@element).serializeArray()
      pairs.forEach (pair) ->
        values[pair.name] = pair.value
        return

      values

    syncOptions: ->
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
        if options.offset.filter((offset) ->
          offset is input.value
        ).length
          input.disabled = false
          input.parentNode.classList.remove "disabled"
        else
          input.disabled = true
          input.parentNode.classList.add "disabled"
        return
      ).bind(this)

      return

    setDefaultOffset: (renderer) ->
      options = @rendererOptions[renderer]
      if options.defaults and options.defaults.offset
        Array::forEach.call @inputs.offset, (input) =>
          if input.value is options.defaults.offset
            input.checked = true
          else
            input.checked = false
          return

      return

    rendererOptions:
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

    initialize: ->
      return


  return ScopeControls