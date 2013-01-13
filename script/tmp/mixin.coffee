# <DEFINE>
define([
], (
) ->
# </DEFINE>


global.extend = (obj, mixin) ->
  obj[name] = method for name, method of mixin
  obj

global.include = (klass, mixin) ->
  extend klass.prototype, mixin
