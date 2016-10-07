#!/usr/bin/env node

const CLI = require('./lib/cli');

const command = new CLI({
  argv: process.argv.slice(2),
  stderr: process.stderr,
  stdin: process.stdin,
  stdout: process.stdout,
});

command.run((error) => {
  if (!error) { return; }
  // console.error(error.message);
  process.exit(1);
});
