(function() {
  define(['cs!component/components/WireElm', 'cs!component/components/ResistorElm', 'cs!component/components/GroundElm', 'cs!component/components/VoltageElm', 'cs!component/components/DiodeElm', 'cs!component/components/OutputElm', 'cs!component/components/SwitchElm', 'cs!component/components/CapacitorElm', 'cs!component/components/InductorElm', 'cs!component/components/SparkGapElm', 'cs!component/components/CurrentElm', 'cs!component/components/RailElm', 'cs!component/components/MosfetElm', 'cs!component/components/TransistorElm', 'cs!component/components/VarRailElm', 'cs!component/components/OpAmpElm', 'cs!component/components/ZenerElm', 'cs!component/components/Switch2Elm', 'cs!component/components/TextElm', 'cs!component/components/ProbeElm'], function(WireElm, ResistorElm, GroundElm, VoltageElm, DiodeElm, OutputElm, SwitchElm, CapacitorElm, InductorElm, SparkGapElm, CurrentElm, RailElm, MosfetElm, TransistorElm, VarRailElm, OpAmpElm, ZenerElm, Switch2Elm, TextElm, ProbeElm) {
    var ComponentRegistry;
    ComponentRegistry = (function() {
      function ComponentRegistry() {}

      ComponentRegistry.ComponentDefs = {
        'w': WireElm,
        'r': ResistorElm,
        'g': GroundElm,
        'l': InductorElm,
        'c': CapacitorElm,
        'v': VoltageElm,
        'd': DiodeElm,
        's': SwitchElm,
        '187': SparkGapElm,
        'a': OpAmpElm,
        'f': MosfetElm,
        'R': RailElm,
        '172': VarRailElm,
        'z': ZenerElm,
        'i': CurrentElm,
        't': TransistorElm,
        'S': Switch2Elm,
        'x': TextElm,
        'o': ProbeElm,
        'O': OutputElm
      };

      ComponentRegistry.registerAll = function() {
        var Component, _i, _len, _ref, _results;
        _ref = this.ComponentDefs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          Component = _ref[_i];
          if (process.env.NODE_ENV === 'development') {
            console.log("Registering Element: " + Component.prototype + " ");
          }
          _results.push(this.register(Component));
        }
        return _results;
      };

      ComponentRegistry.register = function(componentConstructor) {
        var dumpClass, dumpType, e, newComponent;
        if (componentConstructor == null) {
          console.error("nil constructor");
        }
        try {
          newComponent = new componentConstructor(0, 0, 0, 0, 0, null);
          dumpType = newComponent.getDumpType();
          dumpClass = componentConstructor;
          if (newComponent == null) {
            console.error("Component is nil!");
          }
          if (this.dumpTypes[dumpType] === dumpClass) {
            console.log("" + componentConstructor + " is a dump class");
            return;
          }
          if (this.dumpTypes[dumpType] != null) {
            console.log("Dump type conflict: " + dumpType + " " + this.dumpTypes[dumpType]);
            return;
          }
          return this.dumpTypes[dumpType] = componentConstructor;
        } catch (_error) {
          e = _error;
          return Logger.warn("Element: " + componentConstructor.prototype + " Not yet implemented: [" + e.message + "]");
        }
      };

      return ComponentRegistry;

    })();
    return ComponentRegistry;
  });

}).call(this);
