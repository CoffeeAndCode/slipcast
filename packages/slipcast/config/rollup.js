'use strict';

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const config = require('./slipcast');
const { join } = require('path');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');

module.exports = (file) => {
  const commonjsPluginConfig = {
    include: 'node_modules/**',
  };

  if (config.rollup && config.rollup.commonjs) {
    Object.assign(commonjsPluginConfig, config.rollup.commonjs);
  }

  const rollupConfig = {
    entry: join(config.folders.javascript, file),
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true,
      }),

      commonjs(commonjsPluginConfig),

      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        plugins: [
          require.resolve('babel-plugin-external-helpers'),
          require.resolve('babel-plugin-transform-object-rest-spread'),
        ],
        presets: [
          [require.resolve('babel-preset-es2015'), {
            modules: false,
          }],
        ],
      }),
    ],
  };

  if (process.env.NODE_ENV === 'production') {
    rollupConfig.plugins.push(uglify());
  }

  return rollupConfig;
};
