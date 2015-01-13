// This script gets run before any other Javascript in the library:

requirejs.config({
  'paths': {
    // LIBRARIES:
    d3: 'bower_components/d3/d3',
    jquery: 'bower_components/jquery/dist/jquery.min',
    jqueryui: 'bower_components/jquery-ui/jquery-ui',
    Rickshaw: 'bower_components/rickshaw/rickshaw',
    underscore: 'bower_components/underscore/underscore',
    'coffee-script': 'bower_components/coffee-script/extras/coffee-script',
    //cs: 'bower_components/require-cs/cs',
    color: 'bower_components/one-color',
    mocha: 'bower_components/mocha/mocha',
    chai: 'bower_components/chai/chai',

    Maxwell: 'src/Maxwell',

    // CORE:
    ScopeControls: 'src/render/ScopeControls',
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
    ZenerElm: 'src/component/components/ZenerElm',

    // Utils
    Observer: 'src/util/observer',
    MathUtils: 'src/util/mathUtils',
    ArrayUtils: 'src/util/arrayUtils',
    FormatUtils: 'src/util/formatUtils',

    ////////////////////////////////////////////////////////
    // TESTS:
    ////////////////////////////////////////////////////////

    TestHelper: 'test/_helper',
    CircuitTest: 'test/circuit/circuitTest',
    MaxwellTest: 'test/maxwell/maxwellTest',

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
    'd3': 'd3',
    'jqueryui': 'jquery',
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
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
      location: 'bower_components/coffee-script/extras',
      main: 'coffee-script'
    }
  ]
});
//
//
//require([
//  // Load our app module and pass it to our definition function
//  'cs!Maxwell'
//], function (Maxwell) {
//  var circuitName = $('canvas').data('circuit');
//  var circuitFileName = "../circuits/" + circuitName + ".json";
//
//  $(document).ready(function (event) {
//    var canvas = $('canvas.maxwell');
//
//    if (canvas && circuitName) {
//      new Maxwell(canvas.get(0), {circuitName: circuitFileName});
//
//      var defaultCircuit = Maxwell.createCircuit("default", circuitFileName);
//    } else {
//      console.error("No circuit definition provided");
//    }
//  });
//
//  if (window.location.toString().match("/test")) {
//    runTests();
//  }
//});
//
////
//function runTests() {
//  "use strict";
//
//  mocha.setup('bdd');
//
//  require([
//    'chai',
//    'cs!MaxwellTest',
//    'cs!CircuitTest',
//    'cs!ResistorTest',
//    'cs!VoltageElmTest',
//    'cs!GroundTest',
//    'cs!WireTest',
//    'cs!CapacitorTest',
//    'cs!ComponentTest',
//    'cs!ComponentNodeLinkTest',
//    'cs!ComponentNodeTest',
//
//    'cs!CircuitSolverTest',
//    'cs!MatrixSolverTest',
//    'cs!CircuitStamperTest',
//
//    'cs!ArraysTest',
//    'cs!FormatsTest',
//    'cs!MathTest',
//    'cs!UnitsTest',
//    'cs!UnitsTest',
//
//    'cs!PrimitivesTest',
//    'cs!AjaxTest',
//    'cs!CircuitLoaderTest',
//    'cs!voltdivideIntegration'
//  ], function (chai) {
//    "use strict";
//    chai.should();
//    chai.expect();
//
//    mocha.run();
//  });
//}
//
//
//require([
//  'cs!Oscilloscope'
//], function (Oscilloscope) {
//  "use strict";
//
//  //var scope = new Oscilloscope();
//});

