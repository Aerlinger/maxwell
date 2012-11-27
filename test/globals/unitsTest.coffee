describe "Units test", ->

  specify "zero ", ->
    getUnitText(1.99e-18, "Amps").should.equal "0.00 fAmps"
    getUnitText(0, "Amps").should.equal "0 Amps"

  specify "femto amps", ->
    getUnitText(1.99e-15, "Amps").should.equal "1.99 fAmps"
    getUnitText(999.99e-15, "Amps").should.equal "999.99 fAmps"
    getUnitText(1e-17, "Amps").should.equal "0.01 fAmps"

  specify "pico amps", ->
    getUnitText(1.99e-12, "Amps").should.equal "1.99 pAmps"
    getUnitText(999.99e-12, "Amps").should.equal "999.99 pAmps"
    getUnitText(1e-14, "Amps").should.equal "10.00 fAmps"

  specify "nano amps", ->
    getUnitText(1.99e-9, "Amps").should.equal "1.99 nAmps"
    getUnitText(999.99e-9, "Amps").should.equal "999.99 nAmps"
    getUnitText(1e-11, "Amps").should.equal "10.00 pAmps"

  specify "micro amps", ->
    getUnitText(1.99e-6, "Amps").should.equal "1.99 uAmps"
    getUnitText(999.99e-6, "Amps").should.equal "999.99 uAmps"
    getUnitText(1e-8, "Amps").should.equal "10.00 nAmps"

  specify "milli amps", ->
    getUnitText(1.99e-3, "Amps").should.equal "1.99 mAmps"
    getUnitText(999.99e-3, "Amps").should.equal "999.99 mAmps"
    getUnitText(1e-5, "Amps").should.equal "10.00 uAmps"

  specify "amps", ->
    getUnitText(1.99, "Amps").should.equal "1.99 Amps"
    getUnitText(999.99, "Amps").should.equal "999.99 Amps"
    getUnitText(1e-2, "Amps").should.equal "10.00 mAmps"

  specify "kilo Amps", ->
    getUnitText(1.99e3, "Amps").should.equal "1.99 kAmps"
    getUnitText(999.99e3, "Amps").should.equal "999.99 kAmps"
    getUnitText(1e1, "Amps").should.equal "10.00 Amps"

  specify "Mega Amps", ->
    getUnitText(1.99e6, "Amps").should.equal "1.99 MAmps"
    getUnitText(999.99e6, "Amps").should.equal "999.99 MAmps"
    getUnitText(1e4, "Amps").should.equal "10.00 kAmps"

  specify "Giga Amps", ->
    getUnitText(1.99e9, "Amps").should.equal "1.99 GAmps"
    getUnitText(999.99e9, "Amps").should.equal "999.99 GAmps"
    getUnitText(1e7, "Amps").should.equal "10.00 MAmps"