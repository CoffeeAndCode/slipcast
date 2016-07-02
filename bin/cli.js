#!/usr/bin/env node

const config = require('../lib/config');
const { spawn } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const minimist = require('minimist');
const { version } = require('../package.json');
const { join } = require('path');
const rimraf = require('rimraf');

const command = minimist(process.argv.slice(2), {
  alias: {
    b: 'build',
    c: 'compress',
    h: 'help',
    v: 'version',
    w: 'watch'
  }
});

if (command.help) {
  const help = readFileSync(join(__dirname, '../', 'help.md'), { encoding: 'utf-8' });
  console.log(`\n${help.replace('__VERSION__', version)}`);
  return;

} else if (command.version) {
  console.log(version);
  return;
}

if (process.argv.length <= 2 || command.build) {
  rimraf.sync(join(process.cwd(), config.output));
  mkdirp.sync(join(process.cwd(), config.output));

  spawn(join(__dirname, 'build-css.js'), { stdio: 'inherit' });
  spawn(join(__dirname, 'build-html.js'), { stdio: 'inherit' });
  spawn(join(__dirname, 'build-js.js'), { stdio: 'inherit' });

} else if (command.compress) {
  spawn(join(__dirname, 'gzip.js'), { stdio: 'inherit' });

} else if (command.watch) {
  rimraf.sync(join(process.cwd(), config.output));
  mkdirp.sync(join(process.cwd(), config.output));

  writeFileSync('Procfile', `# Procfile created by Static
css: ${require.resolve('nodemon/bin/nodemon')} --ext css --exec "${join(__dirname, 'build-css.js')}" --watch ${config.folders.css}
html: ${require.resolve('nodemon/bin/nodemon')} --ext hbs --exec "${join(__dirname, 'build-html.js')}" --watch ${config.folders.pages} --watch ${config.folders.views}
js: ${require.resolve('nodemon/bin/nodemon')} --exec "${join(__dirname, 'build-js.js')}" --watch ${config.folders.javascript}
server: ${require.resolve('browser-sync/bin/browser-sync')} start --config ${join(__dirname, '../config/browsersync.js')}
`);

  spawn(require.resolve('foreman/nf'), ['start'], { stdio: 'inherit' });
}
