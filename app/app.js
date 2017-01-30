var express = require('express');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

var app = express();

library = {

  "Basics": {
    "ohms": "Ohm's Law",
    "resistors": "Resistors",
    "cap": "Capacitor",
    "induct": "Inductor",
    "lrc": "LRC Circuit",
    "voltdivide": "Voltage Divider",
    "pot": "Potentiometer",
    "potdivide": "Potentiometer Divider",
    "thevenin": "Thevenin's Theorem",
    "norton": "Norton's Theorem"
  },

  "A/C Circuits": {
    "capac": "Capacitor",
    "inductac": "Inductor",
    "capmultcaps": "Caps of Various Capacitances",
    "capmultfreq": "Caps w/ Various Frequencies",
    "indmultind": "Inductors of Various Inductances",
    "indmultfreq": "Inductors w/ Various Frequencies",
    "impedance": "Impedances of Same Magnitude",
    "res-series": "Series Resonance",
    "res-par": "Parallel Resonance"
  },

  "Passive Filters": {
    "filt-hipass": "High-Pass Filter (RC)",
    "filt-lopass": "Low-Pass Filter (RC)",
    "filt-hipass-l": "High-Pass Filter (RL)",
    "filt-lopass-l": "Low-Pass Filter (RL)",
    "bandpass": "Band-pass Filter",
    "notch": "Notch Filter",
    "twint": "Twin-T Filter",
    "crossover": "Crossover",
    "butter10lo": "Butterworth Low-Pass (10 pole)",
    "besselbutter": "Bessel vs Butterworth",
    "ringing": "Band-pass with Ringing"
  },

  "Other Passive Circuits": {
    "Series/Parallel": {
      "indseries": "Inductors in Series",
      "indpar": "Inductors in Parallel",
      "capseries": "Caps in Series",
      "cappar": "Caps in Parallel"
    },

    "Transformers": {
      "transformer": "Transformer",
      "transformerdc": "Transformer w/ DC",
      "transformerup": "Step-Up Transformer",
      "transformerdown": "Step-Down Transformer",
      "longdist": "Long-Distance Power Transmission"
    },

    "Relays": {
      "relay": "Relay",
      "relayand": "Relay AND",
      "relayor": "Relay OR",
      "relayxor": "Relay XOR",
      "relaymux": "Relay Mux",
      "relayff": "Relay Flip-Flop",
      "relaytff": "Relay Toggle Flip-Flop",
      "relayctr": "Relay Counter"
    },

    "3way": "3-Way Light Switches",
    "4way": "3- and 4-Way Light Switches",
    "diff": "Differentiator",
    "wheatstone": "Wheatstone Bridge",
    "lrc-critical": "Critically Damped LRC",
    "currentsrcelm": "Current Source",
    "inductkick": "Inductive Kickback",
    "inductkick-snub": "Blocking Inductive Kickback",
    "powerfactor1": "Power Factor",
    "powerfactor2": "Power Factor Correction",
    "grid": "Resistor Grid",
    "grid2": "Resistor Grid 2",
    "cube": "Resistor Cube",


    "Coupled LC's": {
      "coupled1": "LC Modes (2)",
      "coupled2": "Weak Coupling",
      "coupled3": "LC Modes (3)",
      "ladder": "LC Ladder"
    },

    "phaseseq": "Phase-Sequence Network",
    "lissa": "Lissajous Figures",

    "Diodes": {
      "diodevar": "Diode",
      "diodecurve": "Diode I/V Curve",
      "rectify": "Half-Wave Rectifier",
      "fullrect": "Full-Wave Rectifier",
      "fullrectf": "Full-Wave Rectifier w/ Filter",
      "diodelimit": "Diode Limiter"
    },

    "Zener Diodes": {
      "zeneriv": "I/V Curve",
      "zenerref": "Voltage Reference",
      "zenerreffollow": "Voltage Reference w/ Follower"
    },

    "dcrestoration": "DC Restoration",
    "inductkick-block": "Blocking Inductive Kickback",
    "spikegen": "Spike Generator",

    "Voltage Multipliers": {
      "voltdouble": "Voltage Doubler",
      "voltdouble2": "Voltage Doubler 2",
      "volttriple": "Voltage Tripler",
      "voltquad": "Voltage Quadrupler"
    },

    "amdetect": "AM Detector",
    "diodeclip": "Waveform Clipper",
    "sinediode": "Triangle-to-Sine Converter",
    "ringmod": "Ring Modulator"
  },

  "Op-Amps": {
    "opamp": "Op-Amp",
    "opampfeedback": "Op-Amp Feedback",


    "Amplifiers": {
      "amp-invert": "Inverting Amplifier",
      "amp-noninvert": "Noninverting Amplifier",
      "amp-follower": "Follower",
      "amp-diff": "Differential Amplifier",
      "amp-sum": "Summing Amplifier",
      "logconvert": "Log Amplifier",
      "classd": "Class-D Amplifier"
    },

    "Oscillators": {
      "relaxosc": "Relaxation Oscillator",
      "phaseshiftosc": "Phase-Shift Oscillator",
      "triangle": "Triangle Wave Generator",
      "sine": "Sine Wave Generator",
      "sawtooth": "Sawtooth Wave Generator",
      "vco": "Voltage-Controlled Oscillator",
      "rossler": "Rossler Circuit"
    },

    "amp-rect": "Half-Wave Rectifier (inverting)",
    "amp-fullrect": "Full-Wave Rectifier",
    "peak-detect": "Peak Detector",
    "amp-integ": "Integrator",
    "amp-dfdx": "Differentiator",
    "amp-schmitt": "Schmitt Trigger",
    "nic-r": "Negative Impedance Converter",
    "gyrator": "Gyrator",
    "capmult": "Capacitance Multiplier",
    "howland": "Howland Current Source",
    "itov": "I-to-V Converter",
    "opamp-regulator": "Voltage Regulator",
    "opint": "741 Internals",
    "opint-invert-amp": "741 (inverting amplifier)",
    "opint-slew": "741 Slew Rate",
    "opint-current": "741 Current Limits"
  },

  "Transistors": {
    "npn": "NPN Transistor",
    "pnp": "PNP Transistor",
    "transswitch": "Switch",
    "follower": "Emitter Follower",


    "Multivibrators": {
      "multivib-a": "Astable Multivib",
      "multivib-bi": "Bistable Multivib (Flip-Flop)",
      "multivib-mono": "Monostable Multivib (One-Shot)"
    },

    "ceamp": "Common-Emitter Amplifier",
    "phasesplit": "Unity-Gain Phase Splitter",
    "schmitt": "Schmitt Trigger",
    "currentsrc": "Current Source",
    "currentsrcramp": "Current Source Ramp",
    "mirror": "Current Mirror",
    "darlington": "Darlington Pair",

    "Differential Amplifiers": {
      "trans-diffamp": "Differential Input",
      "trans-diffamp-common": "Common-Mode Input",
      "trans-diffamp-cursrc": "Common-Mode w/Current Source"
    },

    "Push-Pull Follower": {
      "pushpullxover": "Simple, with distortion",
      "pushpull": "Improved"
    },

    "Oscillators": {
      "colpitts": "Colpitts Oscillator",
      "hartley": "Hartley Oscillator",
      "eclosc": "Emitter-Coupled LC Oscillator"
    }
  },


  "MOSFETs": {
    "nmosfet": "n-MOSFET",
    "pmosfet": "p-MOSFET",
    "mosswitch": "Switch",
    "mosfollower": "Source Follower",
    "moscurrentsrc": "Current Source",
    "moscurrentramp": "Current Ramp",
    "mosmirror": "Current Mirror",
    "mosfetamp": "Common-Source Amplifier",
    "cmosinverter": "CMOS Inverter",
    "cmosinvertercap": "CMOS Inverter (w/capacitance)",
    "cmosinverterslow": "CMOS Inverter (slow transition)",
    "cmostransgate": "CMOS Transmission Gate",
    "mux": "CMOS Multiplexer",
    "samplenhold": "Sample-and-Hold",
    "delayrc": "Delayed Buffer",
    "leadingedge": "Leading-Edge Detector",
    "switchfilter": "Switchable Filter",
    "voltinvert": "Voltage Inverter",
    "invertamp": "Inverter Amplifier",
    "inv-osc": "Inverter Oscillator"
  },

  "555 Timer Chip": {
    "555square": "Square Wave Generator",
    "555int": "Internals",
    "555saw": "Sawtooth Oscillator",
    "555lowduty": "Low-duty-cycle Oscillator",
    "555monostable": "Monostable Multivibrator",
    "555pulsemod": "Pulse Width Modulator",
    "555sequencer": "Pulse Sequencer",
    "555schmitt": "Schmitt Trigger (inverting)",
    "555missing": "Missing Pulse Detector"
  },

  "Active Filters": {
    "filt-vcvs-lopass": "VCVS Low-Pass Filter",
    "filt-vcvs-hipass": "VCVS High-Pass Filter",
    "switchedcap": "Switched-Capacitor Filter",
    "allpass1": "Allpass",
    "allpass2": "Allpass w/ Square"
  },

  "Logic Families": {
    "RTL": {
      "rtlinverter": "RTL Inverter",
      "rtlnor": "RTL NOR",
      "rtlnand": "RTL NAND"
    },

    "DTL": {
      "dtlinverter": "DTL Inverter",
      "dtlnand": "DTL NAND",
      "dtlnor": "DTL NOR"
    },

    "TTL": {
      "ttlinverter": "TTL Inverter",
      "ttlnand": "TTL NAND",
      "ttlnor": "TTL NOR"
    },

    "NMOS": {
      "nmosinverter": "NMOS Inverter",
      "nmosinverter2": "NMOS Inverter 2",
      "nmosnand": "NMOS NAND"
    },

    "CMOS": {
      "cmosinverter": "CMOS Inverter",
      "cmosnand": "CMOS NAND",
      "cmosnor": "CMOS NOR",
      "cmosxor": "CMOS XOR",
      "cmosff": "CMOS Flip-Flop",
      "cmosmsff": "CMOS Master-Slave Flip-Flop"
    },

    "ECL": {
      "eclnor": "ECL NOR/OR"
    },

    "Ternary": {
      "3-cgand": "CGAND",
      "3-cgor": "CGOR",
      "3-invert": "Complement (F210)",
      "3-f211": "F211",
      "3-f220": "F220",
      "3-f221": "F221"
    }
  },

  "Combinational Logic": {
    "xor": "Exclusive OR",
    "halfadd": "Half Adder",
    "fulladd": "Full Adder",
    "decoder": "1-of-4 Decoder",
    "mux3state": "2-to-1 Mux",
    "majority": "Majority Logic",
    "digcompare": "2-Bit Comparator",
    "7segdecoder": "7-Segment LED Decoder"
  },

  "Sequential Logic": {
    "Flip-Flops": {
      "nandff": "SR Flip-Flop",
      "clockedsrff": "Clocked SR Flip-Flop",
      "masterslaveff": "Master-Slave Flip-Flop",
      "edgedff": "Edge-Triggered D Flip-Flop",
      "jkff": "JK Flip-Flop"
    },

    "Counters": {
      "counter": "4-Bit Ripple Counter",
      "counter8": "8-Bit Ripple Counter",
      "synccounter": "Synchronous Counter",
      "deccounter": "Decimal Counter",
      "graycode": "Gray Code Counter",
      "johnsonctr": "Johnson Counter"
    },

    "divideby2": "Divide-by-2",
    "divideby3": "Divide-by-3",
    "ledflasher": "LED Flasher",
    "traffic": "Traffic Light",
    "dram": "Dynamic RAM"
  },

  "Analog/Digital": {
    "flashadc": "Flash ADC",
    "deltasigma": "Delta-Sigma ADC",
    "hfadc": "Half-Flash (Subranging) ADC",
    "dac": "Binary-Weighted DAC",
    "r2rladder": "R-2R Ladder DAC",
    "swtreedac": "Switch-Tree DAC",
    "digsine": "Digital Sine Wave"
  },

  "Phase-Locked Loops": {
    "xorphasedet": "XOR Phase Detector",
    "pll": "Type I PLL",
    "phasecomp": "Phase Comparator (Type II)",
    "phasecompint": "Phase Comparator Internals",
    "pll2": "Type II PLL",
    "pll2a": "Type II PLL (fast)",
    "freqdouble": "Frequency Doubler"
  },

  "Transmission Lines": {
    "tl": "Simple TL",
    "tlstand": "Standing Wave",
    "tlterm": "Termination",
    "tlmismatch": "Mismatched lines (Pulse)",
    "tlmis1": "Mismatched lines (Standing Wave)",
    "tlmatch1": "Impedance Matching (L-Section)",
    "tlmatch2": "Impedance Matching (Shunt Stub)",
    "tlfreq": "Stub Frequency Response",
    "tllopass": "Low-Pass Filter",
    "tllight": "Light Switch"
  },

  "Misc. Devices": {
    "JFETs": {
      "jfetcurrentsrc": "JFET Current Source",
      "jfetfollower": "JFET Follower",
      "jfetfollower-nooff": "JFET Follower w/zero offset",
      "jfetamp": "Common-Source Amplifier",
      "volume": "Volume Control"
    },

    "Tunnel Diodes": {
      "tdiode": "I/V Curve",
      "tdosc": "LC Oscillator",
      "tdrelax": "Relaxation Oscillator"
    },

    "Memristors": {
      "mr": "Memristor",
      "mr-sine": "Sine Wave",
      "mr-square": "Square Wave",
      "mr-triangle": "Triangle Wave",
      "mr-sine2": "Hard-Switching 1",
      "mr-sine3": "Hard-Switching 2",
      "mr-crossbar": "Crossbar Memory"
    },

    "Triodes": {
      "triode": "Triode",
      "triodeamp": "Amplifier"
    },

    "Silicon-Controlled Rectifiers": {
      "scr": "SCR",
      "scractrig": "AC Trigger"
    },

    "Current Conveyor": {
      "cc2": "CCII+",
      "cc2n": "CCII-",
      "ccinductor": "Inductor Simulator",
      "cc2imp": "CCII+ Implementation",
      "cc2impn": "CCII- Implementation",
      "cciamp": "Current Amplifier",
      "ccvccs": "VCCS",
      "ccdiff": "Current Differentiator",
      "ccint": "Current Integrator",
      "ccitov": "Current-Controlled Voltage Source"
    },

    "Spark Gap": {
      "spark-sawtooth": "Sawtooth Generator",
      "tesla": "Tesla Coil",
      "spark-marx": "Marx Generator"
    }
  }
};


