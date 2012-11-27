require('coffee-script');
var _ = require('underscore')._;

// Global definitions:
require('./src/global/arrays');
require('./src/global/colorPalette');
require('./src/global/console');
require('./src/global/formats');
require('./src/global/math');
require('./src/global/units');

console.log("Running Maxwell in environment: " + process.argv[2])
process.env[process.argv[2]] = true


Circuit = require('./src/core/circuit');
CircuitElement = require('./src/component/circuitElement');
Settings = require('./src/settings/Settings');

c = new Circuit();
c.updateCircuit();
CircuitElement = require('./src/component/circuitElement');
ce = new CircuitElement();
