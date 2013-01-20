// Top-level script:

// Define shortcut aliases
require.config({
    paths:{

        // LIBRARIES:
        jquery:'libs/jquery-1.8.3.min',
        'coffee-script':'libs/coffee-script',
        cs:'libs/cs',
        color:'libs/color',
        mocha:'libs/mocha',
        chai:'libs/chai',

        // CORE:
        Circuit:'src/core/circuit',
        CircuitEngineParams:'src/core/circuitParams',
        Hint:'src/core/hint',
        CircuitSolver:'src/core/engine/circuitSolver',
        MatrixStamper:'src/core/engine/matrixStamper',
        RowInfo:'src/core/engine/rowInfo',
        CircuitNode:'src/core/nodeGraph/circuitNode',
        CircuitNodeLink:'src/core/nodeGraph/circuitNodeLink',
        Pathfinder:'src/core/nodeGraph/pathfinder',

        // SETTINGS:
        Settings:'src/settings/settings',

        // IO:
        Logger:'src/io/logger',
        CircuitLoader:'src/io/circuitLoader',
        ConfigurationLoader:'src/io/configurationLoader',

        // GEOM:
        Point:'src/geom/point',
        Polygon:'src/geom/polygon',
        Rectangle:'src/geom/rectangle',

        // RENDERING:
        Renderer:'src/render/renderer',
        CanvasContext:'src/render/canvasContext',
        DrawHelper:'src/render/drawHelper',
        Context:'src/render/context',

        // USER INTERFACE:
        State:'src/ui/circuitStates',
        CommandHistory:'src/ui/commandHistory',
        Grid:'src/ui/grid',
        Oscilloscope:'src/core/circuitParams',
        ColorScale:'src/util/colorScale',
        KeyboardState:'src/ui/keyboardState',
        MouseState:'src/ui/mouseState',
        ColorMapState:'src/ui/colorMapState',
        ColorPalette:'src/ui/colorPalette',

        // COMPONENT:
        CircuitComponent:'src/component/circuitComponent',
        ComponentRegistry:'src/component/componentRegistry',

        // COMPONENTS:
        AntennaElm:'src/component/components/AntennaElm',
        CapacitorElm:'src/component/components/CapacitorElm',
        CurrentElm:'src/component/components/CurrentElm',
        DiodeElm:'src/component/components/DiodeElm',
        GroundElm:'src/component/components/GroundElm',
        InductorElm:'src/component/components/InductorElm',
        JFetElm:'src/component/components/JFetElm',
        LogicInputElm:'src/component/components/LogicInputElm',
        LogicOutputElm:'src/component/components/LogicOutputElm',
        MosfetElm:'src/component/components/MosfetElm',
        OpAmpElm:'src/component/components/OpAmpElm',
        OutputElm:'src/component/components/OutputElm',
        ProbeElm:'src/component/components/ProbeElm',
        RailElm:'src/component/components/RailElm',
        ResistorElm:'src/component/components/ResistorElm',
        SparkGapElm:'src/component/components/SparkGapElm',
        SweepElm:'src/component/components/SweepElm',
        Switch2Elm:'src/component/components/Switch2Elm',
        SwitchElm:'src/component/components/SwitchElm',
        TextElm:'src/component/components/TextElm',
        TransistorElm:'src/component/components/TransistorElm',
        VarRailElm:'src/component/components/VarRailElm',
        VoltageElm:'src/component/components/VoltageElm',
        WireElm:'src/component/components/WireElm',

        // Utils
        MathUtils:'src/util/mathUtils',
        ArrayUtils:'src/util/arrayUtils',
        FormatUtils:'src/util/formatUtils',
        ConsoleUtils:'src/util/consoleUtils',
        Units:'src/util/units',


        ////////////////////////////////////////////////////////
        // TESTS:
        ////////////////////////////////////////////////////////

        TestHelper: 'test/_helper',
        CircuitTest: 'test/circuit/circuitTest',
        ResistorTest: 'test/component/components/resistorTest',
        VoltageTest: 'test/component/components/voltageTest',
        GroundTest: 'test/component/components/groundTest',
        WireTest: 'test/component/components/wireTest',
        CapacitorTest: 'test/component/components/capacitorTest',
        ComponentTest: 'test/component/circuitComponentTest',

        CircuitSolverTest: 'test/solver/circuitSolverTest',
        MatrixSolverTest: 'test/solver/matrixSolverTest',
        CircuitStamperTest: 'test/solver/matrixStamperTest',

        ArraysTest: 'test/util/arraysTest',
        FormatsTest: 'test/util/formatsTest',
        MathTest: 'test/util/mathTest',
        UnitsTest: 'test/util/unitsTest',

        PrimitivesTest: 'test/util/primitivesTest'
    }

});

// Filename: main.js
console.log("Loading main.js");

require([
    // Load our app module and pass it to our definition function
    'jquery',

    'cs!Circuit',
    'cs!ResistorElm',
    'cs!WireElm',
    'cs!GroundElm',
    'cs!VoltageElm',

    'cs!ArrayUtils',
    'cs!ConsoleUtils'

], function ($, Circuit, Resistor, Wire, Ground, Voltage) {

    var canvas = $('canvas').get(0);
    var circuit = new Circuit(canvas);

    var voltageSource = new Voltage(112, 368, 112, 48, 0, [0, 40.0, 10.0, 0.0]);
    var wire1 = new Wire(112, 48, 240, 48, 0, []);
    var res1 = new Resistor(240, 48, 240, 368, 0, [10000]);
    var wire2 = new Wire(112, 368, 240, 368, 0, []);
    var wire3 = new Wire(240, 48, 432, 48, 0, []);
    var wire4 = new Wire(240, 368, 432, 368, 0, []);
    var re2 = new Resistor(432, 48, 432, 368, 0, [20000]);

    circuit.solder(voltageSource);
    circuit.solder(wire1);
    circuit.solder(wire2);
    circuit.solder(wire3);
    circuit.solder(wire4);
    circuit.solder(res1);
    circuit.solder(re2);

    circuit.restartAndRun();

    setInterval(function() {
        circuit.updateCircuit();
    }, 0);

    runTests();

    $('#run_tests').click(function(e) {
        "use strict";
        mocha.setup('bdd');
        mocha.run();
    });
});

function runTests() {
    "use strict";

    mocha.setup('bdd');

    require([
        'test/_helper',
        'cs!CircuitTest',
        'cs!ResistorTest',
        'cs!VoltageTest',
        'cs!GroundTest',
        'cs!WireTest',
        //'cs!CapacitorTest',
        'cs!ComponentTest',

        'cs!CircuitSolverTest',
        'cs!MatrixSolverTest',
        'cs!CircuitStamperTest',

        'cs!ArraysTest',
        'cs!FormatsTest',
        'cs!MathTest',
        'cs!UnitsTest',
        'cs!UnitsTest',

        'cs!PrimitivesTest'], function() {
        "use strict";
        mocha.run();
    });
}
