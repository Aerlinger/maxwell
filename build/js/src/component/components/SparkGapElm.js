(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var SparkGapElm;
    SparkGapElm = (function(_super) {
      __extends(SparkGapElm, _super);

      function SparkGapElm(xa, ya, xb, yb, f, st) {
        SparkGapElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.resistance = 0;
        this.offresistance = 1e9;
        this.onresistance = 1e3;
        this.breakdown = 1e3;
        this.holdcurrent = 0.001;
        this.state = false;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          if (st) {
            this.onresistance = parseFloat(st != null ? st.shift() : void 0);
          }
          if (st) {
            this.offresistance = parseFloat(st != null ? st.shift() : void 0);
          }
          if (st) {
            this.breakdown = parseFloat(st != null ? st.shift() : void 0);
          }
          if (st) {
            this.holdcurrent = parseFloat(st != null ? st.shift() : void 0);
          }
        }
      }

      SparkGapElm.prototype.nonLinear = function() {
        return true;
      };

      SparkGapElm.prototype.getDumpType = function() {
        return 187;
      };

      SparkGapElm.prototype.dump = function() {
        return "" + (SparkGapElm.__super__.dump.call(this)) + " " + this.onresistance + " " + this.offresistance + " " + this.breakdown + " " + this.holdcurrent;
      };

      SparkGapElm.prototype.setPoints = function() {
        var alen, dist;
        SparkGapElm.__super__.setPoints.call(this);
        dist = 16;
        alen = 8;
        return this.calcLeads(dist + alen);
      };

      SparkGapElm.prototype.calculateCurrent = function() {
        return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
      };

      SparkGapElm.prototype.reset = function() {
        SparkGapElm.__super__.reset.call(this);
        return this.state = false;
      };

      SparkGapElm.prototype.startIteration = function() {
        var vd;
        if (Math.abs(this.current) < this.holdcurrent) {
          this.state = false;
        }
        vd = this.volts[0] - this.volts[1];
        if (Math.abs(vd) > this.breakdown) {
          return this.state = true;
        }
      };

      SparkGapElm.prototype.doStep = function(stamper) {
        if (this.state) {
          console.log("SPARK!");
          this.resistance = this.onresistance;
        } else {
          this.resistance = this.offresistance;
        }
        return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
      };

      SparkGapElm.prototype.toString = function() {
        return "SparkGapElm";
      };

      SparkGapElm.prototype.stamp = function(stamper) {
        stamper.stampNonLinear(this.nodes[0]);
        return stamper.stampNonLinear(this.nodes[1]);
      };

      SparkGapElm.prototype.getInfo = function(arr) {
        arr[0] = "spark gap";
        this.getBasicInfo(arr);
        arr[3] = (this.state ? "on" : "off");
        arr[4] = "Ron = " + DrawHelper.getUnitText(this.onresistance, Circuit.ohmString);
        arr[5] = "Roff = " + DrawHelper.getUnitText(this.offresistance, Circuit.ohmString);
        return arr[6] = "Vbreakdown = " + DrawHelper.getUnitText(this.breakdown, "V");
      };

      SparkGapElm.prototype.needsShortcut = function() {
        return false;
      };

      return SparkGapElm;

    })(CircuitComponent);
    return SparkGapElm;
  });

}).call(this);
