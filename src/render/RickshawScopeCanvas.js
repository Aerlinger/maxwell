let ScopeCanvas = require("./ScopeCanvas.js");

class RickshawScopeCanvas extends ScopeCanvas {
  constructor(parentUI, parentScope, contextElement, x=800, y=700) {
    super(parentUI, parentScope, contextElement, x, y);

    this.graph = new Rickshaw.Graph({
      element: contextElement,
      width: contextElement.offsetWidth,
      height: contextElement.offsetHeight,
      interpolation: 'linear',
      renderer: 'line',
      stroke: false,
      strokeWidth: 1,
      min: 'auto',
      series: [
        {
          color: "#F00",
          strokeWidth: 1,
          data: [],
          name: 'Voltage'
        },
        {
          color: "#00F",
          strokeWidth: 1,
          data: [],
          name: 'Current'
        }
      ]
    });

    var ticksTreatment = 'glow';

    this.xAxis = new Rickshaw.Graph.Axis.X({
      graph: this.graph,
      ticksTreatment: ticksTreatment,
      timeFixture: new Rickshaw.Fixtures.Time.Local()
    });

    this.xAxis.render();

    new Rickshaw.Graph.Axis.Y({
      graph: this.graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      ticksTreatment: ticksTreatment
    });


    new Rickshaw.Graph.Axis.Y({
      orientation: "right",
      graph: this.graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      ticksTreatment: ticksTreatment
    });

    this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
      graph: this.graph,
      // legend: legend
    });

    this.hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: this.graph,
      xFormatter: function (x) {
        return x + "s";

      }
    });

    this.resize(contextElement.offsetWidth, contextElement.offsetHeight);

    /*
    for (var i=0 ; i<this.dataPoints; ++i) {
      this.graph.series[0].data.push({x: 0, y: 0});
    }
    */

    this.graph.update();

    this.graph.render();
  }

  x() {
    return this.frame.offsetLeft - this.parentUI.xMargin;
  }

  y() {
    return this.frame.offsetTop - this.parentUI.yMargin;
  }

  height() {
    return this.frame.offsetHeight;
  }

  width() {
    return this.frame.offsetWidth;
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

    this.graph.update();
  };

  addCurrent(time, value) {
    this.graph.series[1].data.push({x: time, y: value});

    if (this.graph.series[1].data.length > this.dataPoints) {
      this.graph.series[1].data.shift();
    }

    this.graph.update();
  };

}

module.exports = RickshawScopeCanvas;
