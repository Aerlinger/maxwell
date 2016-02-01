class SimulationFrame

  constructor: (circuit) ->
    solver = circuit.Solver

    @frameNumber = circuit.iterations
    @time = circuit.time

    @circuitMatrix = solver.circuitMatrix
    @circuitRightSide = solver.circuitRightSide

    @elementStates = [{
      dumpType: elm.getDumpType(),
      volts: elm.volts,
      current: elm.current,
      curcount: elm.curcount
    } for elm in circuit.getElements()]

  toJson: ->
    {
      frameNumber: @frameNumber
      time: @time
      circuitMatrix: @circuitMatrix
      circuitRightSide: @circuitRightSide
      elementStates: @elementStates
    }


module.exports = SimulationFrame
