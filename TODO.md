## Frequently Failing Test Circuits:

- 'dtlnor',   # Permute R?, o?
- 'deltasigma'
- 'dram'      # AND
- 'mux3state',   # AND
- 'phasecompint'  # AND?

*Suspects: AndGate?, DFlipFlop?*

- 'relayctr'
- 'relaytff'
- 'traffic'

**Not yet implemented:** Tapped Transformer

#Inconsistently Failing Test Circuits:

- Voltage Controlled Oscillator (VCO)
- Voltage Regulator (Op amp)

*Most likely attributable to time-varying voltage sources. Sawtooth and triangle-wave voltage sources, specifically*

## Epsilon error (computation/roundoff)

- 'cciamp',   # Numerical error, R? o?
- 'ccvccs'   # Numerical error, R?, o?
- 'opint-current',   # Permute?, R?, o?
- 'opint-invert-amp'  # PERMUTE, R?, o?
- 'opint-slew'      # PERMUTE, R?, o?
