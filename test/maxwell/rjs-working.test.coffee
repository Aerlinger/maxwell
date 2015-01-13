#requirejs = require("requirejs");
#requirejs.config({
#  baseUrl: 'src',
#  nodeRequire: require,
#  packages: [
#    {
#      name: 'cs',
#      location: '../bower_components/require-cs/',
#      main: 'cs'
#    },
#    {
#      name: 'coffee-script',
#      location: '../bower_components/coffee-script/extras',
#      main: 'coffee-script'
#    }
#  ]
#});

describe "RequireJS modules", ->
  before (done) ->
    requirejs ['cs!Sample', 'cs!util/formatUtils'], (Sample, FormatUtils) =>
      @someVar = "a";
      console.log("Before!")
      @sample = Sample
      @FormatUtils = FormatUtils
      console.log(Sample)
      done()


  it "DEFINES MODULE", ->
    @sample.should.equal({})

  it "Formats", ->
    @FormatUtils.showFormat(2.9999999).should.equal("asdfsdf")

  it "loads rjs", ->
    @someVar.should.equal("a")
