(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['cs!util/Observer', 'cs!core/Circuit', 'cs!component/CircuitComponent', 'cs!util/FormatUtils', 'cs!settings/Settings', 'cs!geom/Rectangle'], function(Observer, Circuit, CircuitComponent, FormatUtils, Settings, Rectangle) {
    var CircuitCanvas, SelectionMarquee;
    SelectionMarquee = (function(_super) {
      __extends(SelectionMarquee, _super);

      function SelectionMarquee(x1, y1) {
        this.x1 = x1;
        this.y1 = y1;
      }

      SelectionMarquee.prototype.reposition = function(x, y) {
        var _x1, _x2, _y1, _y2;
        _x1 = Math.min(x, this.x1);
        _x2 = Math.max(x, this.x1);
        _y1 = Math.min(y, this.y1);
        _y2 = Math.max(y, this.y1);
        this.x2 = _x2;
        this.y2 = _y2;
        this.x = this.x1 = _x1;
        this.y = this.y1 = _y1;
        this.width = _x2 - _x1;
        return this.height = _y2 - _y1;
      };

      SelectionMarquee.prototype.draw = function(renderContext) {
        renderContext.lineWidth = 0.1;
        if ((this.x1 != null) && (this.x2 != null) && (this.y1 != null) && (this.y2 != null)) {
          renderContext.drawThickLine(this.x1, this.y1, this.x2, this.y1);
          renderContext.drawThickLine(this.x1, this.y2, this.x2, this.y2);
          renderContext.drawThickLine(this.x1, this.y1, this.x1, this.y2);
          return renderContext.drawThickLine(this.x2, this.y1, this.x2, this.y2);
        }
      };

      return SelectionMarquee;

    })(Rectangle);
    CircuitCanvas = (function(_super) {
      __extends(CircuitCanvas, _super);

      function CircuitCanvas(Circuit, Canvas) {
        this.Circuit = Circuit;
        this.Canvas = Canvas;
        this.draw = __bind(this.draw, this);
        this.mouseup = __bind(this.mouseup, this);
        this.mousedown = __bind(this.mousedown, this);
        this.mousemove = __bind(this.mousemove, this);
        this.focusedComponent = null;
        this.dragComponent = null;
        this.width = this.Canvas.width;
        this.height = this.Canvas.height;
        this.context = Sketch.augment(this.Canvas.getContext("2d"), {
          draw: this.draw,
          mousemove: this.mousemove,
          mousedown: this.mousedown,
          mouseup: this.mouseup
        });
        this.Circuit.addObserver(Circuit.ON_END_UPDATE, this.clear);
      }

      CircuitCanvas.prototype.mousemove = function(event) {
        var component, x, y, _i, _len, _ref, _ref1, _results;
        x = event.offsetX;
        y = event.offsetY;
        this.snapX = this.snapGrid(x);
        this.snapY = this.snapGrid(y);
        if (this.marquee != null) {
          return (_ref = this.marquee) != null ? _ref.reposition(x, y) : void 0;
        } else {
          _ref1 = this.Circuit.getElements();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            component = _ref1[_i];
            if (component.getBoundingBox().contains(x, y)) {
              this.focusedComponent = component;
              _results.push(this.focusedComponent.focused = true);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      };

      CircuitCanvas.prototype.mousedown = function(event) {
        var component, x, y, _i, _len, _ref, _results;
        x = event.offsetX;
        y = event.offsetY;
        this.marquee = new SelectionMarquee(x, y);
        _ref = this.Circuit.getElements();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          component = _ref[_i];
          if (component.getBoundingBox().contains(x, y)) {
            this.dragComponent = component;
            component.beingDragged(true);
            this.focusedComponent = component;
            this.focusedComponent.focused = true;
            if (this.dragComponent.toggle != null) {
              _results.push(this.dragComponent.toggle());
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      CircuitCanvas.prototype.mouseup = function(event) {
        var _ref;
        if ((_ref = this.dragComponent) != null) {
          _ref.beingDragged(false);
        }
        this.dragComponent = null;
        return this.marquee = null;
      };

      CircuitCanvas.prototype.draw = function() {
        var _ref;
        if ((this.snapX != null) && (this.snapY != null)) {
          this.drawCircle(this.snapX, this.snapY, 3, "#F00");
        }
        this.infoText();
        if ((_ref = this.marquee) != null) {
          _ref.draw(this);
        }
        this.Circuit.updateCircuit();
        return this.drawComponents();
      };

      CircuitCanvas.prototype.infoText = function() {
        var arr, idx, _i, _ref, _results;
        if (this.focusedComponent != null) {
          arr = [];
          this.focusedComponent.getInfo(arr);
          _results = [];
          for (idx = _i = 0, _ref = arr.length; 0 <= _ref ? _i < _ref : _i > _ref; idx = 0 <= _ref ? ++_i : --_i) {
            _results.push(this.context.fillText(arr[idx], 500, idx * 10 + 15));
          }
          return _results;
        }
      };

      CircuitCanvas.prototype.drawComponents = function() {
        var component, _i, _len, _ref, _ref1, _results;
        this.clear();
        if (this.context) {
          _ref = this.Circuit.getElements();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            component = _ref[_i];
            if ((_ref1 = this.marquee) != null ? _ref1.collidesWithComponent(component) : void 0) {
              component.focused = true;
              console.log("COLLIDE: " + component.dump());
            }
            _results.push(this.drawComponent(component));
          }
          return _results;
        }
      };

      CircuitCanvas.prototype.snapGrid = function(x) {
        return (x + (Settings.GRID_SIZE / 2 - 1)) & ~(Settings.GRID_SIZE - 1);
      };

      CircuitCanvas.prototype.drawComponent = function(component) {
        if (component.isSelected()) {
          this.context.strokeStyle = "#FF0";
        }
        return component.draw(this);
      };

      CircuitCanvas.prototype.getCircuitBottom = function() {
        var circuitBottom;
        circuitBottom = -100000000;
        this.Circuit.eachComponent(function(component) {
          var bottom, rect;
          rect = component.boundingBox;
          bottom = rect.height + rect.y;
          if (bottom > circuitBottom) {
            return circuitBottom = bottom;
          }
        });
        return circuitBottom;
      };

      CircuitCanvas.prototype.drawInfo = function() {
        var bottomTextOffset, ybase;
        bottomTextOffset = 100;
        ybase = this.getCircuitBottom() - (1 * 15) - bottomTextOffset;
        this.context.fillText("t = " + (FormatUtils.longFormat(this.Circuit.time)) + " s", 10, 10);
        return this.context.fillText("F.T. = " + this.Circuit.frames, 10, 20);
      };

      CircuitCanvas.prototype.drawWarning = function(context) {
        var msg, warning, _i, _len;
        msg = "";
        for (_i = 0, _len = warningStack.length; _i < _len; _i++) {
          warning = warningStack[_i];
          msg += warning + "\n";
        }
        return console.error("Simulation Warning: " + msg);
      };

      CircuitCanvas.prototype.drawError = function(context) {
        var error, msg, _i, _len;
        msg = "";
        for (_i = 0, _len = errorStack.length; _i < _len; _i++) {
          error = errorStack[_i];
          msg += error + "\n";
        }
        return console.error("Simulation Error: " + msg);
      };

      CircuitCanvas.prototype.fillText = function(text, x, y) {
        return this.context.fillText(text, x, y);
      };

      CircuitCanvas.prototype.fillCircle = function(x, y, radius, lineWidth, fillColor, lineColor) {
        var origLineWidth, origStrokeStyle;
        if (lineWidth == null) {
          lineWidth = Settings.LINE_WIDTH;
        }
        if (fillColor == null) {
          fillColor = '#FF0000';
        }
        if (lineColor == null) {
          lineColor = "#000000";
        }
        origLineWidth = this.context.lineWidth;
        origStrokeStyle = this.context.strokeStyle;
        this.context.fillStyle = fillColor;
        this.context.strokeStyle = lineColor;
        this.context.beginPath();
        this.context.lineWidth = lineWidth;
        this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
        this.context.strokeStyle = origStrokeStyle;
        return this.context.lineWidth = origLineWidth;
      };

      CircuitCanvas.prototype.drawCircle = function(x, y, radius, lineWidth, lineColor) {
        var origLineWidth, origStrokeStyle;
        if (lineWidth == null) {
          lineWidth = Settings.LINE_WIDTH;
        }
        if (lineColor == null) {
          lineColor = "#000000";
        }
        origLineWidth = this.context.lineWidth;
        origStrokeStyle = this.context.strokeStyle;
        this.context.strokeStyle = lineColor;
        this.context.beginPath();
        this.context.lineWidth = lineWidth;
        this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.context.stroke();
        this.context.closePath();
        this.context.lineWidth = origLineWidth;
        return this.context.strokeStyle = origStrokeStyle;
      };

      CircuitCanvas.prototype.drawThickLinePt = function(pa, pb, color) {
        return this.drawThickLine(pa.x, pa.y, pb.x, pb.y, color);
      };

      CircuitCanvas.prototype.drawThickLine = function(x, y, x2, y2, color) {
        var origLineWidth, origStrokeStyle;
        if (color == null) {
          color = Settings.FG_COLOR;
        }
        origLineWidth = this.context.lineWidth;
        origStrokeStyle = this.context.strokeStyle;
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        this.context.closePath();
        this.context.lineWidth = origLineWidth;
        return this.context.strokeStyle = origStrokeStyle;
      };

      CircuitCanvas.prototype.drawThickPolygon = function(xlist, ylist, color) {
        var i, _i, _ref;
        for (i = _i = 0, _ref = xlist.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.drawThickLine(xlist[i], ylist[i], xlist[i + 1], ylist[i + 1], color);
        }
        return this.drawThickLine(xlist[i], ylist[i], xlist[0], ylist[0], color);
      };

      CircuitCanvas.prototype.drawThickPolygonP = function(polygon, color) {
        var i, numVertices, _i, _ref;
        numVertices = polygon.numPoints();
        for (i = _i = 0, _ref = numVertices - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.drawThickLine(polygon.getX(i), polygon.getY(i), polygon.getX(i + 1), polygon.getY(i + 1), color);
        }
        return this.drawThickLine(polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color);
      };

      CircuitCanvas.prototype.clear = function() {};

      return CircuitCanvas;

    })(Observer);
    return CircuitCanvas;
  });

}).call(this);
