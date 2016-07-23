#!/usr/bin/env node
'use strict';

const build = require('../lib/cli/build');
const compress = require('../lib/cli/compress');
const minimist = require('minimist');
const watch = require('../lib/cli/watch');

const command = minimist(process.argv.slice(2), {
  alias: {
    b: 'build',
    c: 'compress',
    w: 'watch'
  }
});

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
