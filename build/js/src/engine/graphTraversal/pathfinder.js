(function() {
  define(['cs!component/components/VoltageElm', 'cs!component/components/CurrentElm', 'cs!component/components/ResistorElm', 'cs!component/components/InductorElm', 'cs!component/components/CapacitorElm'], function(VoltageElm, CurrentElm, ResistorElm, InductorElm, CapacitorElm) {
    var Pathfinder;
    Pathfinder = (function() {
      Pathfinder.INDUCT = 1;

      Pathfinder.VOLTAGE = 2;

      Pathfinder.SHORT = 3;

      Pathfinder.CAP_V = 4;

      function Pathfinder(type, firstElm, dest, elementList, numNodes) {
        this.type = type;
        this.firstElm = firstElm;
        this.dest = dest;
        this.elementList = elementList;
        this.used = new Array(numNodes);
      }

      Pathfinder.prototype.findPath = function(n1, depth) {
        var c, ce, j, k, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _ref3;
        if (n1 === this.dest) {
          console.log("n1 is @dest");
          return true;
        }
        if (depth-- === 0) {
          return false;
        }
        if (this.used[n1]) {
          console.log("used " + n1);
          return false;
        }
        this.used[n1] = true;
        _ref = this.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ce = _ref[_i];
          if (ce === this.firstElm) {
            console.log("ce is @firstElm");
            continue;
          }
          if ((ce instanceof CurrentElm) && (this.type === Pathfinder.INDUCT)) {
            continue;
          }
          if (this.type === Pathfinder.VOLTAGE) {
            if (!(ce.isWire() || ce instanceof VoltageElm)) {
              console.log("type == VOLTAGE");
              continue;
            }
          }
          if (this.type === Pathfinder.SHORT && !ce.isWire()) {
            console.log("(type == SHORT && !ce.isWire())");
            continue;
          }
          if (this.type === Pathfinder.CAP_V) {
            if (!(ce.isWire() || ce instanceof CapacitorElm || ce instanceof VoltageElm)) {
              console.log("if !(ce.isWire() or ce instanceof CapacitorElm or ce instanceof VoltageElm)");
              continue;
            }
          }
          if (n1 === 0) {
            for (j = _j = 0, _ref1 = ce.getPostCount(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
              if (ce.hasGroundConnection(j) && this.findPath(ce.getNode(j), depth)) {
                console.log(ce + " has ground (n1 is 0)");
                this.used[n1] = false;
                return true;
              }
            }
          }
          for (j = _k = 0, _ref2 = ce.getPostCount(); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
            console.log("get post " + ce.dump() + " " + ce.getNode(j));
            if (ce.getNode(j) === n1) {
              break;
            }
          }
          if (j === ce.getPostCount()) {
            continue;
          }
          if (ce.hasGroundConnection(j) && this.findPath(0, depth)) {
            console.log(ce + " has ground");
            this.used[n1] = false;
            return true;
          }
          if (this.type === Pathfinder.INDUCT && ce instanceof InductorElm) {
            c = ce.getCurrent();
            if (j === 0) {
              c = -c;
            }
            console.log(ce + " > " + this.firstElm + " >> matching " + ce + " to " + this.firstElm.getCurrent());
            if (Math.abs(c - this.firstElm.getCurrent()) > 1e-10) {
              continue;
            }
          }
          for (k = _l = 0, _ref3 = ce.getPostCount(); 0 <= _ref3 ? _l < _ref3 : _l > _ref3; k = 0 <= _ref3 ? ++_l : --_l) {
            if (j === k) {
              continue;
            }
            console.log(ce + " " + ce.getNode(j) + " - " + ce.getNode(k));
            if (ce.getConnection(j, k) && this.findPath(ce.getNode(k), depth)) {
              this.used[n1] = false;
              console.log("got findpath " + n1);
              return true;
            }
          }
        }
        this.used[n1] = false;
        return false;
      };

      return Pathfinder;

    })();
    return Pathfinder;
  });

}).call(this);
