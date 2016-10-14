'use strict';

const { spawn } = require('child_process');

function getCommand(command) {
  if (process.platform === 'win32') {
    if (command === 'npm' || command === 'yarn') {
      return `${command}.cmd`;
    }
    if (command === 'type') {
      return 'where';
    }
  }
  return command;
}

module.exports = function spawnWrapper(command, args, options) {
  return spawn(getCommand(command), args, options);
};
