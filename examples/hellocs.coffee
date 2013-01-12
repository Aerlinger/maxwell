define [], () ->

  class Hello

    constructor: (hello) ->
      @hello = hello

    sayHi: () ->
      console.log @hello

  return Hello