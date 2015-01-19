class Observer

  addObserver: (event, fn) ->
    @_events ||= {}
    @_events[event] ||= []
    @_events[event].push(fn)

  removeObserver: (event, fn) ->
    @_events ||= {}

    if @_events[event]
      @_events[event].splice(@_events[event].indexOf(fn), 1)

  notifyObservers: (event, args...) ->
    @_events ||= {}

    if @_events[event]
      for callback in @_events[event]
        callback.apply(this, args)

  getObservers: () ->
    return @_events

module.exports = Observer
