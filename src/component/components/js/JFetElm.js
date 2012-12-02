function JFetElm(xa, ya, xb, yb, f, st) {
    AbstractCircuitComponent.call(this, xa, ya, xb, yb, f);

}
;

JFetElm.prototype = new AbstractCircuitComponent();
JFetElm.prototype.constructor = JFetElm;