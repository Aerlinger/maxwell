let CanvasRenderStrategy = require('./CanvasRenderStrategy');
let SvgRenderStrategy = require('./SvgRenderStrategy');

// TODO: move this to a config variable
let strategy = 'canvas';

module.exports = (strategy == 'canvas') ? CanvasRenderStrategy : SvgRenderStrategy;
