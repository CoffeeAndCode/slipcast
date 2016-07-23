'use strict';

const { statSync } = require('fs');
const { join } = require('path');

let config = {};
try {
  if (statSync(join(process.cwd(), 'slipcast.js')).isFile()) {
    config = require(join(process.cwd(), 'slipcast'));
  }
} catch (exception) {
  // ignore execption if file cannot be found
}

// default values for slipcast config
const defaults = {
  build: {
    html: {
      afterPlugins: [],
      beforePlugins: []
    }
  },
  files: [
    'app.css',
    'app.js'
  ],
  folders: {
    css: 'app/css',
    javascript: 'app/js',
    pages: 'app/pages',
    static: 'app/static',
    views: 'app/views'
  },
  output: 'dist'
};

module.exports = Object.assign(defaults, config);
