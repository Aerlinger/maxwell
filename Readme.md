# Maxwell

A low-level javascript circuit simulation engine designed to model, simulate, and render complex electronic circuitry.

**Demo Link:** [http://circuitlab.herokuapp.com/](http://circuitlab.herokuapp.com/)


## Running the App

- `npm install`
- `node demo/app.js`

The application will run on localhost port 6502 by default.

## Features
  - Solvers for linear, nonlinear, analog, digital, and mixed-signal circuitry
  - Preset definitions and examples
  - Wide catalog of elements
  - Performance tuned

## API

##### Entry Point


```javascript
var circuitContext = Maxwell.createCircuit("Voltage Divider", "./voltdivide.json", function(circuit) {
  // Runs once circuit has finished loading
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

##### Setting up the circuit:
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

##### Querying computed values within the circuit:
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


## Rendering and Plotting:
  Maxwell can also render to one or more `<canvas>` elements via the `Renderer` object.

##### Setting up the canvas:

  **HTML:**
  ```html
    <canvas id="circuitboard"></canvas>
  ```

##### Debug options

- Show element bounding boxes
- Show element terminals

##### Configuration and initialization:
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

### Plotting and adding Oscilloscopes:

  **(Work in progress)**
  
### TODO

- Unique IDs for CircuitComponent
- Consistent fields for CircuitComponent

## License

Copyright (c) 2011-2017 Anthony Erlinger

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

