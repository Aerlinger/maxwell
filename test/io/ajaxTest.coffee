# <DEFINE>
define ['jquery'], ($) ->
# </DEFINE>


  describe "Ajax Test", ->
    it "should load JSON", ->
      $.getJSON '../circuits/voltdividesimple.json', (data) ->
        console.log data
