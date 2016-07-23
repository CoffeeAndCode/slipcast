const { spawn, spawnSync } = require('child_process');
const { join } = require('path');
const rimraf = require('rimraf');

module.exports = function() {
  const config = require('../config/slipcast');
  const outputFolder = join(process.cwd(), config.output);

  rimraf.sync(outputFolder);

  spawnSync('cp', ['-R', join(process.cwd(), config.folders.static, '/'), outputFolder], { stdio: 'inherit' });
  spawn('node', [join(__dirname, './build/css.js')], { stdio: 'inherit' });
  spawn('node', [join(__dirname, './build/html.js')], { stdio: 'inherit' });
  spawn('node', [join(__dirname, './build/js.js')], { stdio: 'inherit' });
}
