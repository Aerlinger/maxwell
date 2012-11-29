function LogicOutputElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f);

}
;

LogicOutputElm.prototype = new CircuitElement();
LogicOutputElm.prototype.constructor = LogicOutputElm;