import config from './config';
import uglify from 'rollup-plugin-uglify';

config.format = 'umd';
config.dest = 'dist/app.frontend.umd.js';
config.moduleName = 'darby';

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(uglify());
}

export default config;
