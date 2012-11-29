Inductor.FLAG_BACK_EULER = 2;


function Inductor() {
    this.nodes = new Array(2);
    this.flags = 0;

    this.inductance = 0;
    this.compResistance = 0;
    this.current = 0;
    this.curSourceValue = 0;
}
;

Inductor.prototype.setup = function (ic, cr, f) {
    this.inductance = ic;
    this.current = cr;
    this.flags = f;

};


Inductor.prototype.isTrapezoidal = function () {
    return (this.flags & Inductor.FLAG_BACK_EULER) == 0;
};

Inductor.prototype.reset = function () {
    this.current = 0;
};

Inductor.prototype.stamp = function (n0, n1) {
    // inductor companion model using trapezoidal or backward euler
    // approximations (Norton equivalent) consists of a current
    // source in parallel with a resistor.  Trapezoidal is more
    // accurate than backward euler but can cause oscillatory behavior.
    // The oscillation is a real problem in circuits with switches.
    this.nodes[0] = n0;
    this.nodes[1] = n1;
    if (this.isTrapezoidal())
        this.compResistance = 2 * this.inductance / Circuit.timeStep;
    else // backward euler
        this.compResistance = this.inductance / Circuit.timeStep;

    Circuit.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
    Circuit.stampRightSide(this.nodes[0]);
    Circuit.stampRightSide(this.nodes[1]);
};

Inductor.prototype.nonLinear = function () {
    return false;
};

Inductor.prototype.startIteration = function (voltdiff) {
    if (this.isTrapezoidal())
        this.curSourceValue = voltdiff / this.compResistance + this.current;
    else // backward euler
        this.curSourceValue = this.current;
};

Inductor.prototype.calculateCurrent = function (voltdiff) {
    // we check compResistance because this might get called
    // before stamp(), which sets compResistance, causing
    // infinite current
    if (this.compResistance > 0)
        this.current = voltdiff / this.compResistance + this.curSourceValue;
    return this.current;
};

Inductor.prototype.doStep = function (voltdiff) {
    Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
};
