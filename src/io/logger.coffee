class Logger

  errorStack = new Array()
  warningStack = new Array()

  @error: (msg) ->
    console.log "Error: " + msg
    errorStack.push msg
    #TODO: drawError()

  @warn: (msg) ->
    console.warn "Warning: " + msg
    warningStack.push msg
    #TODO: drawWarning()

  drawWarning: (context) ->
    msg = ""

    for warning in warningStack
      msg += warning + "\n"

    console.error "Simulation Error: " + msg
    context.fillText msg, 150, 70

  drawError: (context) ->
    msg = ""

    for error in errorStack
      msg += error + "\n"

    console.error "Simulation Error: " + msg
    context.fillText msg, 150, 50

module.exports = Logger