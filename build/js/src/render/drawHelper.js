(function() {
  define(['cs!settings/Settings', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point'], function(Settings, Polygon, Rectangle, Point) {
    var DrawHelper;
    DrawHelper = (function() {
      var EPSILON;

      function DrawHelper() {}

      DrawHelper.ps1 = new Point(0, 0);

      DrawHelper.ps2 = new Point(0, 0);

      DrawHelper.colorScaleCount = 32;

      DrawHelper.colorScale = [];

      DrawHelper.muString = "u";

      DrawHelper.ohmString = "ohm";

      EPSILON = 0.48;

      DrawHelper.initializeColorScale = function() {
        var i, n1, n2, voltage, _i, _ref, _results;
        this.colorScale = new Array(this.colorScaleCount);
        _results = [];
        for (i = _i = 0, _ref = this.colorScaleCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          voltage = i * 2 / this.colorScaleCount - 1;
          if (voltage < 0) {
            n1 = Math.floor((128 * -voltage) + 127);
            n2 = Math.floor(127 * (1 + voltage));
            _results.push(this.colorScale[i] = new Color(n1, n2, n2));
          } else {
            n1 = Math.floor((128 * voltage) + 127);
            n2 = Math.floor(127 * (1 - voltage));
            _results.push(this.colorScale[i] = new Color(n2, n1, n2));
          }
        }
        return _results;
      };

      DrawHelper.scale = ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737", "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777", "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"];

      DrawHelper.unitsFont = "Arial, Helvetica, sans-serif";

      DrawHelper.interpPoint = function(ptA, ptB, f, g) {
        var gx, gy, ptOut;
        if (g == null) {
          g = 0;
        }
        gx = ptB.y - ptA.y;
        gy = ptA.x - ptB.x;
        g /= Math.sqrt(gx * gx + gy * gy);
        ptOut = new Point();
        ptOut.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) + g * gx + EPSILON);
        ptOut.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) + g * gy + EPSILON);
        return ptOut;
      };

      DrawHelper.interpPoint2 = function(ptA, ptB, f, g) {
        var gx, gy, ptOut1, ptOut2;
        gx = ptB.y - ptA.y;
        gy = ptA.x - ptB.x;
        g /= Math.sqrt(gx * gx + gy * gy);
        ptOut1 = new Point();
        ptOut2 = new Point();
        ptOut1.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) + g * gx + EPSILON);
        ptOut1.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) + g * gy + EPSILON);
        ptOut2.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) - g * gx + EPSILON);
        ptOut2.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) - g * gy + EPSILON);
        return [ptOut1, ptOut2];
      };

      DrawHelper.calcArrow = function(point1, point2, al, aw) {
        var dist, dx, dy, p1, p2, poly, _ref;
        poly = new Polygon();
        dx = point2.x - point1.x;
        dy = point2.y - point1.y;
        dist = Math.sqrt(dx * dx + dy * dy);
        poly.addVertex(point2.x, point2.y);
        _ref = this.interpPoint2(point1, point2, 1 - al / dist, aw), p1 = _ref[0], p2 = _ref[1];
        poly.addVertex(p1.x, p1.y);
        poly.addVertex(p2.x, p2.y);
        return poly;
      };

      DrawHelper.createPolygon = function(pt1, pt2, pt3, pt4) {
        var newPoly;
        newPoly = new Polygon();
        newPoly.addVertex(pt1.x, pt1.y);
        newPoly.addVertex(pt2.x, pt2.y);
        newPoly.addVertex(pt3.x, pt3.y);
        if (pt4) {
          newPoly.addVertex(pt4.x, pt4.y);
        }
        return newPoly;
      };

      DrawHelper.createPolygonFromArray = function(vertexArray) {
        var newPoly, vertex, _i, _len;
        newPoly = new Polygon();
        for (_i = 0, _len = vertexArray.length; _i < _len; _i++) {
          vertex = vertexArray[_i];
          newPoly.addVertex(vertex.x, vertex.y);
        }
        return newPoly;
      };

      DrawHelper.drawCoil = function(hs, point1, point2, vStart, vEnd, renderContext) {
        var color, cx, hsx, i, segments, voltageLevel, _i, _results;
        segments = 40;
        this.ps1.x = point1.x;
        this.ps1.y = point1.y;
        _results = [];
        for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
          cx = (((i + 1) * 8 / segments) % 2) - 1;
          hsx = Math.sqrt(1 - cx * cx);
          this.ps2 = this.interpPoint(point1, point2, i / segments, hsx * hs);
          voltageLevel = vStart + (vEnd - vStart) * i / segments;
          color = this.getVoltageColor(voltageLevel);
          renderContext.drawThickLinePt(this.ps1, this.ps2, color);
          this.ps1.x = this.ps2.x;
          _results.push(this.ps1.y = this.ps2.y);
        }
        return _results;
      };

      DrawHelper.getShortUnitText = function(value, unit) {
        return this.getUnitText(value, unit, 1);
      };

      DrawHelper.getUnitText = function(value, unit, decimalPoints) {
        var absValue;
        if (decimalPoints == null) {
          decimalPoints = 2;
        }
        absValue = Math.abs(value);
        if (absValue < 1e-18) {
          return "0 " + unit;
        }
        if (absValue < 1e-12) {
          return (value * 1e15).toFixed(decimalPoints) + " f" + unit;
        }
        if (absValue < 1e-9) {
          return (value * 1e12).toFixed(decimalPoints) + " p" + unit;
        }
        if (absValue < 1e-6) {
          return (value * 1e9).toFixed(decimalPoints) + " n" + unit;
        }
        if (absValue < 1e-3) {
          return (value * 1e6).toFixed(decimalPoints) + " " + this.muString + unit;
        }
        if (absValue < 1) {
          return (value * 1e3).toFixed(decimalPoints) + " m" + unit;
        }
        if (absValue < 1e3) {
          return value.toFixed(decimalPoints) + " " + unit;
        }
        if (absValue < 1e6) {
          return (value * 1e-3).toFixed(decimalPoints) + " k" + unit;
        }
        if (absValue < 1e9) {
          return (value * 1e-6).toFixed(decimalPoints) + " M" + unit;
        }
        return (value * 1e-9).toFixed(decimalPoints) + " G" + unit;
      };

      DrawHelper.getVoltageDText = function(v) {
        return this.getUnitText(Math.abs(v), "V");
      };

      DrawHelper.getVoltageText = function(v) {
        return this.getUnitText(v, "V");
      };

      DrawHelper.getCurrentText = function(value) {
        return this.getUnitText(value, "A");
      };

      DrawHelper.getCurrentDText = function(value) {
        return this.getUnitText(Math.abs(value), "A");
      };

      DrawHelper.getVoltageColor = function(volts, fullScaleVRange) {
        var value;
        if (fullScaleVRange == null) {
          fullScaleVRange = 10;
        }
        value = Math.floor((volts + fullScaleVRange) * (this.colorScaleCount - 1) / (2 * fullScaleVRange));
        if (value < 0) {
          value = 0;
        } else if (value >= this.colorScaleCount) {
          value = this.colorScaleCount - 1;
        }
        return this.scale[value];
      };

      DrawHelper.getPowerColor = function(power, scaleFactor) {
        var b, powerLevel, rg;
        if (scaleFactor == null) {
          scaleFactor = 1;
        }
        if (!Settings.powerCheckItem) {
          return;
        }
        powerLevel = power * scaleFactor;
        power = Math.abs(powerLevel);
        if (power > 1) {
          power = 1;
        }
        rg = 128 + Math.floor(power * 127);
        return b = Math.floor(128 * (1 - power));
      };

      return DrawHelper;

    })();
    return DrawHelper;
  });

}).call(this);
