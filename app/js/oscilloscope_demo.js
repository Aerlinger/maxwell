var RenderControls = function(args) {

  var $ = jQuery;

  this.initialize = function() {

    this.element = args.element;
    this.graph = args.graph;
    this.settings = this.serialize();

    this.inputs = {
      renderer: this.element.elements.renderer,
      interpolation: this.element.elements.interpolation,
      offset: this.element.elements.offset
    };

    this.element.addEventListener('change', function(e) {

      this.settings = this.serialize();

      if (e.target.name == 'renderer') {
        this.setDefaultOffset(e.target.value);
      }

      this.syncOptions();
      this.settings = this.serialize();

      var config = {
        renderer: this.settings.renderer,
        interpolation: this.settings.interpolation
      };

      if (this.settings.offset == 'value') {
        config.unstack = true;
        config.offset = 'zero';
      } else if (this.settings.offset == 'expand') {
        config.unstack = false;
        config.offset = this.settings.offset;
      } else {
        config.unstack = false;
        config.offset = this.settings.offset;
      }

      this.graph.configure(config);
      this.graph.render();

    }.bind(this), false);
  };

  this.serialize = function() {

    var values = {};
    var pairs = $(this.element).serializeArray();

    pairs.forEach( function(pair) {
      values[pair.name] = pair.value;
    } );

    return values;
  };

  this.syncOptions = function() {

    var options = this.rendererOptions[this.settings.renderer];

    Array.prototype.forEach.call(this.inputs.interpolation, function(input) {

      if (options.interpolation) {
        input.disabled = false;
        input.parentNode.classList.remove('disabled');
      } else {
        input.disabled = true;
        input.parentNode.classList.add('disabled');
      }
    });

    Array.prototype.forEach.call(this.inputs.offset, function(input) {

      if (options.offset.filter( function(o) { return o == input.value } ).length) {
        input.disabled = false;
        input.parentNode.classList.remove('disabled');

      } else {
        input.disabled = true;
        input.parentNode.classList.add('disabled');
      }

    }.bind(this));

  };

  this.setDefaultOffset = function(renderer) {

    var options = this.rendererOptions[renderer];

    if (options.defaults && options.defaults.offset) {

      Array.prototype.forEach.call(this.inputs.offset, function(input) {
        if (input.value == options.defaults.offset) {
          input.checked = true;
        } else {
          input.checked = false;
        }

      }.bind(this));
    }
  };

  this.rendererOptions = {

    area: {
      interpolation: true,
      offset: ['zero', 'wiggle', 'expand', 'value'],
      defaults: { offset: 'zero' }
    },
    line: {
      interpolation: true,
      offset: ['expand', 'value'],
      defaults: { offset: 'value' }
    },
    bar: {
      interpolation: false,
      offset: ['zero', 'wiggle', 'expand', 'value'],
      defaults: { offset: 'zero' }
    },
    scatterplot: {
      interpolation: false,
      offset: ['value'],
      defaults: { offset: 'value' }
    }
  };

  this.initialize();
};

var OScope = function (timeInterval) {
  this.addData = function (data, value) {
    var amplitude = Math.cos(timeBase / 50);
    var index = data[0].length;

    data.forEach(function (series) {
      series.push({x: (index * timeInterval) + timeBase, y: value + amplitude});
    });
  };

  this.removeData = function (data) {
    data.forEach(function (series) {
      series.shift();
    });
    timeBase += timeInterval;
  };

  this.seriesData = [[], [], [], [], [], [], [], [], []];
  this.timeInterval = timeInterval || 1;

  var timeBase = Math.floor(new Date().getTime() / 1000);

  for (var i = 0; i < 150; i++) {
    this.addData(this.seriesData, 1);
  }

  var palette = new Rickshaw.Color.Palette({scheme: 'classic9'});
  graph.render();

  var hoverDetail = new Rickshaw.Graph.HoverDetail({
    graph: graph,
    xFormatter: function (x) {
      return new Date(x * 1000).toString();
    }
  });

  var legend = new Rickshaw.Graph.Legend({
    graph: graph,
    element: document.getElementById('legend')
  });

  var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
    graph: graph,
    legend: legend
  });

  var order = new Rickshaw.Graph.Behavior.Series.Order({
    graph: graph,
    legend: legend
  });

  var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
    graph: graph,
    legend: legend
  });

  var ticksTreatment = 'glow';

  var xAxis = new Rickshaw.Graph.Axis.Time({
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

  new RenderControls({
    element: document.querySelector('form'),
    graph: graph
  });

  _scope = this;
  _seriesData = this.seriesData;
  setInterval(function () {
    _scope.removeData(_seriesData, 1);
    _scope.addData(_seriesData, 1);
    graph.update();

  }, 50);

  function addAnnotation(force) {
    if (messages.length > 0 && (force || Math.random() >= 0.95)) {
      annotator.add(scope.seriesData[2][seriesData[2].length - 1].x, messages.shift());
      annotator.update();
    }
  }

  addAnnotation(true);
  setTimeout(function () {
    setInterval(addAnnotation, 1000)
  }, 1000);

  var previewXAxis = new Rickshaw.Graph.Axis.Time({
    //graph: preview.previews[0],
    timeFixture: new Rickshaw.Fixtures.Time.Local(),
    ticksTreatment: ticksTreatment
  });

  previewXAxis.render();
};

var scope = new OScope(10);
