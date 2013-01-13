// Filename: main.js
console.log("Loading main.js");

// Define shortcut aliases
require.config({
    paths: {

        // LIBRARIES:
        jquery: 'libs/jquery-1.8.3.min',
        'coffee-script': 'libs/coffee-script',
        cs: 'libs/cs',
        color: 'libs/color',

        // CORE:
        Circuit: 'cs!src/core/circuit',
        CircuitEngineParams: 'cs!src/core/circuitParams',
        Hint: 'cs!src/core/hint',
        CircuitSolver: 'cs!src/core/engine/circuitSolver',
        MatrixStamper: 'cs!src/core/engine/matrixStamper',
        RowInfo: 'cs!src/core/engine/rowInfo',
        CircuitNode: 'cs!src/core/nodeGraph/circuitNode',
        Pathfinder: 'cs!src/core/nodeGraph/pathfinder',

        // SETTINGS:
        Settings: 'cs!src/settings/settings',

        // IO:
        Logger: 'cs!src/io/logger',
        CircuitLoader: 'cs!src/io/circuitLoader',
        ConfigurationLoader: 'cs!src/io/configurationLoader',

        // RENDERING:
        Renderer: 'cs!src/render/renderer',

        // USER INTERFACE:
        State: 'cs!src/ui/circuitStates',
        CommandHistory: 'cs!src/ui/commandHistory',
        Grid: 'cs!src/ui/grid',
        Oscilloscope: 'cs!src/core/circuitParams',
        ColorScale: 'cs!src/util/colorScale',
        Primitives: 'cs!src/util/shapePrimitives',

        // COMPONENT:
        CircuitComponent: 'cs!src/component/circuitComponent',
        ComponentRegistry: 'cs!src/component/componentRegistry',

        // COMPONENTS:
        AntennaElm: 'cs!src/component/AntennaElm',
        CapacitorElm: 'cs!src/component/CapacitorElm',
        CurrentElm: 'cs!src/component/CurrentElm',
        DiodeElm: 'cs!src/component/DiodeElm',
        GroundElm: 'cs!src/component/GroundElm',
        InductorElm: 'cs!src/component/InductorElm',
        JFetElm: 'cs!src/component/JFetElm',
        LogicInputElm: 'cs!src/component/LogicInputElm',
        LogicOutputElm: 'cs!src/component/LogicOutputElm',
        MosfetElm: 'cs!src/component/MosfetElm',
        OpAmpElm: 'cs!src/component/OpAmpElm',
        OutputElm: 'cs!src/component/OutputElm',
        ProbeElm: 'cs!src/component/ProbeElm',
        RailElm: 'cs!src/component/RailElm',
        ResistorElm: 'cs!src/component/ResistorElm',
        SparkGapElm: 'cs!src/component/SparkGapElm',
        SweepElm: 'cs!src/component/SweepElm',
        Switch2Elm: 'cs!src/component/Switch2Elm',
        SwitchElm: 'cs!src/component/SwitchElm',
        TextElm: 'cs!src/component/TextElm',
        TransistorElm: 'cs!src/component/TransistorElm',
        VarRailElm: 'cs!src/component/VarRailElm',
        VoltageElm: 'cs!src/component/VoltageElm',
        WireElm: 'cs!src/component/WireElm'
    }

});

require([
    // Load our app module and pass it to our definition function
    'app',
    'cs!examples/hellocs'
], function(App, HelloCS){
    App.initialize();

    Hello = new HelloCS("Hello!");
    Hello.sayHi();
});