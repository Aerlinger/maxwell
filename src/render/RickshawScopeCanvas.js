let ScopeCanvas = require("./ScopeCanvas.js");
let Util = require("../util/Util.js");

class RickshawScopeCanvas extends ScopeCanvas {
  constructor(parentUI, scopeDiv, x=800, y=700) {
    super(parentUI, scopeDiv, x, y);

    var plotContext = scopeDiv.getElementsByClassName("plot-context")[0];
    var leftAxisDiv = scopeDiv.getElementsByClassName("left-axis")[0];

    this.graph = new Rickshaw.Graph({
      element: plotContext,
      width: plotContext.offsetWidth ,
      height: plotContext.offsetHeight,
      interpolation: 'linear',
      renderer: 'line',
      stroke: false,
      strokeWidth: 1,
      min: 'auto',
      padding: {
        top: 0.08,
        botom: 0.09,
      },
      series: [
        {
          color: "#F00",
          data: [],
          name: 'Voltage'
        },
        {
          color: "#00F",
          data: [],
          name: 'Current'
        }
      ]
    });

    var ticksTreatment = 'glow';

    this.xAxis = new Rickshaw.Graph.Axis.X({
      graph: this.graph,
      //element: leftAxisDiv,
      ticksTreatment: ticksTreatment,
      timeFixture: new Rickshaw.Fixtures.Time.Local(),
      tickFormat: function(d) { return Util.getUnitText(d, "s", 0) }
    });

    //this.xAxis.render();
    new Rickshaw.Graph.Axis.Y({
      graph: this.graph,
      tickFormat: function(d) { return Util.getUnitText(d, "V", 0) },
      pixelsPerTick: 30,
      tickSize: 4,
      tickTransformation: function(svg) {
        svg.style("text-anchor", "end").attr("dx", "-0.8em").attr("dy", "-0.3em").attr("transform", 'rotate(-90)');
      }
    });

    new Rickshaw.Graph.Axis.Y({
      graph: this.graph,
      tickFormat: function(d) { return Util.getUnitText(d, "V", 0) },
      pixelsPerTick: 30,
      tickSize: 4,
      tickTransformation: function(svg) {
        svg.style("text-anchor", "end").attr("dx", "-0.8em").attr("dy", "-0.3em").attr("transform", 'rotate(-90)');
      }
    });

    this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
      graph: this.graph,
      // legend: legend
    });

    new Rickshaw.Graph.HoverDetail({
      graph: this.graph,
      xFormatter: function (x) {
        return x + "s";
      }
    });

    this.resize(plotContext.offsetWidth, plotContext.offsetHeight - 5);
  }

  resize(width, height) {
    this.graph.configure({
      width: width,
      height: height


    });

    this.graph.render();
  }

  addVoltage(time, value) {
    this.graph.series[0].data.push({x: time, y: value});

    if (this.graph.series[0].data.length > this.dataPoints) {
      this.graph.series[0].data.shift();
    }

    // this.graph.update();
  };

  addCurrent(time, value) {
    this.graph.series[1].data.push({x: time, y: value});

    if (this.graph.series[1].data.length > this.dataPoints) {
      this.graph.series[1].data.shift();
    }

    //this.graph.update();
  };

  redraw() {
    this.graph.update();
  }
}

module.exports = RickshawScopeCanvas;
