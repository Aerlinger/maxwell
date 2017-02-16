var VoltageElm = require('../components/VoltageElm.js');
var CurrentElm = require('../components/CurrentElm.js');
var InductorElm = require('../components/InductorElm.js');
var CapacitorElm = require('../components/CapacitorElm.js');
var Util = require('../util/Util.js');

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

  validElm(circuitElm) {
    var isFirstElm = circuitElm === this.firstElm;

    var isValid = false;

    if (this.type === Pathfinder.INDUCT)
      isValid = circuitElm instanceof CurrentElm;

    if (this.type === Pathfinder.VOLTAGE)
      isValid = !(circuitElm.isWire() || Util.typeOf(circuitElm, VoltageElm));

    if (this.type === Pathfinder.SHORT)
      isValid = !circuitElm.isWire();

    if (this.type === Pathfinder.CAP_V)
      isValid = !(circuitElm.isWire() || circuitElm instanceof CapacitorElm || Util.typeOf(circuitElm, VoltageElm));

    return isValid || isFirstElm;


    // return (circuitElm === this.firstElm) ||
    // ((circuitElm instanceof CurrentElm) && (this.type === Pathfinder.INDUCT)) ||
    // ((this.type === Pathfinder.VOLTAGE) && !(circuitElm.isWire() || Util.typeOf(circuitElm, VoltageElm))) ||
    // ((this.type === Pathfinder.SHORT) && !circuitElm.isWire()) ||
    // ((this.type === Pathfinder.CAP_V) && !(circuitElm.isWire() || circuitElm instanceof CapacitorElm || Util.typeOf(circuitElm, VoltageElm)));
  }

  findPath(nodeIdx, depth) {
    if (nodeIdx === this.dest)
      return true;

    if (depth-- === 0)
      return false;

    // We're back to where we started, so start over
    if (this.used[nodeIdx])
      return false;

    // Remember that we've traversed this node
    this.used[nodeIdx] = true;

    for (var element of this.elementList) {
      // Skip valid elements
      if (this.validElm(element)) continue;

      var j;
      if (nodeIdx === 0) {
        // Look for posts which have a ground connection. Our path can go through ground!
        for (j = 0; j < element.getPostCount(); j++) {
          if (element.hasGroundConnection(j) && this.findPath(element.getNode(j), depth)) {
            this.used[0] = false;
            return true;
          }
        }
      }

      for (j = 0; j < element.getPostCount(); ++j) {
        if (element.getNode(j) === nodeIdx)
          break;
      }

      // element Isn't neighboring nodeIdx, continue to the next element
      if (j === element.getPostCount())
        continue;

      // Return true if we have a path through ground
      if (element.hasGroundConnection(j) && this.findPath(0, depth)) {
        this.used[nodeIdx] = false;
        return true;
      }

      if ((this.type === Pathfinder.INDUCT) && element instanceof InductorElm) {
        var current = element.getCurrent();
        if (j === 0)
          current = -current;

        if (Math.abs(current - this.firstElm.getCurrent()) > 1e-10)
          continue;
      }

      for (var k = 0; k < element.getPostCount(); ++k) {
        if (j === k) continue;

        if (element.getConnection(j, k) && this.findPath(element.getNode(k), depth)) {
          this.used[nodeIdx] = false;
          return true;
        }
      }
    }

    this.used[nodeIdx] = false;
    return false;
  }
}
Pathfinder.initClass();

module.exports = Pathfinder;
