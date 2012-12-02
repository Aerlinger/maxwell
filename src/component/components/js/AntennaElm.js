function AntennaElm(xa, ya, xb, yb, f, st) {
    AbstractCircuitComponent.call(this, xa, ya, xb, yb, f);

}
;

// Step 1: Prototype of DepthRectangle is Rectangle
AntennaElm.prototype = new AbstractCircuitComponent();
// Step 2: Now we need to set the constructor to the DepthRectangle instead of Rectangle
AntennaElm.prototype.constructor = AntennaElm;