'use strict';

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const config = require('../config/slipcast');
const { join } = require('path');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');

module.exports = function(file) {
  const rollupConfig = {
    entry: join(config.folders.javascript, file),
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true
      }),

      commonjs({
        include: 'node_modules/**'
      }),

      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [require.resolve('babel-preset-es2015-rollup')]
      })
    ]
  };

  if (process.env.NODE_ENV === 'production') {
    rollupConfig.plugins.push(uglify());
  }

  return rollupConfig;
}
