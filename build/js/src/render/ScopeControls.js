(function() {
  define(['jquery', 'Rickshaw'], function($, Rickshaw) {
    var ScopeControls;
    ScopeControls = (function() {
      function ScopeControls(graph) {
        var chartDiv, highlighter, legend, legendDiv, order, shelving, ticksTreatment, timelineDiv, xAxis, yAxis;
        this.graph = graph;
        this.element = document.querySelector("form");
        chartDiv = document.getElementById("chart");
        legendDiv = document.getElementById("legend");
        timelineDiv = document.getElementById("timeline");
        this.settings = this.serialize();
        this.inputs = {
          renderer: this.element.elements.renderer,
          interpolation: this.element.elements.interpolation,
          offset: this.element.elements.offset
        };
        new Rickshaw.Graph.HoverDetail({
          graph: this.graph,
          xFormatter: function(x) {
            return x.toString();
          }
        });
        legend = new Rickshaw.Graph.Legend({
          graph: this.graph,
          element: legendDiv
        });
        shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
          graph: this.graph,
          legend: legend
        });
        order = new Rickshaw.Graph.Behavior.Series.Order({
          graph: this.graph,
          legend: legend
        });
        highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
          graph: this.graph,
          legend: legend
        });
        ticksTreatment = "glow";
        xAxis = new Rickshaw.Graph.Axis.Time({
          graph: this.graph,
          ticksTreatment: ticksTreatment,
          timeFixture: new Rickshaw.Fixtures.Time.Local()
        });
        xAxis.render();
        yAxis = new Rickshaw.Graph.Axis.Y({
          graph: this.graph,
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
          ticksTreatment: ticksTreatment
        });
        yAxis.render();
        this.element.addEventListener("change", ((function(_this) {
          return function(e) {
            var config;
            _this.settings = _this.serialize();
            if (e.target.name === "renderer") {
              _this.setDefaultOffset(e.target.value);
            }
            _this.syncOptions();
            _this.settings = _this.serialize();
            config = {
              renderer: _this.settings.renderer,
              interpolation: _this.settings.interpolation
            };
            if (_this.settings.offset === "value") {
              config.unstack = true;
              config.offset = "zero";
            } else if (_this.settings.offset === "expand") {
              config.unstack = false;
              config.offset = _this.settings.offset;
            } else {
              config.unstack = false;
              config.offset = _this.settings.offset;
            }
            _this.graph.configure(config);
          };
        })(this)), false);
      }

      ScopeControls.prototype.serialize = function() {
        var pairs, values;
        values = {};
        pairs = $(this.element).serializeArray();
        pairs.forEach(function(pair) {
          values[pair.name] = pair.value;
        });
        return values;
      };

      ScopeControls.prototype.syncOptions = function() {
        var options;
        options = this.rendererOptions[this.settings.renderer];
        Array.prototype.forEach.call(this.inputs.interpolation, function(input) {
          if (options.interpolation) {
            input.disabled = false;
            input.parentNode.classList.remove("disabled");
          } else {
            input.disabled = true;
            input.parentNode.classList.add("disabled");
          }
        });
        Array.prototype.forEach.call(this.inputs.offset, (function(input) {
          if (options.offset.filter(function(offset) {
            return offset === input.value;
          }).length) {
            input.disabled = false;
            input.parentNode.classList.remove("disabled");
          } else {
            input.disabled = true;
            input.parentNode.classList.add("disabled");
          }
        }).bind(this));
      };

      ScopeControls.prototype.setDefaultOffset = function(renderer) {
        var options;
        options = this.rendererOptions[renderer];
        if (options.defaults && options.defaults.offset) {
          Array.prototype.forEach.call(this.inputs.offset, (function(_this) {
            return function(input) {
              if (input.value === options.defaults.offset) {
                input.checked = true;
              } else {
                input.checked = false;
              }
            };
          })(this));
        }
      };

      ScopeControls.prototype.rendererOptions = {
        area: {
          interpolation: true,
          offset: ["zero", "wiggle", "expand", "value"],
          defaults: {
            offset: "zero"
          }
        },
        line: {
          interpolation: true,
          offset: ["expand", "value"],
          defaults: {
            offset: "value"
          }
        },
        bar: {
          interpolation: false,
          offset: ["zero", "wiggle", "expand", "value"],
          defaults: {
            offset: "zero"
          }
        },
        scatterplot: {
          interpolation: false,
          offset: ["value"],
          defaults: {
            offset: "value"
          }
        }
      };

      ScopeControls.prototype.initialize = function() {};

      return ScopeControls;

    })();
    return ScopeControls;
  });

}).call(this);
