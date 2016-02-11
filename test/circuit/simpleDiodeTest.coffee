CircuitLoader = require('../../src/io/CircuitLoader.coffee')
#Circuit = require('../../src/circuit/circuit.coffee')

describe "Simple single diode circuit", ->
  beforeEach (done) ->
    @json = [
      {
        "completion_status": "under_development",
        "created_at": null,
        "current_speed": 100,
        "description": null,
        "flags": 1,
        "id": null,
        "name_unique": "diodecurve.txt",
        "power_range": 50.0,
        "sim_speed": 195.812258501325767,
        "time_step": 5.0e-06,
        "title": "Diode I/V Curve",
        "topic": "Diodes",
        "updated_at": null,
        "voltage_range": 2.0
      },
      {
        "sym": "R",
        "x1": "288",
        "y1": "208",
        "x2": "288",
        "y2": "160",
        "flags": "0",
        "params": [
          "3",
          "50.0",
          "0.65",
          "0.25",
          "0.0",
          "0.5"
        ]
      },
      {
        "sym": "d",
        "x1": "288",
        "y1": "208",
        "x2": "288",
        "y2": "288",
        "flags": "0",
        "params": []
      },
      {
        "sym": "g",
        "x1": "288",
        "y1": "288",
        "x2": "288",
        "y2": "320",
        "flags": "0",
        "params": []
      }
    ]

    @Circuit = CircuitLoader.createCircuitFromJsonData(@json)

    done()


  it "has 3 elements", ->
    expect(@Circuit.numElements()).to.equal(3)

  it "has ground connection", ->
    expect(@Circuit.numElements()).to.equal(3)

  it "has correct initialization", ->
    expect(@Circuit.time).to.equal(0)
    expect(@Circuit.frames).to.equal(0)

  describe "before Analysis", ->
    beforeEach (done) ->
      @Solver = @Circuit.Solver
      done()

    it "exists", ->
      expect(@Solver).to.be

    it "initializes arrays to correct values", ->
      expect(@Solver.circuitMatrix).to.deep.equal([])
      expect(@Solver.circuitRightSide).to.deep.equal([])
      expect(@Solver.origMatrix).to.deep.equal([])
      expect(@Solver.origRightSide).to.deep.equal([])

    describe "After reconstructing circuit", ->
      beforeEach (done) ->
        @Solver.reconstruct()
        done()

      it "Sets circuitMatrix to correct value", ->
        expect(@Solver.circuitMatrix).to.deep.equal(
          [
            [0, -1, 0]
            [0, 0, -1]
            [1, 0, 0]
          ]
        )

      it "Sets circuitRowInfo to correct value", ->
        expect(@Solver.circuitRowInfo, [
          {
            "dropRow": false
            "lsChanges": true
            "mapCol": 0
            "mapRow": 0
            "nodeEq": 0
            "rsChanges": false
            "type": 0
            "value": 0
          }
          {
            "dropRow": false
            "lsChanges": true
            "mapCol": -1
            "mapRow": 1
            "nodeEq": 0
            "rsChanges": false
            "type": 1
            "value": 0
          }
          {
            "dropRow": false
            "lsChanges": false
            "mapCol": 1
            "mapRow": 2
            "nodeEq": 0
            "rsChanges": true
            "type": 0
            "value": 0
          }
          {
            "dropRow": true
            "lsChanges": false
            "mapCol": 2
            "mapRow": -1
            "nodeEq": 0
            "rsChanges": false
            "type": 0
            "value": 0
          }
        ]).to.eql(@Solver.circuitRowInfo)

      it "Sets circuitPermute to correct value", ->
        expect(@Solver.circuitPermute).to.deep.equal([0, 0, 0, 0])

      it "Has converged", ->
        expect(@Solver.converged).to.be.true

      it "Has not converged", ->
        expect(@Solver.subIterations).to.eq(5000)

      describe "solving circuit", ->
        beforeEach (done) ->
          @Circuit.updateCircuit()
          done()

        it "sets correct voltage on resistor", ->
          resistor = @Circuit.getElmByIdx(1)
          expect(resistor.getVoltageDiff()).to.eql(-0.4)

        it "increments time", ->
          expect(@Circuit.time).to.equal(0.000005)

