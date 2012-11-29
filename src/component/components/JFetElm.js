function JFetElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f);

}
;

JFetElm.prototype = new CircuitElement();
JFetElm.prototype.constructor = JFetElm;