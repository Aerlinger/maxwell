(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent', 'cs!component/components/SwitchElm'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, SwitchElm) {

    /*
    Todo: Click functionality does not work
     */
    var Switch2Elm;
    Switch2Elm = (function(_super) {
      __extends(Switch2Elm, _super);

      Switch2Elm.FLAG_CENTER_OFF = 1;

      function Switch2Elm(xa, ya, xb, yb, f, st) {
        Switch2Elm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.openhs = 16;
        this.noDiagonal = true;
        if (st) {
          this.link = parseInt(st[st.length - 1]);
        }
      }

      Switch2Elm.prototype.getDumpType = function() {
        return "S";
      };

      Switch2Elm.prototype.dump = function() {
        return Switch2Elm.__super__.dump.call(this) + this.link;
      };

      Switch2Elm.prototype.setPoints = function() {
        var _ref, _ref1, _ref2;
        Switch2Elm.__super__.setPoints.call(this);
        this.calcLeads(32);
        this.swpoles = CircuitComponent.newPointArray(3);
        this.swposts = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.lead1, this.lead2, 1, this.openhs), this.swpoles[0] = _ref[0], this.swpoles[1] = _ref[1];
        this.swpoles[2] = this.lead2;
        _ref1 = DrawHelper.interpPoint2(this.point1, this.point2, 1, this.openhs), this.swposts[0] = _ref1[0], this.swposts[1] = _ref1[1];
        return this.posCount = (_ref2 = this.hasCenterOff()) != null ? _ref2 : {
          3: 2
        };
      };

      Switch2Elm.prototype.draw = function(renderContext) {
        var color;
        this.setBbox(this.point1, this.point2, this.openhs);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.swpoles[0], this.swposts[0], color);
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.swpoles[1], this.swposts[1], color);
        if (!this.needsHighlight()) {
          color = Settings.SELECT_COLOR;
        }
        renderContext.drawThickLinePt(this.lead1, this.swpoles[this.position], color);
        this.drawDots(this.point1, this.lead1, renderContext);
        if (this.position !== 2) {
          this.drawDots(this.swpoles[this.position], this.swposts[this.position], renderContext);
        }
        return this.drawPosts(renderContext);
      };

      Switch2Elm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.point1;
        } else {
          return this.swposts[n - 1];
        }
      };

      Switch2Elm.prototype.getPostCount = function() {
        return 3;
      };

      Switch2Elm.prototype.calculateCurrent = function() {
        if (this.position === 2) {
          return this.current = 0;
        }
      };

      Switch2Elm.prototype.stamp = function(stamper) {
        if (this.position === 2) {
          return;
        }
        return stamper.stampVoltageSource(this.nodes[0], this.nodes[this.position + 1], this.voltSource, 0);
      };

      Switch2Elm.prototype.getVoltageSourceCount = function() {
        if (this.position === 2) {
          return 0;
        } else {
          return 1;
        }
      };

      Switch2Elm.prototype.toggle = function() {
        var i;
        Switch2Elm.__super__.toggle.call(this);
        if (this.link !== 0) {
          i = 0;
          return getParentCircuit().eachComponent(function(component) {
            var s2;
            if (component instanceof Switch2Elm) {
              s2 = component;
              if (s2.link === this.link) {
                return s2.position = this.position;
              }
            }
          });
        }
      };

      Switch2Elm.prototype.getConnection = function(n1, n2) {
        if (this.position === 2) {
          return false;
        }
        return this.comparePair(n1, n2, 0, 1 + this.position);
      };

      Switch2Elm.prototype.getInfo = function(arr) {
        arr[0] = (this.link === 0 ? "switch (SPDT)" : "switch (DPDT)");
        return arr[1] = "I = " + this.getCurrentDText(this.getCurrent());
      };

      Switch2Elm.prototype.hasCenterOff = function() {
        return (this.flags & Switch2Elm.FLAG_CENTER_OFF) !== 0;
      };

      return Switch2Elm;

    })(SwitchElm);
    return Switch2Elm;
  });

}).call(this);
