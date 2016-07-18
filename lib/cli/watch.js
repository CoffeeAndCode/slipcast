const { spawn } = require('child_process');
const { writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const { join } = require('path');
const rimraf = require('rimraf');

module.exports = function() {
  const config = require('../config');
  const procfileTemplate = require('./templates/Procfile');

  rimraf.sync(join(process.cwd(), config.output));
  mkdirp.sync(join(process.cwd(), config.output));

  writeFileSync('Procfile', procfileTemplate);

  spawn(require.resolve('foreman/nf'), ['start'], { stdio: 'inherit' });
}
