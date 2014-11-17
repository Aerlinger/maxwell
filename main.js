// This script gets run before any other Javascript in the library:

(function() {
  "use strict";

  console.log("Loading RequireJS configuration...");

  var Config = {
    'paths': {
      // LIBRARIES:
      jquery: 'bower_components/jquery/dist/jquery.min',
      underscore: 'bower_components/underscore/underscore-min',
      'coffee-script': 'libs/coffee-script',
      cs: 'libs/cs',
      color: 'libs/color',
      mocha: 'libs/mocha',
      chai: 'libs/chai',

      // CORE:
      Circuit: 'src/core/circuit',
      SimulationParams: 'src/core/simulationParams',

      // ENGINE:
      MatrixStamper: 'src/engine/matrixStamper',
      RowInfo: 'src/engine/rowInfo',
      CircuitSolver: 'src/engine/circuitSolver',
      Hint: 'src/engine/hint',
      CircuitNode: 'src/engine/graphTraversal/circuitNode',
      CircuitNodeLink: 'src/engine/graphTraversal/circuitNodeLink',
      Pathfinder: 'src/engine/graphTraversal/pathfinder',

      // SETTINGS:
      Settings: 'src/settings/settings',

      // IO:
      Logger: 'src/io/logger',
      CircuitLoader: 'src/io/circuitLoader',
      ConfigurationLoader: 'src/io/configurationLoader',

      // GEOM:
      Point: 'src/geom/point',
      Polygon: 'src/geom/polygon',
      Rectangle: 'src/geom/rectangle',

      // RENDERING:
      CircuitCanvas: 'src/render/circuitCanvas',
      CanvasContext: 'src/render/canvasContext',
      DrawHelper: 'src/render/drawHelper',

      // OSCILLOSCOPE:
      Oscilloscope: 'src/scope/oscilloscope',

      // STATE:
      CircuitState: 'src/state/circuitState',
      ColorMapState: 'src/state/colorMapState',
      KeyboardState: 'src/state/keyboardState',
      MouseState: 'src/state/mouseState',

      // COMPONENT:
      CircuitComponent: 'src/component/circuitComponent',
      ComponentRegistry: 'src/component/componentRegistry',

      // COMPONENTS:
      Diode: 'src/component/components/core/Diode',

      AntennaElm: 'src/component/components/AntennaElm',
      CapacitorElm: 'src/component/components/CapacitorElm',
      CurrentElm: 'src/component/components/CurrentElm',
      DiodeElm: 'src/component/components/DiodeElm',
      GroundElm: 'src/component/components/GroundElm',
      InductorElm: 'src/component/components/InductorElm',
      JFetElm: 'src/component/components/JFetElm',
      LogicInputElm: 'src/component/components/LogicInputElm',
      LogicOutputElm: 'src/component/components/LogicOutputElm',
      MosfetElm: 'src/component/components/MosfetElm',
      OpAmpElm: 'src/component/components/OpAmpElm',
      OutputElm: 'src/component/components/OutputElm',
      ProbeElm: 'src/component/components/ProbeElm',
      RailElm: 'src/component/components/RailElm',
      ResistorElm: 'src/component/components/ResistorElm',
      SparkGapElm: 'src/component/components/SparkGapElm',
      SweepElm: 'src/component/components/SweepElm',
      Switch2Elm: 'src/component/components/Switch2Elm',
      SwitchElm: 'src/component/components/SwitchElm',
      TextElm: 'src/component/components/TextElm',
      TransistorElm: 'src/component/components/TransistorElm',
      VarRailElm: 'src/component/components/VarRailElm',
      VoltageElm: 'src/component/components/VoltageElm',
      WireElm: 'src/component/components/WireElm',

      // USER INTERFACE:
      CommandHistory: 'src/ui/commandHistory',
      Grid: 'src/ui/grid',
      KeyHandler: 'src/ui/keyHandler',
      MouseHandler: 'src/ui/mouseHandler',

      // Utils
      ColorScale: 'src/util/colorScale',
      Module: 'src/util/module',
      Observer: 'src/util/observer',
      ColorPalette: 'src/util/colorPalette',
      MathUtils: 'src/util/mathUtils',
      ArrayUtils: 'src/util/arrayUtils',
      FormatUtils: 'src/util/formatUtils',
      ConsoleUtils: 'src/util/consoleUtils',
      Units: 'src/util/units',


      ////////////////////////////////////////////////////////
      // TESTS:
      ////////////////////////////////////////////////////////

      TestHelper: 'test/_helper',
      CircuitTest: 'test/circuit/circuitTest',

      // Components
      ResistorTest: 'test/component/components/resistorTest',
      VoltageElmTest: 'test/component/components/voltageTest',
      GroundTest: 'test/component/components/groundTest',
      WireTest: 'test/component/components/wireTest',
      CapacitorTest: 'test/component/components/capacitorTest',
      ComponentTest: 'test/component/circuitComponentTest',

      // Engine:
      ComponentNodeLinkTest: 'test/circuit/circuitNodeLinkTest',
      ComponentNodeTest: 'test/circuit/circuitNodeTest',

      // Solvers
      CircuitSolverTest: 'test/solver/circuitSolverTest',
      MatrixSolverTest: 'test/solver/matrixSolverTest',
      CircuitStamperTest: 'test/solver/matrixStamperTest',

      // Utils
      ArraysTest: 'test/util/arraysTest',
      FormatsTest: 'test/util/formatsTest',
      MathTest: 'test/util/mathTest',
      UnitsTest: 'test/util/unitsTest',

      // IO
      AjaxTest: 'test/io/ajaxTest',
      CircuitLoaderTest: 'test/io/circuitLoaderTest',

      // UI
      PrimitivesTest: 'test/util/primitivesTest',

      // Integration tests:
      voltdivideIntegration: 'test/integration/voltdividesimpleTest',
      observerTest: 'test/observers/observerTest'
    },
    shim: {
      'underscore': {
        exports: '_'
      },
      'jquery': {
        exports: '$'
      }
    },
    packages: [
      {
        name: 'cs',
        location: 'bower_components/require-cs/',
        main: 'cs'
      },
      {
        name: 'coffee-script',
        location: 'bower_components/coffeescript/',
        main: 'extras/coffee-script'
      }
    ]
  };

  // If _TEST_MODE, configure to '../' since our tests are stored in './test/'.
  if (typeof _TEST_MODE !== 'undefined' && _TEST_MODE === true) {
    Config.baseUrl = '../src/';
    require.config(Config);
    return true;
  }

  // If 'define' exists as a function, run main.
  if (typeof define === 'function') {
    require.config(Config);
    return true;
  }
  // If exports exists as an object, CommonJS.
  if (typeof module === 'object') {
    module.exports = Config;
  }
  // If module exists as an object, use CommonJS-like module exports for node.
  if (typeof exports === 'object') {
    exports.RJSConfig = Config;
  }

  return Config;
}());



