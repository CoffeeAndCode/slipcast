const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
  entry: 'testBrowser/index.js',
  format: 'umd',
  dest: 'dist/test.umd.js',
  moduleName: 'darbyTests',
  sourceMap: true,
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
      presets: ['es2015-rollup']
    })
  ]
};
