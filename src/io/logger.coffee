# <DEFINE>
define [], () ->
# </DEFINE>

  class Logger

    errorStack = new Array()
    warningStack = new Array()

    @error: (msg) ->
      console.error "Error: " + msg
      errorStack.push msg

    @warn: (msg) ->
      console.error "Warning: " + msg
      warningStack.push msg


  return Logger
