'use strict';

const { spawn } = require('child_process');
const config = require('../config/slipcast');
const { mkdtempSync, writeFileSync } = require('fs');
const { emptyDirSync, ensureDir, removeSync } = require('fs-extra');
const { tmpdir } = require('os');
const { dirname, join } = require('path');

function procfileTemplate() {
  return `# Procfile created by Slipcast
css: ${require.resolve('nodemon/bin/nodemon')} --ext css,scss --exec "node ${join(__dirname, '../scripts/build/css.js')}" --watch ${config.folders.css}
html: ${require.resolve('nodemon/bin/nodemon')} --ext hbs --exec "node ${join(__dirname, '../scripts/build/html.js')}" --watch ${config.folders.pages} --watch ${config.folders.views}
js: ${require.resolve('nodemon/bin/nodemon')} --exec "node ${join(__dirname, '../scripts/build/js.js')}" --watch ${config.folders.javascript}
server: ${require.resolve('browser-sync/bin/browser-sync')} start --config ${join(__dirname, '../config/browsersync.js')}
`;
}

module.exports = () => {
  ensureDir(join(process.cwd(), config.output), (error) => {
    if (error) { throw error; }

    emptyDirSync(join(process.cwd(), config.output));

    const procfilePath = join(mkdtempSync(join(tmpdir(), 'slipcast-')), 'Procfile');
    writeFileSync(procfilePath, procfileTemplate());
    console.error(procfilePath);

    spawn(require.resolve('foreman/nf'), ['start', '--procfile', procfilePath], { stdio: 'inherit' });
    process.addListener('exit', () => {
      removeSync(dirname(procfilePath));
    });
    // This listener is required or our `exit` listener will never run.
    process.addListener('SIGINT', () => null);
  });
};
