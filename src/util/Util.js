let Point = require('../geom/Point.js');
let Polygon = require('../geom/Polygon.js');
let Settings = require('../Settings.js');
let Color = require('./Color.js');
let environment = require("../Environment.js");

class Util {

  static extend(originalObj, newObject) {
    let value;
    let extendedObj = {};

    for (var key in originalObj) {
      value = originalObj[key];
      extendedObj[key] = originalObj[key];
    }

    for (key in newObject) {
      value = newObject[key];
      extendedObj[key] = newObject[key];
    }

    return extendedObj;
  }

  // Calculate fractional vector between AB
  static interpolate(ptA, ptB, u, v) {
    if (v == null) { v = 0; }
    if ((arguments.length) > 4) {
      this.halt(`Wrong arguments (${arguments.length}) in 'interpolate' ${arguments}`);
    }

    let dx = ptB.y - ptA.y;
    let dy = ptA.x - ptB.x;
    v /= Math.sqrt((dx*dx) + (dy*dy));

    let interpX = Math.round(((1-u)*ptA.x) + (u*ptB.x) + (v*dx));
    let interpY = Math.round(((1-u)*ptA.y) + (u*ptB.y) + (v*dy));

    return new Point(interpX, interpY);
  }

  //#
  // From a vector between points AB, calculate a new point in space relative to some multiple of the parallel (u)
  // and perpindicular (v) components of the the original AB vector.
  //
  static interpolateSymmetrical(ptA, ptB, u, v) {
    if ((arguments.length) > 4) {
      this.halt(`Wrong # of arguments (${arguments.length}) in 'interpolateSymmetrical' ${arguments}`);
    }

    let dx = ptB.y - ptA.y;
    let dy = ptA.x - ptB.x;
    v /= Math.sqrt((dx*dx) + (dy*dy));

    let interpX = Math.round(((1-u)*ptA.x) + (u*ptB.x) + (v*dx));
    let interpY = Math.round(((1-u)*ptA.y) + (u*ptB.y) + (v*dy));

    let interpXReflection = Math.round((((1-u)*ptA.x) + (u*ptB.x)) - (v*dx));
    let interpYReflection = Math.round((((1-u)*ptA.y) + (u*ptB.y)) - (v*dy));

    return [new Point(interpX, interpY), new Point(interpXReflection, interpYReflection)];
  }

  static calcArrow(point1, point2, p, q) {
    if ((arguments.length) !== 4) {
      this.halt(`Wrong arguments (${arguments.length}) in 'calcArrow' ${arguments}`);
    }

    let poly = new Polygon();

    let dx = point2.x - point1.x;
    let dy = point2.y - point1.y;
    let dist = Math.sqrt((dx * dx) + (dy * dy));

    poly.addVertex(point2.x, point2.y);

    let [p1, p2] = Util.interpolateSymmetrical(point1, point2, 1 - (p / dist), q);

    poly.addVertex(p1.x, p1.y);
    poly.addVertex(p2.x, p2.y);

    return poly;
  }

  static createPolygon(pt1, pt2, pt3, pt4) {
    let newPoly = new Polygon();
    newPoly.addVertex(pt1.x, pt1.y);
    newPoly.addVertex(pt2.x, pt2.y);
    newPoly.addVertex(pt3.x, pt3.y);
    if (pt4) { newPoly.addVertex(pt4.x, pt4.y); }

    return newPoly;
  }

  static createPolygonFromArray(vertexArray) {
    let newPoly = new Polygon();

    for (let vertex of Array.from(vertexArray))
      newPoly.addVertex(vertex.x, vertex.y);

    return newPoly;
  }

  static zeroArray(numElements) {
    if (!numElements || numElements < 1) {
      return [];
    } else {
      return (Array.from(Array(numElements)).map((i) => 0));
    }
  }

  static zeroArray2(numRows, numCols) {
    if (numRows < 1) { return []; }
    return (Array.from(Array(numRows)).map((i) => this.zeroArray(numCols)));
  }

// Loops through an array, returning false and throwing an error if NaN or Inf values are found.
//  If no NaN or Inf values are found, this array is determined to be clean and the method returns true.
  static isCleanArray(arr) {
    for (let element of Array.from(arr)) {
      if (element instanceof Array) {
        let valid = arguments.callee(element);
      } else {
        if (!isFinite(element)) {
          console.trace(`Invalid number found: ${element}`);
          return false;
        }
      }
    }
  }

  static newPointArray(n) {
    let a = new Array(n);
    while (n > 0) {
      a[--n] = new Point(0, 0);
    }

    return a;
  }

