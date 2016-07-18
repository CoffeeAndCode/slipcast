const { spawn } = require('child_process');
const { writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const { join } = require('path');
const rimraf = require('rimraf');

module.exports = function() {
  const config = require('../config');

  rimraf.sync(join(process.cwd(), config.output));
  mkdirp.sync(join(process.cwd(), config.output));

  writeFileSync('Procfile', `# Procfile created by Static
  css: ${require.resolve('nodemon/bin/nodemon')} --ext css --exec "${join(__dirname, '../../bin/build-css.js')}" --watch ${config.folders.css}
  html: ${require.resolve('nodemon/bin/nodemon')} --ext hbs --exec "${join(__dirname, '../../bin/build-html.js')}" --watch ${config.folders.pages} --watch ${config.folders.views}
  js: ${require.resolve('nodemon/bin/nodemon')} --exec "${join(__dirname, '../../bin/build-js.js')}" --watch ${config.folders.javascript}
  server: ${require.resolve('browser-sync/bin/browser-sync')} start --config ${join(__dirname, '../../config/browsersync.js')}
  `);

  spawn(require.resolve('foreman/nf'), ['start'], { stdio: 'inherit' });
}
