'use strict';

const config = require('./slipcast');
const { join } = require('path');

module.exports = Object.assign({
  files: [
    join(config.output, '**', '*.{css,jpg,js,png,svg}'),
    join(config.folders.static, '**', '*'),
  ],
  open: false,
  reloadDebounce: 10,
  server: [config.output, config.folders.static],
}, config.watch.browsersync);
