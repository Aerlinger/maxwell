describe "RequireJS modules", ->
  before (done) ->
    this.timeout(5000);
    requirejs ['cs!util/formatUtils'], (FormatUtils) =>
      @FormatUtils = FormatUtils
      done()

#  it "DEFINES MODULE", ->
#    expect(@sample).to.eql({"LOL": "SUP"})
#
  it "Formats", (done) ->
    this.timeout(5000);
    expect(@FormatUtils.showFormat(2.9999999)).to.eql('3.0')
    done()
