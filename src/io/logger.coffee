class Logger

  errorStack = new Array()
  warningStack = new Array()

  @error: (msg) ->
    console.log "Error: " + msg
    errorStack.push msg

  @warn: (msg) ->
    console.error "Warning: " + msg
    warningStack.push msg


module.exports = Logger