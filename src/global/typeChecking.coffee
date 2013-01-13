# <DEFINE>
define [], () ->
# </DEFINE>


global.type = (o) ->
  return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