require([
  // Load our app module and pass it to our definition function
  'cs!Circuit',
  'cs!CircuitCanvas',
  'cs!CircuitLoader',

  'cs!ArrayUtils',
  'cs!ConsoleUtils'

], function (Circuit, CircuitCanvas, CircuitLoader) {
  var circuitName = $('canvas').data('circuit');
  var circuitFileName = "../circuits/" + circuitName + ".json";

  $(document).ready(function (event) {
    var canvas = $('canvas.maxwell');

    if (canvas && circuitName) {
      CircuitLoader.createCircuitFromJSON(circuitFileName, function (circuit) {
        "use strict";
        console.log("Loading: " + circuitFileName);

        new CircuitCanvas(circuit, canvas);

        circuit.updateCircuit();

        setInterval(function () {
          circuit.updateCircuit();
        }, 0);
      });
    } else {
      console.error("No circuit definition provided");
    }
  });

  if (window.location.toString().match("/test")) {
    runTests();
  }
});

//
function runTests() {
  "use strict";

  mocha.setup('bdd');

  require([
    'test/_helper',
    'cs!CircuitTest',
    'cs!ResistorTest',
    'cs!VoltageElmTest',
    'cs!GroundTest',
    'cs!WireTest',
    'cs!CapacitorTest',
    'cs!ComponentTest',
    'cs!ComponentNodeLinkTest',
    'cs!ComponentNodeTest',

    'cs!CircuitSolverTest',
    'cs!MatrixSolverTest',
    'cs!CircuitStamperTest',

    'cs!ArraysTest',
    'cs!FormatsTest',
    'cs!MathTest',
    'cs!UnitsTest',
    'cs!UnitsTest',

    'cs!PrimitivesTest',
    'cs!AjaxTest',
    'cs!CircuitLoaderTest',
    'cs!voltdivideIntegration',
    'cs!observerTest'
  ], function () {
    "use strict";
    mocha.run();
  });
}
