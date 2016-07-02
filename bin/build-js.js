#!/usr/bin/env node

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const config = require('../lib/config');
const { join } = require('path');
const nodeResolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');

config.files.filter(file => {
  return file.endsWith('.js');
}).forEach(file => {
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

  rollup.rollup(rollupConfig).then(function(bundle) {
    bundle.write({
      dest: join(config.output, file.replace(/\.js$/, '.es.js')),
      format: 'es',
      sourceMap: true
    });

    bundle.write({
      dest: join(config.output, file.replace(/\.js$/, '.umd.js')),
      format: 'umd',
      sourceMap: true
    });
  }).catch(function(error) {
    console.error(error);
  });
});
