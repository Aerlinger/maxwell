describe "Maxwell", ->
  before (done) ->
    requirejs ['cs!Maxwell'], (Maxwell) =>
      @Maxwell = Maxwell

  it "returns true", ->
    expect(Maxwell).to.be
 