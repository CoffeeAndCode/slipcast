'use strict';

const { spawn } = require('child_process');

function getCommand(command) {
  if (process.platform === 'win32' && command === 'npm') {
    return 'npm.cmd';
  }
  return command;
}

module.exports = function spawnWrapper(command, args, options) {
  return spawn(getCommand(command), args, options);
};
