describe "RequireJS modules", ->
  before (done) ->
    requirejs ['cs!Sample', 'cs!util/formatUtils'], (Sample, FormatUtils) =>
      @sample = Sample
      @FormatUtils = FormatUtils
      done()

  it "DEFINES MODULE", ->
    @sample.should.equal({})

  it "Formats", ->
    @FormatUtils.showFormat(2.9999999).should.equal("asdfsdf")

