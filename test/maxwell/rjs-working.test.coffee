describe "RequireJS modules", ->
  before (done) ->
    requirejs ['cs!Sample', 'cs!util/formatUtils'], (Sample, FormatUtils) =>
      @sample = Sample
      @FormatUtils = FormatUtils
      done()

  it "DEFINES MODULE", ->
    expect(@sample).to.eql({"LOL": "SUP"})

  it "Formats", ->
    expect(@FormatUtils.showFormat(2.9999999)).to.eql('3.0')