  /*
  static printArray(arr) {
    return Array.from(arr).map((subarr) => console.log(subarr));
  }
  */

  static removeFromArray(arr, ...items) {
    for (let item of Array.from(items)) {
      var ax;
      while ((ax = arr.indexOf(item)) !== -1) {
        arr.splice(ax, 1);
      }
    }

    return arr;
  }

  static isInfinite(x) {
    return !isFinite(x);
  }

  static getRand(x) {
    return Math.floor(Math.random() * (x + 1));
  }

  static getUnitText(value, unit = "", decimalPoints = 2) {
    let absValue = Math.abs(value);
    if (absValue < 1e-18) { return `0 ${unit}`; }
    if (absValue < 1e-12) { return (value * 1e15).toFixed(decimalPoints) + " f" + unit; }
    if (absValue < 1e-9) { return (value * 1e12).toFixed(decimalPoints) + " p" + unit; }
    if (absValue < 1e-6) { return (value * 1e9).toFixed(decimalPoints) + " n" + unit; }
    if (absValue < 1e-3) { return (value * 1e6).toFixed(decimalPoints) + " μ" + unit; }
    if (absValue < 1) { return (value * 1e3).toFixed(decimalPoints) + " m" + unit; }
    if (absValue < 1e3) { return (value).toFixed(decimalPoints) + " " + unit; }
    if (absValue < 1e6) { return (value * 1e-3).toFixed(decimalPoints) + " k" + unit; }
    if (absValue < 1e9) { return (value * 1e-6).toFixed(decimalPoints) + " M" + unit; }
    return (value * 1e-9).toFixed(decimalPoints) + " G" + unit;
  }

  static snapGrid(x) {
    return Settings.GRID_SIZE * Math.round(x/Settings.GRID_SIZE);
  }

  static showFormat(decimalNum) {
    return decimalNum.toPrecision(2);
  }

  static longFormat(decimalNum) {
    return decimalNum.toPrecision(4);
  }

  static singleFloat(f) {
    if (f === undefined) {
      return "undef";
    } else {
      return (f).toFixed(1)
    }
  }

  static tidyFloat(f) {
    if (f === undefined) {
      return "undef";
    } else {
      return (f).toFixed(2)
    }
  }

  static floatToPercent(f, digits = 1) {
    return (f * 100).toFixed(2) + "%";
  }

  static isFunction(v) {
    return typeof v === "function";
  }

  /*
  Removes commas from a number containing a string:
  e.g. 1,234,567.99 -> 1234567.99
  */
  static noCommaFormat(numberWithCommas) {
    return numberWithCommas.replace(/,/g, '');
  }

  static printArray(array) {
    let matrixRowCount = array.length;

    let arrayStr = "[";

    for (let i = 0; i < matrixRowCount; ++i) {
      arrayStr += Util.tidyFloat(array[i]);

      if(i !== (matrixRowCount - 1)) {
        arrayStr += ", ";
      }
    }
//        circuitMatrixDump += ", "

    arrayStr += "]";

    return arrayStr;
  }

  static isValue(x) {
    return !isNaN(x) && ((typeof x == "string") || (typeof x == "number") || (typeof x == "boolean"))
  }

  static commaFormat(plainNumber) {
    // Simple method of converting a parameter to a string
    plainNumber += "";

    // Ignore any numbers after a '.'
    let x = plainNumber.split(".");
    let x1 = x[0];
    let x2 = (x.length > 1 ? `.${x[1]}` : "");
    let pattern = /(\d+)(\d{3})/;
    while (pattern.test(x1)) { x1 = x1.replace(pattern, "$1,$2"); }

    return x1 + x2;
  }

  static colorHash() {

  }

  static getColorForId(id) {
    let letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++ ) {
      color += letters[(i+3)*(i+4)*id % 16];
    }

    return color;
  }

  static typeOf(obj, klassType) {
    return (obj.constructor === klassType) || (obj.constructor.prototype instanceof klassType);
  }

  static halt(message) {
    console.trace(message);

    if (!environment.isBrowser) {
      return process.exit(1);
    }
  }

  static comparePair(x1, x2, y1, y2) {
    return ((x1 === y1) && (x2 === y2)) || ((x1 === y2) && (x2 === y1));
  }

  static overlappingPoints(pt1, pt2) {
    return (pt1.x === pt2.x) && (pt1.y === pt2.y);
  }

  static rgb2hex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  static diff(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;});
  }
}


module.exports = Util;
