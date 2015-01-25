## Example Components:

```jade

  // Missing Components or Functionality:
  canvas.maxwell(data-circuit="ohms", width="1600", height="3000")
  canvas.maxwell(data-circuit="induct", width="1600", height="3000")

  // Buggy/Not working:
  // qp == -1 (Has one row with all zero values)
  canvas.maxwell(data-circuit="amp-follower", width="1600", height="3000")
  canvas.maxwell(data-circuit="nmosfet", width="1600", height="3000")
  canvas.maxwell(data-circuit="amp-noninvert", width="1600", height="3000")

  // Needs testing/validation:
  canvas.maxwell(data-circuit="zeneriv", width="1600", height="3000")
  canvas.maxwell(data-circuit="relaxosc", width="1600", height="3000")
  canvas.maxwell(data-circuit="amp-schmitt", width="1600", height="3000")
  canvas.maxwell(data-circuit="howland", width="1600", height="3000")
  canvas.maxwell(data-circuit="dcrestoration", width="1600", height="3000")
  canvas.maxwell(data-circuit="ladder", width="1600", height="3000")

  // Runs, but invalid result:
  canvas.maxwell(data-circuit="amp-fullrect", width="1600", height="3000")
  canvas.maxwell(data-circuit="sine", width="1600", height="3000")
  canvas.maxwell(data-circuit="sawtooth", width="1600", height="3000")
  canvas.maxwell(data-circuit="sawtooth", width="1600", height="3000")

  // Working:
  canvas.maxwell(data-circuit="grid", width="1600", height="3000")
  canvas.maxwell(data-circuit="grid2", width="1600", height="3000")
  canvas.maxwell(data-circuit="amp-invert", width="1600", height="3000")
  canvas.maxwell(data-circuit="triangle", width="1600", height="3000")
  canvas.maxwell(data-circuit="phaseshiftosc", width="1600", height="3000")
  canvas.maxwell(data-circuit="mosfetamp", width="1600", height="3000")
  canvas.maxwell(data-circuit="mosswitch", width="1600", height="3000")
  canvas.maxwell(data-circuit="amp-diff", width="1600", height="3000")
  canvas.maxwell(data-circuit="inductac", width="1600", height="3000")
  canvas.maxwell(data-circuit="amp-integ", width="1600", height="3000")
  canvas.maxwell(data-circuit="indmultind", width="1600", height="3000")
  canvas.maxwell(data-circuit="diodelimit", width="1600", height="3000")
  canvas.maxwell(data-circuit="rectify", width="1600", height="3000")
  canvas.maxwell(data-circuit="diodecurve", width="1600", height="3000")
  canvas.maxwell(data-circuit="fullrect", width="1600", height="3000")
  canvas.maxwell(data-circuit="amp-sum", width="1600", height="3000")
  canvas.maxwell(data-circuit="gyrator", width="1600", height="3000")
  canvas.maxwell(data-circuit="voltdividesimple", width="1600", height="3000")

```
