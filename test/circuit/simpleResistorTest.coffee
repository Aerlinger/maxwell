describe "Simple single resistor circuit", ->
  beforeEach ->
    @json = {
      params: {
        "completion_status": "under_development",
        "created_at": null,
        "current_speed": 50.0,
        "description": null,
        "flags": 1,
        "id": null,
        "name_unique": "ohms.txt",
        "power_range": 50.0,
        "sim_speed": 10.391409633455755,
        "time_step": 5.0e-06,
        "title": "Ohm's Law",
        "topic": "Basics",
        "updated_at": null,
        "voltage_range": 5.0
      },
      components: [
        {
          "name": "VarRailElm",
          "pos": [256, 176, 256, 128],
          "flags": 0,
          "params": {
            "waveform": 6,
            "frequency": 5,
            "maxVoltage": 5,
            "bias": 0,
            "phaseShift": 0,
            "dutyCycle": 0.5,
            "sliderText": "Voltage"
          }
        },
        {
          "name": "ResistorElm",
          "pos": [256, 176, 256, 304],
          "flags": "0",
          "params": {
            resistance: 100.0
          }
        },
        {
          "name": "GroundElm",
          "pos": [256, 304, 256, 352],
          "flags": "0",
          "params": {}
        }
      ]
    }

    @Circuit = CircuitLoader.createCircuitFromJsonData(@json)


  it "has 3 elements", ->
    expect(@Circuit.numElements()).to.equal(3)

  it "has correct initialization", ->
    expect(@Circuit.time).to.equal(0)
    expect(@Circuit.iterations).to.equal(0)

  describe "before Analysis", ->
    beforeEach ->
      @Solver = @Circuit.Solver

    it "exists", ->
      expect(@Solver).to.be

    it "initializes arrays to correct values", ->
      expect(@Solver.circuitMatrix).to.deep.equal([])
      expect(@Solver.circuitRightSide).to.deep.equal([])
      expect(@Solver.origMatrix).to.deep.equal([])
      expect(@Solver.origRightSide).to.deep.equal([])

    describe "After reconstructing circuit", ->
      beforeEach ->
        @Solver.reconstruct()

      it "Sets circuitMatrix to correct value", ->
        expect(@Solver.circuitMatrix).to.deep.equal(
          [
            [1.0, 0.0, 0.0],
            [0.01, -1.0, 0.0],
            [-0.01, -0.0, -1.0]
          ]
        )

      it "Sets circuitRightSide to correct value", ->
        expect(@Solver.circuitRightSide).to.deep.equal([0, 0, 0])

      xit "Sets circuitRowInfo to correct value", ->
        @ctx = "asdf"

        expect(@Solver.circuitRowInfo).to.deep.equal([
          {
            "dropRow": false
            "lsChanges": false
            "mapCol": 0
            "mapRow": 0
            "nodeEq": 0
            "rsChanges": false
            "type": 0
            "value": 0
          },
          {
            "dropRow": false
            "lsChanges": false
            "mapCol": -1
            "mapRow": 1
            "nodeEq": 0
            "rsChanges": false
            "type": 1
            "value": 0
          },
          {
            "dropRow": false
            "lsChanges": false
            "mapCol": 1
            "mapRow": 2
            "nodeEq": 0
            "rsChanges": true
            "type": 0
            "value": 0
          },
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
        ])

      it "Sets circuitPermute to correct value", ->
        expect(@Solver.circuitPermute).to.deep.equal([2, 2, 2, 0])

      describe.skip "solving circuit", ->
        it "sets correct voltage on resistor", ->
          @Circuit.updateCircuit()

          resistor = @Circuit.getElmByIdx(1)
          expect(resistor.getVoltageDiff()).to.eql(5)

        it "increments frames", ->
          @Circuit.updateCircuit()
          expect(@Circuit.getIterationCount()).to.equal(1)

        it "increments time", ->
          expect(@Circuit.time).to.equal(0)

          @Circuit.updateCircuit()
          expect(@Circuit.time).to.equal(1 * 5.0e-06)



