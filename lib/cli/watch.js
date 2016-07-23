const { spawn } = require('child_process');
const { mkdtempSync, writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const { tmpdir } = require('os');
const { dirname, join } = require('path');
const rimraf = require('rimraf');

module.exports = function() {
  const config = require('../config');
  const procfileTemplate = require('./templates/Procfile');

  rimraf.sync(join(process.cwd(), config.output));
  mkdirp.sync(join(process.cwd(), config.output));

  const procfilePath = join(mkdtempSync(join(tmpdir(), 'slipcast-')), 'Procfile');
  console.log(procfilePath);
  writeFileSync(procfilePath, procfileTemplate);

  spawn(require.resolve('foreman/nf'), ['start', '--procfile', procfilePath], { stdio: 'inherit' });
  process.addListener('exit', function() {
    rimraf.sync(dirname(procfilePath));
  });
  // This listener is required or our `exit` listener will never run.
  process.addListener('SIGINT', () => null);
}
