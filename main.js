// Filename: main.js
console.log("Loading main.js");

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
    paths: {
        // Libraries:
        jquery: 'libs/jquery-1.8.3.min',
        'coffee-script': 'libs/coffee-script',
        cs: 'libs/cs',

        CircuitComponent: 'src/component/circuitComponent',
        ComponentRegistry: 'src/component/ComponentRegistry',
        Circuit: 'src/core/circuit',

        Settings: 'src/settings/settings',
        CircuitEngineParams: 'src/core/circuitParams',

        CircuitSolver: 'src/core/engine/circuitSolver',
        CircuitLoader: 'src/io/circuitLoader',
        Logger: 'src/io/logger',
        State: 'src/ui/circuitStates',
        KeyboardState: 'src/core/circuitParams',
        ColorMapState: 'src/core/circuitParams',
        Renderer: 'src/core/circuitParams',
        CommandHistory: 'src/core/circuitParams',
        Hint: 'src/core/circuitParams',
        Grid: 'src/core/circuitParams',
        Primitives: 'src/core/circuitParams',
        Oscilloscope: 'src/core/circuitParams'

    }

});

require([
    // Load our app module and pass it to our definition function
    'app',
    'cs!examples/hellocs'
], function(App, HelloCS){
    // The "app" dependency is passed in as "App"
    App.initialize();

    Hello = new HelloCS("Hello!");

    Hello.sayHi();
});