//
//
//require([
//  'Rickshaw',
//  'jquery',
//  'd3',
//  'jqueryui'
//], function (Rickshaw) {
//
//  var RenderControls = function(args) {
//
//    var $ = jQuery;
//
//    this.initialize = function() {
//
//      this.element = args.element;
//      this.graph = args.graph;
//      this.settings = this.serialize();
//
//      this.inputs = {
//        renderer: this.element.elements.renderer,
//        interpolation: this.element.elements.interpolation,
//        offset: this.element.elements.offset
//      };
//
//      this.element.addEventListener('change', function(e) {
//
//        this.settings = this.serialize();
//
//        if (e.target.name == 'renderer') {
//          this.setDefaultOffset(e.target.value);
//        }
//
//        this.syncOptions();
//        this.settings = this.serialize();
//
//        var config = {
//          renderer: this.settings.renderer,
//          interpolation: this.settings.interpolation
//        };
//
//        if (this.settings.offset == 'value') {
//          config.unstack = true;
//          config.offset = 'zero';
//        } else if (this.settings.offset == 'expand') {
//          config.unstack = false;
//          config.offset = this.settings.offset;
//        } else {
//          config.unstack = false;
//          config.offset = this.settings.offset;
//        }
//
//        this.graph.configure(config);
//        this.graph.render();
//
//      }.bind(this), false);
//    };
//
//    this.serialize = function() {
//
//      var values = {};
//      var pairs = $(this.element).serializeArray();
//
//      pairs.forEach( function(pair) {
//        values[pair.name] = pair.value;
//      } );
//
//      return values;
//    };
//
//    this.syncOptions = function() {
//
//      var options = this.rendererOptions[this.settings.renderer];
//
//      Array.prototype.forEach.call(this.inputs.interpolation, function(input) {
//
//        if (options.interpolation) {
//          input.disabled = false;
//          input.parentNode.classList.remove('disabled');
//        } else {
//          input.disabled = true;
//          input.parentNode.classList.add('disabled');
//        }
//      });
//
//      Array.prototype.forEach.call(this.inputs.offset, function(input) {
//
//        if (options.offset.filter( function(o) { return o == input.value } ).length) {
//          input.disabled = false;
//          input.parentNode.classList.remove('disabled');
//
//        } else {
//          input.disabled = true;
//          input.parentNode.classList.add('disabled');
//        }
//
//      }.bind(this));
//
//    };
//
//    this.setDefaultOffset = function(renderer) {
//
//      var options = this.rendererOptions[renderer];
//
//      if (options.defaults && options.defaults.offset) {
//
//        Array.prototype.forEach.call(this.inputs.offset, function(input) {
//          if (input.value == options.defaults.offset) {
//            input.checked = true;
//          } else {
//            input.checked = false;
//          }
//
//        }.bind(this));
//      }
//    };
//
//    this.rendererOptions = {
//
//      area: {
//        interpolation: true,
//        offset: ['zero', 'wiggle', 'expand', 'value'],
//        defaults: { offset: 'zero' }
//      },
//      line: {
//        interpolation: true,
//        offset: ['expand', 'value'],
//        defaults: { offset: 'value' }
//      },
//      bar: {
//        interpolation: false,
//        offset: ['zero', 'wiggle', 'expand', 'value'],
//        defaults: { offset: 'zero' }
//      },
//      scatterplot: {
//        interpolation: false,
//        offset: ['value'],
//        defaults: { offset: 'value' }
//      }
//    };
//
//    this.initialize();
//  };
//
//  var OScope = function (timeInterval) {
//    this.addData = function (data, value) {
//      var amplitude = Math.cos(timeBase / 50);
//      var index = data[0].length;
//
//      data.forEach(function (series) {
//        series.push({x: (index * timeInterval) + timeBase, y: value + amplitude});
//      });
//    };
//
//    this.removeData = function (data) {
//      data.forEach(function (series) {
//        series.shift();
//      });
//      timeBase += timeInterval;
//    };
//
//    this.seriesData = [[], [], [], [], [], [], [], [], []];
//    this.timeInterval = timeInterval || 1;
//
//    var timeBase = Math.floor(new Date().getTime() / 1000);
//
//    for (var i = 0; i < 150; i++) {
//      this.addData(this.seriesData, 1);
//    }
//
//    var palette = new Rickshaw.Color.Palette({scheme: 'classic9'});
//    graph.render();
//
//    var hoverDetail = new Rickshaw.Graph.HoverDetail({
//      graph: graph,
//      xFormatter: function (x) {
//        return new Date(x * 1000).toString();
//      }
//    });
//
//    var legend = new Rickshaw.Graph.Legend({
//      graph: graph,
//      element: document.getElementById('legend')
//    });
//
//    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
//      graph: graph,
//      legend: legend
//    });
//
//    var order = new Rickshaw.Graph.Behavior.Series.Order({
//      graph: graph,
//      legend: legend
//    });
//
//    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
//      graph: graph,
//      legend: legend
//    });
//
//    var ticksTreatment = 'glow';
//
//    var xAxis = new Rickshaw.Graph.Axis.Time({
//      graph: graph,
//      ticksTreatment: ticksTreatment,
//      timeFixture: new Rickshaw.Fixtures.Time.Local()
//    });
//
//    xAxis.render();
//
//    var yAxis = new Rickshaw.Graph.Axis.Y({
//      graph: graph,
//      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
//      ticksTreatment: ticksTreatment
//    });
//
//    yAxis.render();
//
//    new RenderControls({
//      element: document.querySelector('form'),
//      graph: graph
//    });
//
//    _scope = this;
//    _seriesData = this.seriesData;
//    setInterval(function () {
//      _scope.removeData(_seriesData, 1);
//      _scope.addData(_seriesData, 1);
//      graph.update();
//
//    }, 50);
//
//    function addAnnotation(force) {
//      if (messages.length > 0 && (force || Math.random() >= 0.95)) {
//        annotator.add(scope.seriesData[2][seriesData[2].length - 1].x, messages.shift());
//        annotator.update();
//      }
//    }
//
//    addAnnotation(true);
//    setTimeout(function () {
//      setInterval(addAnnotation, 1000)
//    }, 1000);
//
//    var previewXAxis = new Rickshaw.Graph.Axis.Time({
//      //graph: preview.previews[0],
//      timeFixture: new Rickshaw.Fixtures.Time.Local(),
//      ticksTreatment: ticksTreatment
//    });
//
//    previewXAxis.render();
//  };
//
//  var scope = new OScope(10);
//});




