# <DEFINE>
define [], () ->
# </DEFINE>

  window.extend = (obj, mixin) ->
    obj[name] = method for name, method of mixin
    obj

  window.include = (klass, mixin) ->
    extend klass.prototype, mixin
