let VoltageElm = require('../circuit/components/VoltageElm.js');
let CurrentElm = require('../circuit/components/CurrentElm.js');
let ResistorElm = require('../circuit/components/ResistorElm.js');
let InductorElm = require('../circuit/components/InductorElm.js');
let CapacitorElm = require('../circuit/components/CapacitorElm.js');
let Util = require('../util/util.js');

class Pathfinder {
  static initClass() {
    this.INDUCT = 1;
    this.VOLTAGE = 2;
    this.SHORT = 3;
    this.CAP_V = 4;
  }

  constructor(type, firstElm, dest, elementList, numNodes) {
    this.type = type;
    this.firstElm = firstElm;
    this.dest = dest;
    this.elementList = elementList;
    this.used = new Array(numNodes);
  }

  validElm(ce) {
    return (ce === this.firstElm) ||
    ((ce instanceof CurrentElm) && (this.type === Pathfinder.INDUCT)) ||
    ((this.type === Pathfinder.VOLTAGE) && !(ce.isWire() || Util.typeOf(ce, VoltageElm))) ||
    ((this.type === Pathfinder.SHORT) && !ce.isWire()) ||
    ((this.type === Pathfinder.CAP_V) && !(ce.isWire() || ce instanceof CapacitorElm || Util.typeOf(ce, VoltageElm)));
  }

  findPath(n1, depth) {
    if (n1 === this.dest) {
//      console.log("n1 is @dest")
      return true;
    }
    if (depth-- === 0) {
      return false;
    }

    if (this.used[n1]) {
//      console.log("used " + n1)
      return false;
    }

    this.used[n1] = true;

    for (let ce of Array.from(this.elementList)) {
      var j;
      if (this.validElm(ce)) { continue; }

      if (n1 === 0) {
        // Look for posts which have a ground connection. Our path can go through ground!
        for (j = 0, end = ce.getPostCount(), asc = 0 <= end; asc ? j < end : j > end; asc ? j++ : j--) {
          var asc, end;
          if (ce.hasGroundConnection(j) && this.findPath(ce.getNode(j), depth)) {
//            console.log(ce + " has ground (n1 is 0)")
            this.used[0] = false;
            return true;
          }
        }
      }

      for (j = 0, end1 = ce.getPostCount(), asc1 = 0 <= end1; asc1 ? j < end1 : j > end1; asc1 ? j++ : j--) {
//        console.log("get post " + ce.dump() + " " + ce.getNode(j))
        var asc1, end1;
        if (ce.getNode(j) === n1) {
          break;
        }
      }

      // TODO: ENSURE EQUALITY HERE
      if (j === ce.getPostCount()) {
        continue;
      }

      if (ce.hasGroundConnection(j) && this.findPath(0, depth)) {
//        console.log(ce + " has ground")
        this.used[n1] = false;
        return true;
      }

      if ((this.type === Pathfinder.INDUCT) && ce instanceof InductorElm) {
        let current = ce.getCurrent();
        if (j === 0) {
          current = -current;
        }

//        console.log(ce + " > " + @firstElm + " >> matching " + ce + " to " + @firstElm.getCurrent())
        if (Math.abs(current - this.firstElm.getCurrent()) > 1e-10) {
          continue;
        }
      }

      for (let k = 0, end2 = ce.getPostCount(), asc2 = 0 <= end2; asc2 ? k < end2 : k > end2; asc2 ? k++ : k--) {
        if (j === k) { continue; }

//        console.log(ce + " " + ce.getNode(j) + " - " + ce.getNode(k))
        if (ce.getConnection(j, k) && this.findPath(ce.getNode(k), depth)) {
//          console.log("got findpath #{n1}")
          //            console.log("got findpath j: #{ce.getNode(j).toString()}, k: #{ce.getNode(k).toString()} on element " + ce)
          this.used[n1] = false;
          return true;
        }
      }
    }

    //      console.log(n1 + " failed")
    this.used[n1] = false;
    return false;
  }
}
Pathfinder.initClass();

module.exports = Pathfinder;
