class ScopeCanvas {
  constructor(contextElement) {
    this.dataPoints = 200;
    this.timeInterval = 20;

    let self = this;

    var voltageData = new Rickshaw.Series.FixedDuration([{name: 'voltage'}], undefined, {
      timeInterval: 20,
      maxDataPoints: this.dataPoints,
      timeBase: 0
    });

    var currentData = new Rickshaw.Series.FixedDuration([{name: 'current'}], undefined, {
      timeInterval: 20,
      maxDataPoints: this.dataPoints,
      timeBase: 0
    });

    this.graph = new Rickshaw.Graph({
      element: contextElement,
      width: contextElement.offsetWidth,
      height: contextElement.offsetHeight,
      interpolation: 'linear',
      renderer: 'line',
      stroke: true,
      min: 'auto',
      series: voltageData
    });

    var ticksTreatment = 'glow';

    this.xAxis = new Rickshaw.Graph.Axis.X({
      graph: this.graph,
      ticksTreatment: ticksTreatment,
      timeFixture: new Rickshaw.Fixtures.Time.Local()
    });

    this.xAxis.render();

    this.yAxis = new Rickshaw.Graph.Axis.Y({
      graph: this.graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      ticksTreatment: ticksTreatment
    });

    this.yAxis.render();

    this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
      graph: this.graph,
      // legend: legend
    });

    this.hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: this.graph,
      xFormatter: function (x) {
        return new Date(x * 1000).toString();
      }
    });

    this.graph.render();
  }

  resize(width, height) {
    this.graph.configure({
      width: width,
      height: height
    })
  }

  addVoltage(value) {
    this.graph.series.addData({voltage: value});

    this.graph.update();
  };

  addCurrent(value) {
    this.graph.series.addData({current: value});

    this.graph.update();
  };

}

module.exports = ScopeCanvas;
