'use strict';

const config = require('./slipcast');
const { join } = require('path');

module.exports = Object.assign({
  files: [
    join(config.output, '**', '*.{css,jpg,js,png,svg}'),
    join(config.folders.static, '**', '*'),
  ],
  open: false,
  server: [config.output, config.folders.static],
}, config.watch.browsersync);
