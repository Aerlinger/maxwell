# Maxwell

A low-level javascript circuit simulation engine designed to model, simulate, and render complex electronic circuitry.

## Features
  - Solvers for linear, nonlinear, analog, digital, and mixed-signal circuitry
  - Preset definitions and examples
  - Wide catalog of elements
  - SPICE compatibility
  - Performance tuned

## Installation:

  Bower:
    `bower install maxwell`

  Using precompiled file:
    See the `/build` directory

  Compile using Grunt:
    Clone the repo, navigate to the root directory and run:
    `bower install && grunt dist`

## API

```javascript
var circuitContext = Maxwell.createCircuit("Voltage Divider", "./voltdivide.json", function(circuit) {

});

```

## Introduction

### JSON circuit definition specification:
  A comprehensive list of examples can be found in the circuits folder.

### Component Hierarchy
  Maxwell can keep track of and simulate many circuits at a time:
    Each Circuit has many components (These are anything that would go on a PCB/breadboard: Resistors, Transistors, etc...)
      Each component has many node connections which have both a current and voltage relative to ground.
    Each Circuit has many nodes which are the junctions between components. A node has a single ground referenced voltage and is linked to one or more components.

### A simple example:

Consider a simple resistor-capacitor (RC) circuit with a resistance of 50 Ohms and a capacitance of 20 milliFarads.

#####Setting up the circuit:
  ```javascript

  resistiveCircuit = Maxwell.createCircuit('Simple RC circuit');

  // Set the timestep to 1 millisecond (1 microsecond is the default):
  resistiveCircuit.configure({ timeStep: '1e6', cacheOnStep: true })

  // Add a 50 Ohm resistor resistor:
  resistiveCircuit.addComponent('resistor', [0, 1], { id: "simple_resistor", resistance: 50 });

  // Add a 2 millifarad capacitor with an initial voltage of 1.0 volt
  resistiveCircuit.addComponent('capacitor',[1, 2], { "simple_capacitor", resistance: 2e-3, v0: 1.0 });

  // Define the ground. Maxwell can infer this automatically, but it's good practice to set an explicit ground
  resistiveCircuit.addComponent('ground', []);

  resistiveCircuit.reset();       // Implicitly gets called on create. Sets time to 0 seconds
  resistiveCircuit.time           // 0 seconds have elapsed

  // A simple human readable printout of the state and parameters of the circuit:
  resistiveCircuit.describe();

  // Step the simulation forward using the previously configured time step:
  resistiveCircuit.step();
  resistiveCircuit.describe();

  // For linear circuits we can declare an explicit time step as well:
  resistiveCircuit.step(3e-6);
  resistiveCircuit.describe();

  // We can also step until a specified time (100ms in this example):
  resistiveCircuit.stepUntil(1e4);
  resistiveCircuit.describe();

  Maxwell.getCircuits(); // [resistiveCircuit(...)]

  ```


#####Querying computed values within the circuit:
  ```javascript

  components  = resistiveCircuit.getComponents();
  nodes       = resistiveCircuit.getNodes();
  links       = resistiveCircuit.getNodeLinks();

  primaryNode = resistiveCircuit.findNodeById("1");

  // primaryNode.connectedComponents();

  resistor = resistiveCircuit.findComponentById("simple_resistor");

  resistor.getNodes();

  resistor.siblings();

  resistor.getVoltages(); // { "node1_id": 1.0, "node2_id": 2.0 }

  resistor.getCurrents(); // { "node1_id": 0.1, "node2_id": 0.5 }
  ```

  ```javascript

  // Other helpers
  resistiveCircuit.isPlanar(); // true
  resistiveCircuit.isLinear(); // true
  resistiveCircuit.isReactive(); // true (since a reactive element (capacitor) is present

  resistiveCircuit.isPureAnalog();  // true
  resistiveCircuit.isDigital();     // false
  resistiveCircuit.isMixedSignal(); // false

  // Analysis:
  conductance_matrix = resistiveCircuit.getConductanceMatrix();
  driving_matrix = resistiveCircuit.getDrivingMatrix();
  ```


##Rendering and Plotting:
  Maxwell can also render to one or more `<canvas>` elements via the `Renderer` object.

  #####Setting up the canvas:

  **HTML:**
  ```html
    <canvas id="circuitboard"></canvas>
  ```

  #####Configuration and initialization:
  **Javascript:**
  ```javascript
    var schmittTrigger = Maxwell.createCircuit('Schmitt trigger example', "schmitt_trigger.json");

    circuitboardCanvas = document.findById('circuitboard');
    var options = {
      toolbar: true,
      mouseEditor: true,
      mouseInfo: true,
      keyboardListener: true,
      infoOnHover: true,
      controlBar: true,
      theme: "default",
      fpsLimit: 30,
      retina: false,
      autoupdate: true,  // Automatically updates the drawing after the rendering completes for each frame
      autopause: true,  // Stop animation on focus

      interval: 1,    // Redraw once for every interval iterations of update (default: 1)
    };

    circuitRenderer = Maxwell.Renderer(circuitboardCanvas, schmittTrigger, options);

    // Show circuit initially:
    circuitRenderer.redraw(schmittTrigger);
  ```

  It's also possible to update the view externally:

  ```javascript
  // Trigger a render each frame:
  schmittTrigger.onstep(function() {
    circuitRenderer.redraw(schmittTrigger);
  });
  ```

  The Maxwell Rendering API is an extension of Soulwire's Sketch.js framework. You can find find a list of additional
  methods used to customize the display there.

  ###Plotting and adding Oscilloscopes:

  Use the addScope method to create a virtual oscilloscope to render values:

  `circuitRenderer.addScope(node1, node2, ["voltage"], [opts])`

  ```javascript

    options = {
      interval: 10,
      position: 'bottom'
    }

    circuitRenderer.addScope(node1, node2, ["voltage"], [opts])

  ```

  **Positioning:**
  Scope position can by passing one of the following values to the `position` options attribute:
  * `top`
  * `right`
  * `bottom`
  * `left`

  Top/bottom aligned scopes use 25% height and full width and height of the canvas. Similarly, left/right scopes
  use 33% canvas width and expand to full height. If more than one scope is aligned to the same position attributes
  they will automatically arrange and stack to use space most effectively.*

  Scopes can also be placed on the corners using the following attributes.
  - `topleft`
  - `topright`
  - `bottomright`
  - `bottomleft`


  If desired, more granular positioning can also be achieved with the following attributes:
  - `width`
  - `height`
  - `x` (relative to top-left corner of circuit canvas)
  - `y` (relative to top-left corner of circuit canvas)

  Either pixels or percentages can be used

  Width and height attributes can be used with the positional attributes. For instance, if we wanted a scope taking up
  half the canvas we could combine the attrubutes

  ```javascript
    options = {
      ...
      position: 'bottom',
      height: '50%'
      ...
    }
  ```

## Acknowledgements

## License
