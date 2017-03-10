describe "Cloning a circuit", ->
  it "deep copies original circuit", ->
    voltdividesimple = JSON.parse(fs.readFileSync("./circuits/v5/voltdividesimple.json"))
    @Circuit = CircuitLoader.createCircuitFromJsonData("Simple Voltage Divider", voltdividesimple)

    @CircuitCopy = @Circuit.copy()

    expect(@CircuitCopy.Params).to.not.equal(@Circuit.Params)
    expect(@CircuitCopy.Params).to.eql(@Circuit.Params)

    expect(@CircuitCopy.elementList).to.not.equal(@Circuit.elementList)

    expect(@CircuitCopy.Params).to.eql(@Circuit.Params)

    for i in [0...@Circuit.elementList.length]
      expect(@CircuitCopy.elementList[i].toString()).to.equal(@Circuit.elementList[i].toString())
