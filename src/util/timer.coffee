# A basic timer used for performance profiling
#
# Example:
#   Timer.tick("factor_matrix")
#     .
#     .
#     .
#   time_elapsed = Timer.tock("factor_matrix")
#
# @author Anthony Erlinger

define [], () ->
  class Timer
    @tick: (timer_name) ->
      @timers ||= {}
      @timers[timer_name] = (new Date()).getTime()

    @tock: (timer_name) ->
      @timers ||= {}
      if @timers[timer_name]
        return (new Date()).getTime() - @timers[timer_name]
      else
        console.log "Could not find timer #{timer_name}"
        #todo: throw exception "timer not found"

  return Timer