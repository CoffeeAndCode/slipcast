const { spawn, spawnSync } = require('child_process');
const { join } = require('path');
const rimraf = require('rimraf');

module.exports = function() {
  const config = require('../config');
  const outputFolder = join(process.cwd(), config.output);

  rimraf.sync(outputFolder);

  spawnSync('cp', ['-R', join(process.cwd(), config.folders.static, '/'), outputFolder], { stdio: 'inherit' });
  spawn(join(__dirname, '../../scripts/build-css.js'), { stdio: 'inherit' });
  spawn(join(__dirname, '../../scripts/build-html.js'), { stdio: 'inherit' });
  spawn(join(__dirname, '../../scripts/build-js.js'), { stdio: 'inherit' });
}