// var Maxwell = require("../src/Maxwell");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/img'));
app.use("/vendor", express.static(path.join(__dirname, './vendor')));
app.use("/foundation", express.static(path.join(__dirname, './vendor/foundation')));
app.use("/bower_components", express.static(path.join(__dirname, '../bower_components')));
app.use("/dist", express.static(path.join(__dirname, '../dist')));
app.use("/scripts", express.static(path.join(__dirname, './scripts')));
app.use("/circuits", express.static(path.join(__dirname, '../circuits')));

examples = {
  'Simple resistance': 'resistors',
  'Bessel & Butterworth filter': 'besselbutter',
  'Mosfet Amplifier': 'mosfetamp',
  'LC Ladder': 'ladder',
  'Digital Comparator': 'digcompare',
  'DRAM': 'dram',
  'Half Adder': 'halfadd',
  'Traffic light': 'traffic',
  'Flash ADC': 'flashadc',
  'DAC': 'dac',
  'Decade Counter': 'deccounter',
  'switched-cap': 'switched-cap',
  'Binary to Decimal Decoder': 'decoder',
  'Digital Sine': 'digsine'
};

var port = 6502;

var circuit_names = glob.sync(__dirname + "/../circuits/v4/*.json").map(function(filename) {
  return path.basename(filename, ".json")
});

app.get('/', function (req, res) {
  res.redirect('/ui')
});

app.get('/plot', function (req, res) {
  res.render('plot', {});
});

app.get('/ui', function (req, res) {
  res.redirect('/ui/opint')
});

app.get('/ui/:circuit_name', function (req, res) {
  res.render('ui', {
    examples: examples,
    circuit_name: req.params.circuit_name,
    circuit_names: circuit_names,
    library: library
  });
});

app.get('/theme', function (req, res) {
  res.render('theme-test.html');
});

app.get('/circuits/:circuit_name', function (req, res) {
  // console.log(__dirname + "../circuits/v3/*.json")
  console.log(circuit_names);

  res.render('index', {
    circuit: req.params.circuit_name,
    circuit_names: circuit_names
  });
});

app.listen(process.env.PORT || port, function () {
  console.log('Example app listening on port ' + port + '!');
});
