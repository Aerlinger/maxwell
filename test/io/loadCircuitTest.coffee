describe "CircuitLoader", ->
  describe "reads voltdividesimple.json and", ->
    before ->
      voltdividesimple = JSON.parse(fs.readFileSync("./circuits/v5/voltdividesimple.json"))

      @circuit = CircuitLoader.createCircuitFromJsonData(voltdividesimple)

    it "have only 7 elements", ->
      expect(@circuit.numElements()).to.equal 7

    describe "can load parameters", ->
      it "has correct completionStatus", ->
        expect(@circuit.Params.completionStatus).to.equal "in development"

      it "has correct currentSpeed", ->
        expect(@circuit.Params.currentSpeed).to.equal 103

      it "has correct flags", ->
        expect(@circuit.Params.flags).to.equal 1

      it "has correct unique name", ->
        console.log @circuit.Params.name
        expect(@circuit.name).to.equal "untitled"

      it "has correct power range", ->
        expect(@circuit.Params.powerRange).to.equal 62.0

      it "has correct simSpeed", ->
        expect(@circuit.Params.simSpeed).to.equal 116

      it "has correct timeStep", ->
        expect(@circuit.Params.timeStep).to.equal 5.0e-6

      it "has correct title", ->
        expect(@circuit.Params.title).to.equal "Default"

      it "has correct voltage_range", ->
        expect(@circuit.Params.voltageRange).to.equal 10.0
