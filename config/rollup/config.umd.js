const config = require('./config');
const uglify = require('rollup-plugin-uglify');

config.format = 'umd';
config.dest = 'dist/app.umd.js';
config.moduleName = 'darby';

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(uglify());
}

module.exports = config;
