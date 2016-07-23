#!/usr/bin/env node
'use strict';

const createApp = require('./lib/createApp');
const help = require('./lib/help');
const minimist = require('minimist');
const { version } = require('./package.json');

const commands = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version'
  }
});

if (commands.help || process.argv.length === 2) {
  console.log(help());
  process.exit(1);

} else if (commands.version) {
  console.log(version);
  process.exit();

} else {
  createApp(commands._[0], commands.verbose);
}
