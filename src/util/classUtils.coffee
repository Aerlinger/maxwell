# <DEFINE>
define [], () ->
# </DEFINE>

  # Todo: needs more tests
  class ClassUtils

    @extend: (obj, mixin) ->
      obj[name] = method for name, method of mixin
      obj

    @include: (klass, mixin) ->
      extend klass.prototype, mixin

    @type: (o) ->
      return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];

  return ClassUtils
