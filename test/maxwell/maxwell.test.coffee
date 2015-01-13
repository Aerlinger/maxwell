describe "Maxwell", ->
  before (done) ->
    requirejs ['cs!Maxwell'], (Maxwell) =>
      @Maxwell = Maxwell
      done()

  it "returns true", (done) ->
    expect(@Maxwell).to.be
    done()
 