#!/usr/bin/env node

'use strict';

const build = require('../scripts/build');
const compress = require('../scripts/compress');
const eject = require('../scripts/eject');
const minimist = require('minimist');
const watch = require('../scripts/watch');

const command = minimist(process.argv.slice(2), {
  alias: {
    b: 'build',
    c: 'compress',
    w: 'watch',
  },
});

if (process.argv.length <= 2 || command.build) {
  build();
  if (command.compress) {
    compress();
  }
} else if (command.compress) {
  compress();
} else if (command.eject) {
  eject();
} else if (command.watch) {
  watch();
}
