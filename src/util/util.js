let Point = require('../geom/point.js');
let Polygon = require('../geom/polygon.js');
let Settings = require('../settings/settings.js');
let Color = require('./color.js');
let { sprintf } = require("sprintf-js");
let environment = require("../environment.js");

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

  static calcArrow(point1, point2, al, aw) {
    if ((arguments.length) !== 4) {
      this.halt(`Wrong arguments (${arguments.length}) in 'calcArrow' ${arguments}`);
    }

    let poly = new Polygon();

    let dx = point2.x - point1.x;
    let dy = point2.y - point1.y;
    let dist = Math.sqrt((dx * dx) + (dy * dy));

    poly.addVertex(point2.x, point2.y);

    let [p1, p2] = Util.interpolateSymmetrical(point1, point2, 1 - (al / dist), aw);

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
    for (let vertex of Array.from(vertexArray)) {
      newPoly.addVertex(vertex.x, vertex.y);
    }

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

  static drawValue(x1, y1, circuitElm, str) {}

  static printArray(arr) {
    return Array.from(arr).map((subarr) => console.log(subarr));
  }

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

  static getUnitText(value, unit, decimalPoints) {
    if (decimalPoints == null) { decimalPoints = 2; }
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

  static getVoltageColor(volts, fullScaleVRange) {
    // TODO: Define voltage range
    if (fullScaleVRange == null) { fullScaleVRange = 5; }

    let RedGreen =
      [ "#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
        "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
        "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747",
        "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00" ];

    let scale =
      ["#B81B00", "#B21F00", "#AC2301", "#A72801", "#A12C02", "#9C3002", "#963503", "#913903",
        "#8B3E04", "#854205", "#804605", "#7A4B06", "#754F06", "#6F5307", "#6A5807", "#645C08",
        "#5F6109", "#596509", "#53690A", "#4E6E0A", "#48720B", "#43760B", "#3D7B0C", "#387F0C",
        "#32840D", "#2C880E", "#278C0E", "#21910F", "#1C950F", "#169910", "#119E10", "#0BA211", "#06A712"];

    let blueScale =
      ["#EB1416", "#E91330", "#E7134A", "#E51363", "#E3137C", "#E11394", "#E013AC", "#DE13C3",
        "#DC13DA", "#C312DA", "#AA12D8", "#9012D7", "#7712D5", "#5F12D3", "#4612D1", "#2F12CF",
        "#1712CE", "#1123CC", "#1139CA", "#114FC8", "#1164C6", "#1179C4", "#118EC3", "#11A2C1",
        "#11B6BF", "#10BDB1", "#10BB9B", "#10BA84", "#10B86F", "#10B659", "#10B444", "#10B230", "#10B11C"];

    scale = Color.Gradients.voltage_default;

    let numColors = scale.length - 1;

    let value = Math.floor(((volts + fullScaleVRange) * numColors) / (2 * fullScaleVRange));
    if (value < 0) {
      value = 0;
    } else if (value >= numColors) {
      value = numColors - 1;
    }

    return scale[value];
  }

  static snapGrid(x) {
    return Settings.GRID_SIZE * Math.round(x/Settings.GRID_SIZE);
  }

  static showFormat(decimalNum) {
    return decimalNum.toPrecision(2);
  }

  static shortFormat(decimalNum) {
    return decimalNum.toPrecision(1);
  }

  static longFormat(decimalNum) {
    return decimalNum.toPrecision(4);
  }

  static singleFloat(f) {
    if (f === undefined) {
      return "undef";
    } else {
      return sprintf("%0.1f", f);
    }
  }

  static tidyFloat(f) {
    if (f === undefined) {
      return "undef";
    } else {
      return sprintf("%0.2f", f);
    }
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

    for (let i = 0, end = matrixRowCount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
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
    return (typeof x == "string") || (typeof x == "number") || (typeof x == "boolean")
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

  static typeOf(obj, klassType) {
    return (obj.constructor === klassType) || (obj.constructor.prototype instanceof klassType)

    // let klass = obj.constructor;

    // if (klass === klassType) { return true; }

    /*
    while (klass.__super__ != null) {
      if (klass.__super__ === klassType.prototype) {
        return true;
      }

      klass = klass.__super__.constructor;
    }
    */

    // return false;
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
}


module.exports = Util;
