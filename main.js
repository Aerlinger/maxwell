// Define shortcut aliases
require.config({
    paths:{

        // LIBRARIES:
        jquery:'libs/jquery-1.8.3.min',
        'coffee-script':'libs/coffee-script',
        cs:'libs/cs',
        color:'libs/color',
        mocha:'libs/mocha',

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
        Point:'src/util/point',
        Polygon:'src/util/polygon',
        Rectangle:'src/util/rectangle',
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

        // Globals:
        MathUtils:'src/global/mathUtils',
        ArrayUtils:'src/global/arrayUtils',
        Units:'src/global/units',

        HelloCS:'examples/hellocs'
    }

});

// Filename: main.js
console.log("Loading main.js");

require([
    // Load our app module and pass it to our definition function
    'app',
    'cs!HelloCS',
    'cs!Circuit',
    'jquery',
    'cs!ResistorElm',
    'cs!WireElm',
    'cs!GroundElm',
    'cs!VoltageElm'
], function (App, HelloCS, Circuit, $, Resistor, Wire, Ground, Voltage) {

    App.initialize();

    var canvas = $('canvas').get(0);

    var circuit = new Circuit(canvas);

    var resistor       = new Resistor(300, 100, 300, 200, 0, [50]);
    var voltageSource  = new Voltage(100, 100, 100, 200, 0, [50]);
    var wire           = new Wire(100, 100, 300, 100, 0);
    var voltageGround  = new Ground(100, 200, 100, 250, 0);
    var resGround      = new Ground(300, 200, 300, 250, 0);

    circuit.solder(resistor);
    circuit.solder(voltageSource);
    circuit.solder(wire);
    circuit.solder(voltageGround);
    circuit.solder(resGround);

    circuit.restartAndRun();

    Hello = new HelloCS("Hello!");
    Hello.sayHi();
});