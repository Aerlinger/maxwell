Circuit = require('../../src/circuit/circuit.coffee')
#@groundElm = require('../../src/circuit/circuitComponent.coffee')
GroundElm = require('../../src/circuit/components/GroundElm.coffee')


describe "Units test", ->
  beforeEach ->
    @Circuit = new Circuit()
    @groundElm = new GroundElm(100, 100, 100, 200)
    
  
  specify "zero ", ->
    @groundElm.getUnitText(1.99e-18, "Amps").should.equal "0.00 fAmps"
    @groundElm.getUnitText(0, "Amps").should.equal "0 Amps"

  specify "femto amps", ->
    @groundElm.getUnitText(1.99e-15, "Amps").should.equal "1.99 fAmps"
    @groundElm.getUnitText(999.99e-15, "Amps").should.equal "999.99 fAmps"
    @groundElm.getUnitText(1e-17, "Amps").should.equal "0.01 fAmps"

  specify "pico amps", ->
    @groundElm.getUnitText(1.99e-12, "Amps").should.equal "1.99 pAmps"
    @groundElm.getUnitText(999.99e-12, "Amps").should.equal "999.99 pAmps"
    @groundElm.getUnitText(1e-14, "Amps").should.equal "10.00 fAmps"

  specify "nano amps", ->
    @groundElm.getUnitText(1.99e-9, "Amps").should.equal "1.99 nAmps"
    @groundElm.getUnitText(999.99e-9, "Amps").should.equal "999.99 nAmps"
    @groundElm.getUnitText(1e-11, "Amps").should.equal "10.00 pAmps"

  specify "micro amps", ->
    @groundElm.getUnitText(1.99e-6, "Amps").should.equal "1.99 μAmps"
    @groundElm.getUnitText(999.99e-6, "Amps").should.equal "999.99 μAmps"
    @groundElm.getUnitText(1e-8, "Amps").should.equal "10.00 nAmps"

  specify "milli amps", ->
    @groundElm.getUnitText(1.99e-3, "Amps").should.equal "1.99 mAmps"
    @groundElm.getUnitText(999.99e-3, "Amps").should.equal "999.99 mAmps"
    @groundElm.getUnitText(1e-5, "Amps").should.equal "10.00 μAmps"

  specify "amps", ->
    @groundElm.getUnitText(1.99, "Amps").should.equal "1.99 Amps"
    @groundElm.getUnitText(999.99, "Amps").should.equal "999.99 Amps"
    @groundElm.getUnitText(1e-2, "Amps").should.equal "10.00 mAmps"

  specify "kilo Amps", ->
    @groundElm.getUnitText(1.99e3, "Amps").should.equal "1.99 kAmps"
    @groundElm.getUnitText(999.99e3, "Amps").should.equal "999.99 kAmps"
    @groundElm.getUnitText(1e1, "Amps").should.equal "10.00 Amps"

  specify "Mega Amps", ->
    @groundElm.getUnitText(1.99e6, "Amps").should.equal "1.99 MAmps"
    @groundElm.getUnitText(999.99e6, "Amps").should.equal "999.99 MAmps"
    @groundElm.getUnitText(1e4, "Amps").should.equal "10.00 kAmps"

  specify "Giga Amps", ->
    @groundElm.getUnitText(1.99e9, "Amps").should.equal "1.99 GAmps"
    @groundElm.getUnitText(999.99e9, "Amps").should.equal "999.99 GAmps"
    @groundElm.getUnitText(1e7, "Amps").should.equal "10.00 MAmps"
