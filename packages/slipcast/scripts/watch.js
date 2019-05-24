'use strict';

const { spawn } = require('child_process');
const config = require('../config/slipcast');
const { mkdtempSync, writeFileSync } = require('fs');
const { emptyDirSync, ensureDir, removeSync } = require('fs-extra');
const { tmpdir } = require('os');
const { dirname, join } = require('path');

function procfileTemplate() {
  return `# Procfile created by Slipcast
css: node ${require.resolve('nodemon/bin/nodemon')} --ext css,scss --watch ${config.folders.css} ${join(__dirname, '../scripts/build/css.js')}
html: node ${require.resolve('nodemon/bin/nodemon')} --ext hbs --watch ${config.folders.pages} --watch ${config.folders.views} ${join(__dirname, '../scripts/build/html.js')}
js: node ${require.resolve('nodemon/bin/nodemon')} --watch ${config.folders.javascript} ${join(__dirname, '../scripts/build/js.js')}
server: node ${require.resolve('browser-sync/dist/bin')} start --config ${join(__dirname, '../config/browsersync.js')}
`;
}

module.exports = () => {
  ensureDir(join(process.cwd(), config.output), (error) => {
    if (error) { throw error; }

    emptyDirSync(join(process.cwd(), config.output));

    const procfilePath = join(mkdtempSync(join(tmpdir(), 'slipcast-')), 'Procfile');
    writeFileSync(procfilePath, procfileTemplate());
    console.error(procfilePath);

    spawn('node', [require.resolve('foreman/nf'), 'start', '--procfile', procfilePath], { stdio: 'inherit' });
    process.addListener('exit', (exitCode) => {
      if (exitCode !== 0) { process.exitCode = exitCode; }
      removeSync(dirname(procfilePath));
    });
    // This listener is required or our `exit` listener will never run.
    process.addListener('SIGINT', () => null);
  });
};
