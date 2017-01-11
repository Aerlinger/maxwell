class ScopeControls {
  static initClass() {
  
    this.prototype.rendererOptions = {
      area: {
        interpolation: true,
        offset: [
          "zero",
          "wiggle",
          "expand",
          "value"
        ],
        defaults: {
          offset: "zero"
        }
      },
  
      line: {
        interpolation: true,
        offset: [
          "expand",
          "value"
        ],
        defaults: {
          offset: "value"
        }
      },
  
      bar: {
        interpolation: false,
        offset: [
          "zero",
          "wiggle",
          "expand",
          "value"
        ],
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
  }

  constructor(graph) {
    this.graph = graph;
    this.element = document.querySelector("form");
    let chartDiv = document.getElementById("chart");
    let legendDiv = document.getElementById("legend");
    let timelineDiv = document.getElementById("timeline");

    this.settings = this.serialize();

    this.inputs = {
      renderer: this.element.elements.renderer,
      interpolation: this.element.elements.interpolation,
      offset: this.element.elements.offset
    };

    new Rickshaw.Graph.HoverDetail({
      graph: this.graph,
      xFormatter(x) {
        return x.toString();
      }
    });

    let legend = new Rickshaw.Graph.Legend({
      graph: this.graph,
      element: legendDiv
    });

    let shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: this.graph,
      legend
    });

    let order = new Rickshaw.Graph.Behavior.Series.Order({
      graph: this.graph,
      legend
    });


    //      @annotator = new Rickshaw.Graph.Annotate graph: graph,
    //        element: document.getElementById("timeline")

    let highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
      graph: this.graph,
      legend
    });

    let ticksTreatment = "glow";

    let xAxis = new Rickshaw.Graph.Axis.Time({
      graph: this.graph,
      ticksTreatment,
      timeFixture: new Rickshaw.Fixtures.Time.Local()
    });
    xAxis.render();

    let yAxis = new Rickshaw.Graph.Axis.Y({
      graph: this.graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      ticksTreatment
    });
    yAxis.render();

    this.element.addEventListener("change", (e => {
      this.settings = this.serialize();

      if (e.target.name === "renderer") {
        this.setDefaultOffset(e.target.value);
      }

      this.syncOptions();

      this.settings = this.serialize();

      let config = {
        renderer: this.settings.renderer,
        interpolation: this.settings.interpolation
      };

      if (this.settings.offset === "value") {
        config.unstack = true;
        config.offset = "zero";
      } else if (this.settings.offset === "expand") {
        config.unstack = false;
        config.offset = this.settings.offset;
      } else {
        config.unstack = false;
        config.offset = this.settings.offset;
      }

      this.graph.configure(config);

    }
    ), false);
  }


  serialize() {
    let values = {};
    let pairs = $(this.element).serializeArray();
    pairs.forEach(function(pair) {
      values[pair.name] = pair.value;
    });

    return values;
  }

  syncOptions() {
    let options = this.rendererOptions[this.settings.renderer];

    Array.prototype.forEach.call(this.inputs.interpolation, function(input) {
      if (options.interpolation) {
        input.disabled = false;
        input.parentNode.classList.remove("disabled");
      } else {
        input.disabled = true;
        input.parentNode.classList.add("disabled");
      }
    });

    Array.prototype.forEach.call(this.inputs.offset, (input => {
      if (options.offset.filter(offset => offset === input.value).length) {
        input.disabled = false;
        input.parentNode.classList.remove("disabled");
      } else {
        input.disabled = true;
        input.parentNode.classList.add("disabled");
      }
    })
    );

  }

  setDefaultOffset(renderer) {
    let options = this.rendererOptions[renderer];
    if (options.defaults && options.defaults.offset) {
      Array.prototype.forEach.call(this.inputs.offset, function(input) {
        if (input.value === options.defaults.offset) {
          input.checked = true;
        } else {
          input.checked = false;
        }
      });
    }

  }

  initialize() {
    
  }
}
ScopeControls.initClass();


module.exports = ScopeControls;
