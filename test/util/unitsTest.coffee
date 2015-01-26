# <DEFINE>
define ['cs!DrawHelper'], (DrawHelper) ->
# </DEFINE>


  describe "Units test", ->

    specify "zero ", ->
      DrawHelper.getUnitText(1.99e-18, "Amps").should.equal "0.00 fAmps"
      DrawHelper.getUnitText(0, "Amps").should.equal "0 Amps"

    specify "femto amps", ->
      DrawHelper.getUnitText(1.99e-15, "Amps").should.equal "1.99 fAmps"
      DrawHelper.getUnitText(999.99e-15, "Amps").should.equal "999.99 fAmps"
      DrawHelper.getUnitText(1e-17, "Amps").should.equal "0.01 fAmps"

    specify "pico amps", ->
      DrawHelper.getUnitText(1.99e-12, "Amps").should.equal "1.99 pAmps"
      DrawHelper.getUnitText(999.99e-12, "Amps").should.equal "999.99 pAmps"
      DrawHelper.getUnitText(1e-14, "Amps").should.equal "10.00 fAmps"

    specify "nano amps", ->
      DrawHelper.getUnitText(1.99e-9, "Amps").should.equal "1.99 nAmps"
      DrawHelper.getUnitText(999.99e-9, "Amps").should.equal "999.99 nAmps"
      DrawHelper.getUnitText(1e-11, "Amps").should.equal "10.00 pAmps"

    specify "micro amps", ->
      DrawHelper.getUnitText(1.99e-6, "Amps").should.equal "1.99 uAmps"
      DrawHelper.getUnitText(999.99e-6, "Amps").should.equal "999.99 uAmps"
      DrawHelper.getUnitText(1e-8, "Amps").should.equal "10.00 nAmps"

    specify "milli amps", ->
      DrawHelper.getUnitText(1.99e-3, "Amps").should.equal "1.99 mAmps"
      DrawHelper.getUnitText(999.99e-3, "Amps").should.equal "999.99 mAmps"
      DrawHelper.getUnitText(1e-5, "Amps").should.equal "10.00 uAmps"

    specify "amps", ->
      DrawHelper.getUnitText(1.99, "Amps").should.equal "1.99 Amps"
      DrawHelper.getUnitText(999.99, "Amps").should.equal "999.99 Amps"
      DrawHelper.getUnitText(1e-2, "Amps").should.equal "10.00 mAmps"

    specify "kilo Amps", ->
      DrawHelper.getUnitText(1.99e3, "Amps").should.equal "1.99 kAmps"
      DrawHelper.getUnitText(999.99e3, "Amps").should.equal "999.99 kAmps"
      DrawHelper.getUnitText(1e1, "Amps").should.equal "10.00 Amps"

    specify "Mega Amps", ->
      DrawHelper.getUnitText(1.99e6, "Amps").should.equal "1.99 MAmps"
      DrawHelper.getUnitText(999.99e6, "Amps").should.equal "999.99 MAmps"
      DrawHelper.getUnitText(1e4, "Amps").should.equal "10.00 kAmps"

    specify "Giga Amps", ->
      DrawHelper.getUnitText(1.99e9, "Amps").should.equal "1.99 GAmps"
      DrawHelper.getUnitText(999.99e9, "Amps").should.equal "999.99 GAmps"
      DrawHelper.getUnitText(1e7, "Amps").should.equal "10.00 MAmps"
