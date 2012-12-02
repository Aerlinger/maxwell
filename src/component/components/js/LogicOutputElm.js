function LogicOutputElm(xa, ya, xb, yb, f, st) {
    AbstractCircuitComponent.call(this, xa, ya, xb, yb, f);

}
;

LogicOutputElm.prototype = new AbstractCircuitComponent();
LogicOutputElm.prototype.constructor = LogicOutputElm;