Maxwell = require('../../src/Maxwell');

describe "Maxwell", ->
  it "Maxwell can be found", (done) ->
    expect(Maxwell).to.be
    done()

  it "Maxwell has the correct functions", ->
    expect(Maxwell.createCircuit).to.be
 