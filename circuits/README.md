### All circuits available to Maxwell at startup are to be contained in this folder

List of Circuit Defaults:
{
  "blank.json": "Blank Circuit",

  "Basics" : {
    "ohms.json": "Ohm's Law",
    "default.json": "Default",
    "resistors.json": "Resistors",
    "cap.json": "Capacitor",
    "induct.json": "Inductor",
    "lrc.json": "LRC Circuit",
    "voltdivide.json": "Voltage Divider",
    "pot.json": "Potentiometer",
    "potdivide.json": "Potentiometer Divider",
    "thevenin.json": "Thevenin's Theorem",
    ">norton.json": "Norton's Theorem"
  },

  "A/C Circuits" : {
    "capac.json": "Capacitor",
    "inductac.json": "Inductor",
    "capmultcaps.json": "Caps of Various Capacitances",
    "capmultfreq.json": "Caps w/ Various Frequencies",
    "indmultind.json": "Inductors of Various Inductances",
    "indmultfreq.json": "Inductors w/ Various Frequencies",
    "impedance.json": "Impedances of Same Magnitude",
    "res-series.json": "Series Resonance",
    "res-par.json": "Parallel Resonance"
  },

  "Passive Filters" : {
    "filt-hipass.json": "High-Pass Filter (RC)",
    "filt-lopass.json": "Low-Pass Filter (RC)",
    "filt-hipass-l.json": "High-Pass Filter (RL)",
    "filt-lopass-l.json": "Low-Pass Filter (RL)",
    "bandpass.json": "Band-pass Filter",
    "notch.json": "Notch Filter",
    "twint.json": "Twin-T Filter",
    "crossover.json": "Crossover",
    "butter10lo.json": "Butterworth Low-Pass (10 pole)",
    "besselbutter.json": "Bessel vs Butterworth",
    "ringing.json": "Band-pass with Ringing"
  },

  "Other Passive Circuits" : {
    "Series/Parallel" : {
      "indseries.json": "Inductors in Series",
      "indpar.json": "Inductors in Parallel",
      "capseries.json": "Caps in Series",
      "cappar.json": "Caps in Parallel"
    },

    "Transformers" : {
      "transformer.json": "Transformer",
      "transformerdc.json": "Transformer w/ DC",
      "transformerup.json": "Step-Up Transformer",
      "transformerdown.json": "Step-Down Transformer",
      "longdist.json": "Long-Distance Power Transmission"
    },

    "Relays" : {
      "relay.json": "Relay",
      "relayand.json": "Relay AND",
      "relayor.json": "Relay OR",
      "relayxor.json": "Relay XOR",
      "relaymux.json": "Relay Mux",
      "relayff.json": "Relay Flip-Flop",
      "relaytff.json": "Relay Toggle Flip-Flop",
      "relayctr.json": "Relay Counter",

      "3way.json": "3-Way Light Switches",
      "4way.json": "3- and 4-Way Light Switches",
      "diff.json": "Differentiator",
      "wheatstone.json": "Wheatstone Bridge",
      "lrc-critical.json": "Critically Damped LRC",
      "currentsrcelm.json": "Current Source",
      "inductkick.json": "Inductive Kickback",
      "inductkick-snub.json": "Blocking Inductive Kickback",
      "powerfactor1.json": "Power Factor",
      "powerfactor2.json": "Power Factor Correction",
      "grid.json": "Resistor Grid",
      "grid2.json": "Resistor Grid 2",
      "cube.json": "Resistor Cube"
    },

  "Coupled LC's": {
    "coupled1.json": "LC Modes (2)",
    "coupled2.json": "Weak Coupling",
    "coupled3.json": "LC Modes (3)",
    "ladder.json":  "LC Ladder"

    "phaseseq.json": "Phase-Sequence Network",
    "lissa.json": "Lissajous Figures"
  },

  "Diodes": {
    "diodevar.json": "Diode",
    "diodecurve.json": "Diode I/V Curve",
    "rectify.json": "Half-Wave Rectifier",
    "fullrect.json": "Full-Wave Rectifier",
    "fullrectf.json": "Full-Wave Rectifier w/ Filter",
    "diodelimit.json": "Diode Limiter"
  },

  "Zener Diodes" : {
    "zeneriv.json": "I/V Curve",
    "zenerref.json": "Voltage Reference",
    "zenerreffollow.json": "Voltage Reference w/ Follower",

    "dcrestoration.json": "DC Restoration",
    "inductkick-block.json": "Blocking Inductive Kickback",
    "spikegen.json": "Spike Generator"
  },

  "Voltage Multipliers" : {
    "voltdouble.json": "Voltage Doubler",
    "voltdouble2.json": "Voltage Doubler 2",
    "volttriple.json": "Voltage Tripler",
    "voltquad.json": "Voltage Quadrupler",

    "amdetect.json": "AM Detector",
    "diodeclip.json": "Waveform Clipper",
    "sinediode.json": "Triangle-to-Sine Converter",
    "ringmod.json": "Ring Modulator"
  },

  "Op-Amps": {
    "opamp.json": "Op-Amp",
    "opampfeedback.json": "Op-Amp Feedback"
  },

  "Amplifiers" : {
    "amp-invert.json": "Inverting Amplifier",
    "amp-noninvert.json": "Noninverting Amplifier",
    "amp-follower.json": "Follower",
    "amp-diff.json": "Differential Amplifier",
    "amp-sum.json": "Summing Amplifier",
    "logconvert.json": "Log Amplifier",
    "classd.json": "Class-D Amplifier",
  },

  "Oscillators" : {
    "relaxosc.json": "Relaxation Oscillator",
    "phaseshiftosc.json": "Phase-Shift Oscillator",
    "triangle.json": "Triangle Wave Generator",
    "sine.json": "Sine Wave Generator",
    "sawtooth.json": "Sawtooth Wave Generator",
    "vco.json": "Voltage-Controlled Oscillator",
    "rossler.json": "Rossler Circuit"

    "amp-rect.json": "Half-Wave Rectifier (inverting)",
    "amp-fullrect.json": "Full-Wave Rectifier",
    "peak-detect.json": "Peak Detector",
    "amp-integ.json": "Integrator",
    "amp-dfdx.json": "Differentiator",
    "amp-schmitt.json": "Schmitt Trigger",
    "nic-r.json": "Negative Impedance Converter",
    "gyrator.json": "Gyrator",
    "capmult.json": "Capacitance Multiplier",
    "howland.json": "Howland Current Source",
    "itov.json": "I-to-V Converter",
    "opamp-regulator.json": "Voltage Regulator",
    "opint.json": "741 Internals",
    "opint-invert-amp.json": "741 (inverting amplifier)",
    "opint-slew.json": "741 Slew Rate",
    "opint-current.json": "741 Current Limits"
  },

  "Transistors" : {
    "npn.json": "NPN Transistor",
    "pnp.json": "PNP Transistor",
    "transswitch.json": "Switch",
    "follower.json": "Emitter Follower"
  },

  "Multivibrators" : {
    "multivib-a.json": "Astable Multivib",
    "multivib-bi.json": "Bistable Multivib (Flip-Flop)",
    "multivib-mono.json": "Monostable Multivib (One-Shot)",

    "ceamp.json": "Common-Emitter Amplifier",
    "phasesplit.json": "Unity-Gain Phase Splitter",
    "schmitt.json": "Schmitt Trigger",
    "currentsrc.json": "Current Source",
    "currentsrcramp.json": "Current Source Ramp",
    "mirror.json": "Current Mirror",
    "darlington.json": "Darlington Pair"
  },

  "Differential Amplifiers" : {
    "trans-diffamp.json": "Differential Input",
    "trans-diffamp-common.json": "Common-Mode Input",
    "trans-diffamp-cursrc.json": "Common-Mode w/Current Source"
  },

  "Push-Pull Follower" : {
    "pushpullxover.json": "Simple, with distortion",
    "pushpull.json": "Improved"
  },

  "Oscillators" : {
    "colpitts.json": "Colpitts Oscillator",
    "hartley.json": "Hartley Oscillator",
    "eclosc.json": "Emitter-Coupled LC Oscillator"
  },


  "MOSFETs" : {
    "nmosfet.json": "n-MOSFET",
    "pmosfet.json": "p-MOSFET",
    "mosswitch.json": "Switch",
    "mosfollower.json": "Source Follower",
    "moscurrentsrc.json": "Current Source",
    "moscurrentramp.json": "Current Ramp",
    "mosmirror.json": "Current Mirror",
    "mosfetamp.json": "Common-Source Amplifier",
    "cmosinverter.json": "CMOS Inverter",
    "cmosinvertercap.json": "CMOS Inverter (w/capacitance)",
    "cmosinverterslow.json": "CMOS Inverter (slow transition)",
    "cmostransgate.json": "CMOS Transmission Gate",
    "mux.json": "CMOS Multiplexer",
    "samplenhold.json": "Sample-and-Hold",
    "delayrc.json": "Delayed Buffer",
    "leadingedge.json": "Leading-Edge Detector",
    "switchfilter.json": "Switchable Filter",
    "voltinvert.json": "Voltage Inverter",
    "invertamp.json": "Inverter Amplifier",
    "inv-osc.json": "Inverter Oscillator"
  },

  "555 Timer Chip" : {
    "555square.json": "Square Wave Generator",
    "555int.json": "Internals",
    "555saw.json": "Sawtooth Oscillator",
    "555lowduty.json": "Low-duty-cycle Oscillator",
    "555monostable.json": "Monostable Multivibrator",
    "555pulsemod.json": "Pulse Width Modulator",
    "555sequencer.json": "Pulse Sequencer",
    "555schmitt.json": "Schmitt Trigger (inverting)",
    "555missing.json": "Missing Pulse Detector"
  },

  "Active Filters" : {
    "filt-vcvs-lopass.json": "VCVS Low-Pass Filter",
    "filt-vcvs-hipass.json": "VCVS High-Pass Filter",
    "switchedcap.json": "Switched-Capacitor Filter",
    "allpass1.json": "Allpass",
    "allpass2.json": "Allpass w/ Square"
  },

  "Logic Families" : {
    "RTL" : {
      "rtlinverter.json": "RTL Inverter",
      "rtlnor.json": "RTL NOR",
      "rtlnand.json": "RTL NAND"
    },

    "DTL" : {
      "dtlinverter.json": "DTL Inverter",
      "dtlnand.json": "DTL NAND",
      "dtlnor.json": "DTL NOR"
    },

    "TTL" : {
      "ttlinverter.json": "TTL Inverter",
      "ttlnand.json": "TTL NAND",
      "ttlnor.json": "TTL NOR"
    },

    "NMOS" : {
      "nmosinverter.json": "NMOS Inverter",
      "nmosinverter2.json": "NMOS Inverter 2",
      "nmosnand.json": "NMOS NAND"
    },

    "CMOS" : {
      "cmosinverter.json": "CMOS Inverter",
      "cmosnand.json": "CMOS NAND",
      "cmosnor.json": "CMOS NOR",
      "cmosxor.json": "CMOS XOR",
      "cmosff.json": "CMOS Flip-Flop",
      "cmosmsff.json": "CMOS Master-Slave Flip-Flop"
    },

    "ECL" : {
      "eclnor.json": "ECL NOR/OR"
    },

    "Ternary" : {
      "3-cgand.json": "CGAND",
      "3-cgor.json": "CGOR",
      "3-invert.json": "Complement (F210)",
      "3-f211.json": "F211",
      "3-f220.json": "F220",
      "3-f221.json": "F221"
    }
  },

  "Combinational Logic" : {
    "xor.json": "Exclusive OR",
    "halfadd.json": "Half Adder",
    "fulladd.json": "Full Adder",
    "decoder.json": "1-of-4 Decoder",
    "mux3state.json": "2-to-1 Mux",
    "majority.json": "Majority Logic",
    "digcompare.json": "2-Bit Comparator",
    "7segdecoder.json": "7-Segment LED Decoder"
  },

  "Sequential Logic" : {
    "Flip-Flops",
      "nandff.json": "SR Flip-Flop",
      "clockedsrff.json": "Clocked SR Flip-Flop",
      "masterslaveff.json": "Master-Slave Flip-Flop",
      "edgedff.json": "Edge-Triggered D Flip-Flop",
      "jkff.json": "JK Flip-Flop"
  },

  "Counters" : {
    "counter.json": "4-Bit Ripple Counter",
    "counter8.json": "8-Bit Ripple Counter",
    "synccounter.json": "Synchronous Counter",
    "deccounter.json": "Decimal Counter",
    "graycode.json": "Gray Code Counter",
    "johnsonctr.json": "Johnson Counter",

    "divideby2.json": "Divide-by-2",
    "divideby3.json": "Divide-by-3",
    "ledflasher.json": "LED Flasher",
    "traffic.json": "Traffic Light",
    "dram.json": "Dynamic RAM"
  },

  "Analog/Digital" : {
    "flashadc.json": "Flash ADC",
    "deltasigma.json": "Delta-Sigma ADC",
    "hfadc.json": "Half-Flash (Subranging) ADC",
    "dac.json": "Binary-Weighted DAC",
    "r2rladder.json": "R-2R Ladder DAC",
    "swtreedac.json": "Switch-Tree DAC",
    "digsine.json": "Digital Sine Wave"
  },

  "Phase-Locked Loops" : {
    "xorphasedet.json": "XOR Phase Detector",
    "pll.json": "Type I PLL",
    "phasecomp.json": "Phase Comparator (Type II)",
    "phasecompint.json": "Phase Comparator Internals",
    "pll2.json": "Type II PLL",
    "pll2a.json": "Type II PLL (fast)",
    "freqdouble.json": "Frequency Doubler"
  },

  "Transmission Lines" : {
    "tl.json": "Simple TL",
    "tlstand.json": "Standing Wave",
    "tlterm.json": "Termination",
    "tlmismatch.json": "Mismatched lines (Pulse)",
    "tlmis1.json": "Mismatched lines (Standing Wave)",
    "tlmatch1.json": "Impedance Matching (L-Section)",
    "tlmatch2.json": "Impedance Matching (Shunt Stub)",
    "tlfreq.json": "Stub Frequency Response",
    "tllopass.json": "Low-Pass Filter",
    "tllight.json": "Light Switch"
  },

  "Misc Devices" : {
    "JFETs": {
      "jfetcurrentsrc.json": "JFET Current Source",
      "jfetfollower.json": "JFET Follower",
      "jfetfollower-nooff.json": "JFET Follower w/zero offset",
      "jfetamp.json": "Common-Source Amplifier",
      "volume.json": "Volume Control"
    },

  "Tunnel Diodes" : {
    "tdiode.json": "I/V Curve",
    "tdosc.json": "LC Oscillator",
    "tdrelax.json": "Relaxation Oscillator"
  },

  "Memristors" : {
    "mr.json": "Memristor",
    "mr-sine.json": "Sine Wave",
    "mr-square.json": "Square Wave",
    "mr-triangle.json": "Triangle Wave",
    "mr-sine2.json": "Hard-Switching 1",
    "mr-sine3.json": "Hard-Switching 2",
    "mr-crossbar.json": "Crossbar Memory"
  },

  "Triodes" : {
    "triode.json": "Triode",
    "triodeamp.json": "Amplifier"
  },

  "Silicon-Controlled Rectifiers" : {
    "scr.json": "SCR",
    "scractrig.json": "AC Trigger"
  },

  "Current Conveyor" : {
    "cc2.json": "CCII+",
    "cc2n.json": "CCII-",
    "ccinductor.json": "Inductor Simulator",
    "cc2imp.json": "CCII+ Implementation",
    "cc2impn.json": "CCII- Implementation",
    "cciamp.json": "Current Amplifier",
    "ccvccs.json": "VCCS",
    "ccdiff.json": "Current Differentiator",
    "ccint.json": "Current Integrator",
    "ccitov.json": "Current-Controlled Voltage Source"
  },

  "Spark Gap" : {
    "spark-sawtooth.json": "Sawtooth Generator",
    "tesla.json": "Tesla Coil",
    "spark-marx.json": "Marx Generator"
  }
},