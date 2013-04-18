# <DEFINE>
define ['cs!Units'], (Units) ->
# </DEFINE>


  describe "Units test", ->

    specify "zero ", ->
      Units.getUnitText(1.99e-18, "Amps").should.equal "0.00 fAmps"
      Units.getUnitText(0, "Amps").should.equal "0 Amps"

    specify "femto amps", ->
      Units.getUnitText(1.99e-15, "Amps").should.equal "1.99 fAmps"
      Units.getUnitText(999.99e-15, "Amps").should.equal "999.99 fAmps"
      Units.getUnitText(1e-17, "Amps").should.equal "0.01 fAmps"

    specify "pico amps", ->
      Units.getUnitText(1.99e-12, "Amps").should.equal "1.99 pAmps"
      Units.getUnitText(999.99e-12, "Amps").should.equal "999.99 pAmps"
      Units.getUnitText(1e-14, "Amps").should.equal "10.00 fAmps"

    specify "nano amps", ->
      Units.getUnitText(1.99e-9, "Amps").should.equal "1.99 nAmps"
      Units.getUnitText(999.99e-9, "Amps").should.equal "999.99 nAmps"
      Units.getUnitText(1e-11, "Amps").should.equal "10.00 pAmps"

    specify "micro amps", ->
      Units.getUnitText(1.99e-6, "Amps").should.equal "1.99 uAmps"
      Units.getUnitText(999.99e-6, "Amps").should.equal "999.99 uAmps"
      Units.getUnitText(1e-8, "Amps").should.equal "10.00 nAmps"

    specify "milli amps", ->
      Units.getUnitText(1.99e-3, "Amps").should.equal "1.99 mAmps"
      Units.getUnitText(999.99e-3, "Amps").should.equal "999.99 mAmps"
      Units.getUnitText(1e-5, "Amps").should.equal "10.00 uAmps"

    specify "amps", ->
      Units.getUnitText(1.99, "Amps").should.equal "1.99 Amps"
      Units.getUnitText(999.99, "Amps").should.equal "999.99 Amps"
      Units.getUnitText(1e-2, "Amps").should.equal "10.00 mAmps"

    specify "kilo Amps", ->
      Units.getUnitText(1.99e3, "Amps").should.equal "1.99 kAmps"
      Units.getUnitText(999.99e3, "Amps").should.equal "999.99 kAmps"
      Units.getUnitText(1e1, "Amps").should.equal "10.00 Amps"

    specify "Mega Amps", ->
      Units.getUnitText(1.99e6, "Amps").should.equal "1.99 MAmps"
      Units.getUnitText(999.99e6, "Amps").should.equal "999.99 MAmps"
      Units.getUnitText(1e4, "Amps").should.equal "10.00 kAmps"

    specify "Giga Amps", ->
      Units.getUnitText(1.99e9, "Amps").should.equal "1.99 GAmps"
      Units.getUnitText(999.99e9, "Amps").should.equal "999.99 GAmps"
      Units.getUnitText(1e7, "Amps").should.equal "10.00 MAmps"
