#!/usr/bin/env node

const build = require('../lib/cli/build');
const compress = require('../lib/cli/compress');
const help = require('../lib/cli/help');
const minimist = require('minimist');
const version = require('../lib/cli/version');
const watch = require('../lib/cli/watch');

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
  console.log(help());
  return;
} else if (command.version) {
  console.log(version());
  return;
}

if (process.argv.length <= 2 || command.build) {
  build();
  if (command.compress) {
    compress();
  }
} else if (command.compress) {
  compress();
} else if (command.watch) {
  watch();
}
