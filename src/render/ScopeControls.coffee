# <DEFINE>
define ['jquery'], ($) ->
# </DEFINE>
  class ScopeControls

    constructor: (@element, @graph) ->
      @settings = @serialize()

      @inputs = {
        renderer: @element.elements.renderer,
        interpolation: @element.elements.interpolation,
        offset: @element.elements.offset
      }

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
#        @graph.render()

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