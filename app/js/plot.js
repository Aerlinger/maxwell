function Plotter(canvasElm) {
  // set up our data series with 150 random data points

  this.seriesData = new Rickshaw.Series.FixedDuration([{name: 'one'}], undefined, {
    timeInterval: 20,
    maxDataPoints: 300,
    timeBase: 0
  });

  var palette = new Rickshaw.Color.Palette({scheme: 'classic9'});

  var graph = new Rickshaw.Graph({
    element: document.getElementById(canvasElm),
    width: 300,
    height: 200,
    interpolation: 'linear',
    renderer: 'line',
    stroke: true,
    min: 'auto',
    series: this.seriesData
  });

  this.addData = function(value) {
    graph.series.addData({ one: value });

    graph.update();
  };

  graph.render();

  var preview = new Rickshaw.Graph.RangeSlider({
    graph: graph,
    element: document.getElementById('preview')
  });

  var annotator = new Rickshaw.Graph.Annotate({
    graph: graph,
    element: document.getElementById('timeline')
  });

  /*
  var legend = new Rickshaw.Graph.Legend({
    graph: graph,
    element: document.getElementById('legend')
  });
  */

  var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
    graph: graph,
    // legend: legend
  });

  var hoverDetail = new Rickshaw.Graph.HoverDetail({
    graph: graph,
    xFormatter: function (x) {
      return new Date(x * 1000).toString();
    }
  });

  var smoother = new Rickshaw.Graph.Smoother({
    graph: graph,
    element: document.querySelector('#smoother')
  });

  var ticksTreatment = 'glow';

  var xAxis = new Rickshaw.Graph.Axis.X({
    graph: graph,
    ticksTreatment: ticksTreatment,
    timeFixture: new Rickshaw.Fixtures.Time.Local()
  });

  xAxis.render();

  var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: graph,
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    ticksTreatment: ticksTreatment
  });

  yAxis.render();

  /*
   var controls = new RenderControls({
   element: document.querySelector('form'),
   graph: graph
   });*/

  // add some data every so often

  var messages = [
    "Changed home page welcome message",
    "Minified JS and CSS",
    "Changed button color from blue to green",
    "Refactored SQL query to use indexed columns",
    "Added additional logging for debugging",
    "Fixed typo",
    "Rewrite conditional logic for clarity",
    "Added documentation for new methods"
  ];

  //setInterval(function () {
  //  random.removeData(seriesData);
  //  random.addData(seriesData);
  //  graph.update();
  //
  //}, 50);
  //
  function addAnnotation(force) {
    if (messages.length > 0 && (force || Math.random() >= 0.95)) {
      annotator.add(this.seriesData[0][this.seriesData[0].length - 1].x, messages.shift());
      annotator.update();
    }
  }

  /*
  addAnnotation(true);
  setTimeout(function () {
    setInterval(addAnnotation, 6000)
  }, 6000);
  */

};
