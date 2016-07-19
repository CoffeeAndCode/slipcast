const { spawn } = require('child_process');
const mkdirp = require('mkdirp');
const { join } = require('path');
const rimraf = require('rimraf');

module.exports = function() {
  const config = require('../config');

  rimraf.sync(join(process.cwd(), config.output));
  mkdirp.sync(join(process.cwd(), config.output));

  spawn(join(__dirname, '../../bin/build-css.js'), { stdio: 'inherit' });
  spawn(join(__dirname, '../../bin/build-html.js'), { stdio: 'inherit' });
  spawn(join(__dirname, '../../bin/build-js.js'), { stdio: 'inherit' });
  spawn(join(__dirname, '../../bin/copy-static.js'), { stdio: 'inherit' });
}
